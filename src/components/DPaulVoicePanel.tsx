"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality, Type as SchemaType } from "@google/genai";
import { dpaulAgent } from '@/lib/agents/dpaul';
import { searchBusCity, getBusDestinationsByState, fetchLiveBusTrips } from '@/lib/busSearch';
import { searchHolidayPackages, getPackageDetails } from '@/lib/packageSearch';
import { fetchLiveFlightSearch } from '@/lib/flightSearch';

export type VoiceState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';

function parseSpokenPhoneNumber(phone: string): string {
  if (!phone) return "";
  
  const words = phone.toLowerCase()
    .replace(/[-\(\)\+]/g, ' ')
    .split(/\s+/);
  
  const wordToDigit: { [key: string]: string } = {
    'zero': '0', 'one': '1', 'two': '2', 'to': '2', 'too': '2',
    'three': '3', 'four': '4', 'for': '4', 'five': '5', 'six': '6',
    'seven': '7', 'eight': '8', 'ate': '8', 'nine': '9', 'oh': '0', 'o': '0'
  };

  let result = "";
  let doubleNext = false;
  let tripleNext = false;

  for (let i = 0; i < words.length; i++) {
    const word = words[i].trim();
    if (!word) continue;

    if (word === 'double' || word === 'duble') {
      doubleNext = true;
      continue;
    }
    if (word === 'triple' || word === 'tripple') {
      tripleNext = true;
      continue;
    }

    let digitStr = "";
    if (wordToDigit[word] !== undefined) {
      digitStr = wordToDigit[word];
    } else {
      digitStr = word.replace(/\D/g, '');
    }

    if (digitStr) {
      if (digitStr.length === 1) {
        if (doubleNext) {
          result += digitStr + digitStr;
          doubleNext = false;
        } else if (tripleNext) {
          result += digitStr + digitStr + digitStr;
          tripleNext = false;
        } else {
          result += digitStr;
        }
      } else {
        if (doubleNext) {
          result += digitStr[0] + digitStr;
          doubleNext = false;
        } else if (tripleNext) {
          result += digitStr[0] + digitStr[0] + digitStr;
          tripleNext = false;
        } else {
          result += digitStr;
        }
      }
    }
  }

  return result;
}

interface DPaulVoicePanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestination?: string;
}

const GEMINI_LIVE_MODEL = "gemini-3.1-flash-live-preview";
const OUTPUT_SAMPLE_RATE = 24000;
const INPUT_SAMPLE_RATE = 16000;

function resampleAudio(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const newLength = Math.round(input.length / ratio);
  const output = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const srcIndexFloor = Math.floor(srcIndex);
    const srcIndexCeil = Math.min(srcIndexFloor + 1, input.length - 1);
    const frac = srcIndex - srcIndexFloor;
    output[i] = input[srcIndexFloor] * (1 - frac) + input[srcIndexCeil] * frac;
  }
  return output;
}

function resampleInt16(input: Float32Array, fromRate: number, toRate: number): Int16Array {
  const resampled = resampleAudio(input, fromRate, toRate);
  const pcm16 = new Int16Array(resampled.length);
  for (let i = 0; i < resampled.length; i++) {
    pcm16[i] = Math.max(-1, Math.min(1, resampled[i])) * 0x7fff;
  }
  return pcm16;
}

export default function DPaulVoicePanel({ isOpen, onClose, initialDestination }: DPaulVoicePanelProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const playbackCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const scheduledEndRef = useRef(0);
  const activeConnectionIdRef = useRef(0);
  const connectingRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const processedToolCallsRef = useRef<Set<string>>(new Set());
  const actualPlaybackRateRef = useRef<number>(OUTPUT_SAMPLE_RATE);
  const actualMicRateRef = useRef<number>(INPUT_SAMPLE_RATE);
  const [audioVolume, setAudioVolume] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const logSegment = useCallback((speaker: 'User' | 'Agent', text: string) => {
    setTranscript(text);
  }, []);

  const ensurePlaybackCtx = async (): Promise<AudioContext> => {
    const primed = (window as any).__primedAudioContext;
    const isPrimedValid = primed && primed.state !== 'closed';

    if (!playbackCtxRef.current || playbackCtxRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      playbackCtxRef.current = isPrimedValid ? primed : new AudioCtx({ latencyHint: 'playback' });
      actualPlaybackRateRef.current = playbackCtxRef.current!.sampleRate;
    }
    if (playbackCtxRef.current!.state === 'suspended') {
      await playbackCtxRef.current!.resume();
    }
    return playbackCtxRef.current!;
  };

  const scheduleAudioChunk = useCallback(async (base64Data: string) => {
    if (isMuted) return;
    try {
      const ctx = await ensurePlaybackCtx();
      const binary = atob(base64Data);
      const bytes = Uint8Array.from({ length: binary.length }, (_, i) => binary.charCodeAt(i));
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = Float32Array.from(pcm16, s => s / 32768.0);

      let sum = 0;
      for (let i = 0; i < float32.length; i++) sum += float32[i] * float32[i];
      const rms = Math.sqrt(sum / float32.length);
      setAudioVolume(Math.min(1.0, rms * 5.0));

      const actualRate = ctx.sampleRate;
      let audioData: Float32Array = new Float32Array(float32);
      let bufferRate = OUTPUT_SAMPLE_RATE;
      if (actualRate !== OUTPUT_SAMPLE_RATE) {
        audioData = resampleAudio(float32, OUTPUT_SAMPLE_RATE, actualRate);
        bufferRate = actualRate;
      }

      const buffer = ctx.createBuffer(1, audioData.length, bufferRate);
      buffer.getChannelData(0).set(audioData);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      
      const gainNode = ctx.createGain();
      gainNode.gain.value = 1.5;
      
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      const now = ctx.currentTime;
      const startTime = Math.max(now, scheduledEndRef.current);
      source.start(startTime);
      scheduledEndRef.current = startTime + buffer.duration;
      setTimeout(() => setAudioVolume(0), (audioData.length / bufferRate) * 1000);
    } catch (e) {
      console.error("Error scheduling audio chunk:", e);
    }
  }, [isMuted]);

  const clearAudio = useCallback(() => {
    scheduledEndRef.current = 0;
    if (playbackCtxRef.current) {
      try {
        playbackCtxRef.current.close().catch(() => {});
      } catch (_) {}
      playbackCtxRef.current = null;
    }
    setAudioVolume(0);
  }, []);

  const teardown = useCallback(() => {
    activeConnectionIdRef.current++;
    processedToolCallsRef.current.clear();
    clearAudio();

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (micProcessorRef.current) {
      try { micProcessorRef.current.disconnect(); } catch (_) {}
      micProcessorRef.current = null;
    }
    if (micCtxRef.current) {
      try { micCtxRef.current.close(); } catch (_) {}
      micCtxRef.current = null;
    }
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (_) {}
      sessionRef.current = null;
    }

    connectingRef.current = false;
    setState('idle');
    setAudioVolume(0);
  }, [clearAudio]);

  const startMic = async () => {
    try {
      let stream = micStreamRef.current;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
          video: false
        });
        micStreamRef.current = stream;
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const micCtx = new AudioCtx({ sampleRate: INPUT_SAMPLE_RATE });
      micCtxRef.current = micCtx;
      actualMicRateRef.current = micCtx.sampleRate;
      if (micCtx.state === 'suspended') await micCtx.resume();

      const source = micCtx.createMediaStreamSource(stream);
      const processor = micCtx.createScriptProcessor(4096, 1, 1);
      micProcessorRef.current = processor;
      source.connect(processor);
      processor.connect(micCtx.destination);

      processor.onaudioprocess = (e) => {
        if (!sessionRef.current || state === 'connecting') return;
        const inputData = e.inputBuffer.getChannelData(0);
        let pcm16: Int16Array;
        let sum = 0;

        if (actualMicRateRef.current !== INPUT_SAMPLE_RATE) {
          pcm16 = resampleInt16(inputData, actualMicRateRef.current, INPUT_SAMPLE_RATE);
          for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
        } else {
          pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
            sum += inputData[i] * inputData[i];
          }
        }

        const rms = Math.sqrt(sum / inputData.length);
        if (state === 'listening') setAudioVolume(Math.min(1.0, rms * 5.0));

        const u8 = new Uint8Array(pcm16.buffer);
        const CHUNK_SIZE = 8192;
        let binary = '';
        for (let i = 0; i < u8.length; i += CHUNK_SIZE) {
          const slice = u8.subarray(i, Math.min(i + CHUNK_SIZE, u8.length));
          binary += String.fromCharCode.apply(null, Array.from(slice));
        }
        const base64 = btoa(binary);

        try {
          sessionRef.current.sendRealtimeInput({
            audio: { data: base64, mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}` },
          });
        } catch (err) {}
      };
    } catch (err: any) {
      console.error('Mic access denied:', err);
      setState('error');
      setConnectionError('Microphone access denied. Please allow microphone permissions.');
      teardown();
    }
  };

  const startConnection = useCallback(async () => {
    const connectionId = ++activeConnectionIdRef.current;
    if (connectingRef.current) return;
    connectingRef.current = true;

    setState('connecting');
    setConnectionError(null);
    setTranscript('');

    try {
      await ensurePlaybackCtx();
    } catch (e) {
      console.warn('Failed to prime playback context early:', e);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
        video: false
      });
      micStreamRef.current = stream;
    } catch (err: any) {
      console.error('Microphone permission denied:', err);
      setState('error');
      setConnectionError('Microphone access denied. Please allow microphone permissions.');
      connectingRef.current = false;
      return;
    }

    let sessionToken: string;
    try {
      const res = await fetch('/api/voice/token');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      sessionToken = data.token;
    } catch (err: any) {
      console.error('Failed to get voice token:', err);
      setConnectionError(err?.message || 'Secure session token initialization failed. Check GEMINI_API_KEY.');
      setState('error');
      connectingRef.current = false;
      return;
    }

    try {
      await ensurePlaybackCtx();
      if (connectionId !== activeConnectionIdRef.current) return;

      const ai = new GoogleGenAI({
        apiKey: sessionToken,
        httpOptions: { apiVersion: 'v1alpha' } as any
      });

      const sessionPromise = ai.live.connect({
        model: GEMINI_LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: dpaulAgent.voiceName } },
          },
          systemInstruction: {
            parts: [{ text: dpaulAgent.systemInstruction }]
          },
          tools: [{
            functionDeclarations: [
              {
                name: "capture_lead_and_send_email",
                description: "Captures lead information (name, email, phone) and sends an enterprise enquiry email.",
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    name: { type: SchemaType.STRING, description: "The full name of the user." },
                    email: { type: SchemaType.STRING, description: "The email address of the user." },
                    phone: { type: SchemaType.STRING, description: "The phone number of the user." },
                    industry: { type: SchemaType.STRING, description: "The desired holiday package destination." },
                    notes: { type: SchemaType.STRING, description: "Any additional notes, travel dates, or reason for contact." }
                  },
                  required: ["name", "email", "phone"]
                }
              },
              {
                name: "search_bus_destination",
                description: "Searches if a city or location is available in DPauls intercity bus network (bus destinations database).",
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    cityName: { type: SchemaType.STRING, description: "The city or destination name to search (e.g. Abu Road, Manali, Abohar, Kochi, Achampet)." }
                  },
                  required: ["cityName"]
                }
              },
              {
                name: "get_bus_destinations_by_state",
                description: "Retrieves bus destination cities available in a specific Indian state in DPauls network.",
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    stateName: { type: SchemaType.STRING, description: "The Indian state name (e.g. Himachal Pradesh, Rajasthan, Kerala, Punjab, Tamil Nadu, Andhra Pradesh)." }
                  },
                  required: ["stateName"]
                }
              },
              {
                name: "search_live_bus_trips",
                description: "Fetches live bus schedules, operators, ticket fares, departure/arrival times, and available seat counts between origin and destination cities for a travel date.",
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    origin: { type: SchemaType.STRING, description: "Origin city name or city ID (e.g. Mumbai, 649, Delhi, Bangalore)." },
                    destination: { type: SchemaType.STRING, description: "Destination city name or city ID (e.g. Goa, 615, Manali, Shimla)." },
                    travelDate: { type: SchemaType.STRING, description: "Confirmed date of travel in YYYY-MM-DD format (e.g. 2026-10-02)." }
                  },
                  required: ["origin", "destination", "travelDate"]
                }
              },
              {
                name: "search_holiday_packages",
                description: "Searches official DPauls tour packages for a holiday destination once destination and travel date/month are confirmed by user.",
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    destination: { type: SchemaType.STRING, description: "The holiday destination name (e.g. Europe, Dubai, Kerala, Thailand, Kashmir, Bali)." },
                    travelDate: { type: SchemaType.STRING, description: "The planned travel date or month (e.g. October, November 2026, 2026-10-02)." }
                  },
                  required: ["destination", "travelDate"]
                }
              },
              {
                name: "get_package_details",
                description: "Retrieves complete itinerary, night stay breakdown, and inclusions for a specific package product code (e.g. DP701, DP138, DP219).",
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    productCode: { type: SchemaType.STRING, description: "The product code of the tour package (e.g. DP701)." }
                  },
                  required: ["productCode"]
                }
              },
              {
                name: "search_live_flights",
                description: "Searches live flight availability, airline carriers, ticket fares, departure/arrival times, and direct/stopover details for domestic or international flights.",
                parameters: {
                  type: SchemaType.OBJECT,
                  properties: {
                    origin: { type: SchemaType.STRING, description: "Origin city or airport code (e.g. Delhi, DEL, Mumbai, BOM, Chennai, MAA)." },
                    destination: { type: SchemaType.STRING, description: "Destination city or airport code (e.g. Chennai, MAA, Dubai, DXB, London, LHR)." },
                    departureDate: { type: SchemaType.STRING, description: "Departure date string (e.g. 17 Aug 2026, 15 Oct 2026)." },
                    returnDate: { type: SchemaType.STRING, description: "Optional return date for round trip (e.g. 20 Aug 2026)." },
                    cabinClass: { type: SchemaType.STRING, description: "Cabin class: Y for Economy, C for Business, F for First Class, PE for Premium Economy (default Y)." }
                  },
                  required: ["origin", "destination", "departureDate"]
                }
              }
            ]
          }],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            if (connectionId !== activeConnectionIdRef.current) {
              teardown();
              return;
            }
            setState('listening');
            connectingRef.current = false;

            sessionIdRef.current = `dpaul-${Date.now()}`;

            sessionPromise.then(session => {
              if (connectionId !== activeConnectionIdRef.current) return;
              sessionRef.current = session;

              let greetingText = `User joined. Speak in clear, polished Indian English by default. Introduce yourself warmly in Indian English as DPauls Travel AI advisor. Vibe: "${dpaulAgent.greeting}". Keep it short, professional, and energetic.`;
              if (initialDestination) {
                greetingText += ` The user clicked on the ${initialDestination} package. Acknowledge this destination warmly in your intro.`;
              }
              try {
                session.sendRealtimeInput({ text: greetingText });
              } catch(e) {
                console.error("Greeting trigger failed", e);
              }
              startMic();
            });
          },

          onmessage: async (msg: any) => {
            if (connectionId !== activeConnectionIdRef.current) return;

            const functionCalls = msg.toolCall?.functionCalls || 
                                 msg.serverContent?.modelTurn?.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall) ||
                                 [];

            for (const call of functionCalls) {
              const callId = call.id || call.name;
              if (processedToolCallsRef.current.has(callId)) continue;

              if (call.name === "search_bus_destination") {
                processedToolCallsRef.current.add(callId);
                const { cityName } = call.args;
                const searchRes = searchBusCity(cityName || '');
                console.log(`[DPaulVoicePanel] Bus search tool result for "${cityName}":`, searchRes);

                if (searchRes.found && searchRes.city) {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "search_bus_destination",
                      response: {
                        available: true,
                        cityName: searchRes.city.name,
                        state: searchRes.city.state,
                        message: `Yes! Bus connections to ${searchRes.city.name} in ${searchRes.city.state} are available on DPauls network.`
                      }
                    }]
                  });
                } else {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "search_bus_destination",
                      response: {
                        available: false,
                        message: `No direct bus stop found for "${cityName}". DPauls can arrange flight tickets or custom tour cabs.`
                      }
                    }]
                  });
                }
              }

              if (call.name === "get_bus_destinations_by_state") {
                processedToolCallsRef.current.add(callId);
                const { stateName } = call.args;
                const stateRes = getBusDestinationsByState(stateName || '');
                console.log(`[DPaulVoicePanel] State bus search result for "${stateName}":`, stateRes);

                if (stateRes.found) {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "get_bus_destinations_by_state",
                      response: {
                        available: true,
                        state: stateRes.stateName,
                        totalDestinationsCount: stateRes.total,
                        sampleDestinations: stateRes.cities,
                        message: `Found ${stateRes.total} bus destinations in ${stateRes.stateName}. Popular stops include: ${stateRes.cities.join(', ')}.`
                      }
                    }]
                  });
                } else {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "get_bus_destinations_by_state",
                      response: {
                        available: false,
                        message: `No bus destinations found for state "${stateName}".`
                      }
                    }]
                  });
                }
              }

              if (call.name === "search_live_bus_trips") {
                processedToolCallsRef.current.add(callId);
                const { origin, destination, travelDate } = call.args;
                const liveRes = await fetchLiveBusTrips({ origin, destination, travelDate });
                console.log(`[DPaulVoicePanel] Live bus search result for ${origin} -> ${destination}:`, liveRes);

                if (liveRes.success && liveRes.trips && liveRes.trips.length > 0) {
                  const cheapest = liveRes.cheapestTrip;
                  const recommended = liveRes.recommendedTrip;

                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "search_live_bus_trips",
                      response: {
                        success: true,
                        route: `${liveRes.originName} to ${liveRes.destinationName}`,
                        travelDate: liveRes.travelDate,
                        totalBusesFound: liveRes.totalTrips,
                        priceRange: liveRes.priceRangeStr,
                        cheapestOption: cheapest ? {
                          operator: cheapest.travels,
                          busType: cheapest.busType,
                          departureTime: cheapest.departureTime,
                          arrivalTime: cheapest.arrivalTime,
                          fare: cheapest.fare,
                          seatsLeft: cheapest.availableSeats
                        } : null,
                        recommendedOption: recommended ? {
                          operator: recommended.travels,
                          busType: recommended.busType,
                          departureTime: recommended.departureTime,
                          arrivalTime: recommended.arrivalTime,
                          fare: recommended.fare,
                          seatsLeft: recommended.availableSeats
                        } : null,
                        instructions: `Found ${liveRes.totalTrips} buses from ${liveRes.originName} to ${liveRes.destinationName} on ${liveRes.travelDate}. Prices range from ${liveRes.priceRangeStr}. Tell the caller the price range, then highlight the cheapest price (${cheapest?.fare} - ${cheapest?.travels}) and recommended AC sleeper (${recommended?.fare} - ${recommended?.travels}). Ask the caller if they prefer the cheapest option, recommended option, or if they want to give a specific price range/budget.`
                      }
                    }]
                  });
                } else {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "search_live_bus_trips",
                      response: {
                        success: false,
                        message: liveRes.error || `No live buses found for route ${origin} to ${destination}.`
                      }
                    }]
                  });
                }
              }

              if (call.name === "search_holiday_packages") {
                processedToolCallsRef.current.add(callId);
                const { destination, travelDate } = call.args;
                const pkgRes = await searchHolidayPackages({ destination });
                console.log(`[DPaulVoicePanel] Holiday package search result for "${destination}" (${travelDate}):`, pkgRes);

                if (pkgRes.success && pkgRes.packages && pkgRes.packages.length > 0) {
                  const topPkgs = pkgRes.packages.slice(0, 3).map(p => 
                    `${p.name} (Code: ${p.code}, Duration: ${p.total_nights} Nights, Covers: ${p.destinations_covered})`
                  ).join('; ');

                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "search_holiday_packages",
                      response: {
                        success: true,
                        destination: pkgRes.destinationName,
                        travelDate: travelDate || 'Upcoming',
                        totalPackages: pkgRes.totalPackages,
                        topPackages: topPkgs,
                        message: `Found ${pkgRes.totalPackages} tour packages for ${pkgRes.destinationName} for travel in ${travelDate || 'the selected period'}. Featured packages: ${topPkgs}`
                      }
                    }]
                  });
                } else {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "search_holiday_packages",
                      response: {
                        success: false,
                        message: pkgRes.error || `No packages found for ${destination}.`
                      }
                    }]
                  });
                }
              }

              if (call.name === "get_package_details") {
                processedToolCallsRef.current.add(callId);
                const { productCode } = call.args;
                const detailsRes = await getPackageDetails(productCode);
                console.log(`[DPaulVoicePanel] Package details result for "${productCode}":`, detailsRes);

                if (detailsRes.success) {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "get_package_details",
                      response: {
                        success: true,
                        code: detailsRes.code,
                        name: detailsRes.name,
                        duration: `${detailsRes.total_nights} Nights`,
                        destinationsCovered: detailsRes.destinations_covered,
                        inclusions: detailsRes.inclusions,
                        message: `Package ${detailsRes.name} (${detailsRes.code}): ${detailsRes.total_nights} Nights covering ${detailsRes.destinations_covered}. Key inclusions: ${detailsRes.inclusions?.slice(0, 5).join(', ')}.`
                      }
                    }]
                  });
                } else {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "get_package_details",
                      response: {
                        success: false,
                        message: detailsRes.error || `Could not fetch details for package code ${productCode}.`
                      }
                    }]
                  });
                }
              }

              if (call.name === "search_live_flights") {
                processedToolCallsRef.current.add(callId);
                const { origin, destination, departureDate, returnDate, cabinClass } = call.args;
                const fltRes = await fetchLiveFlightSearch({ origin, destination, departureDate, returnDate, cabinClass });
                console.log(`[DPaulVoicePanel] Live flight search result for ${origin} -> ${destination}:`, fltRes);

                if (fltRes.success && fltRes.flights && fltRes.flights.length > 0) {
                  const cheapest = fltRes.cheapestFlight;
                  const topFlights = fltRes.flights.slice(0, 3).map(f => 
                    `${f.airlineName} (${f.flightCode}) dep: ${f.departureTime}, arr: ${f.arrivalTime} - ${f.fare}`
                  ).join('; ');

                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "search_live_flights",
                      response: {
                        success: true,
                        route: `${fltRes.originCity} to ${fltRes.destinationCity}`,
                        departureDate: fltRes.departureDate,
                        totalFlightsFound: fltRes.totalFlights,
                        priceRange: fltRes.priceRange,
                        cheapestOption: cheapest ? {
                          airline: cheapest.airlineName,
                          flightCode: cheapest.flightCode,
                          departureTime: cheapest.departureTime,
                          arrivalTime: cheapest.arrivalTime,
                          fare: cheapest.fare
                        } : null,
                        topOptions: topFlights,
                        instructions: `Found ${fltRes.totalFlights} live flights for ${fltRes.originCity} to ${fltRes.destinationCity} on ${fltRes.departureDate}. Price range: ${fltRes.priceRange}. State the price range, highlight the cheapest airline fare (${cheapest?.airlineName} - ${cheapest?.fare}), and ask if they prefer Economy or Business class, or if they have a target budget.`
                      }
                    }]
                  });
                } else {
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "search_live_flights",
                      response: {
                        success: false,
                        message: fltRes.error || `No live flights found from ${origin} to ${destination} for date ${departureDate}.`
                      }
                    }]
                  });
                }
              }

              if (call.name === "capture_lead_and_send_email") {
                processedToolCallsRef.current.add(callId);
                const { name, email, phone, industry, notes } = call.args;
                
                const cleanedEmail = (email || '').replace(/^mailto:/i, '').trim();
                const cleanedPhone = parseSpokenPhoneNumber(phone);
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isEmailValid = emailRegex.test(cleanedEmail);

                let isPhoneValid = false;
                let finalPhone = cleanedPhone;
                if (cleanedPhone.length === 10) {
                  isPhoneValid = true;
                } else if (cleanedPhone.length === 12 && cleanedPhone.startsWith('91')) {
                  finalPhone = cleanedPhone.substring(2);
                  isPhoneValid = true;
                } else if (cleanedPhone.length === 11 && cleanedPhone.startsWith('0')) {
                  finalPhone = cleanedPhone.substring(1);
                  isPhoneValid = true;
                }

                if (!isEmailValid || !isPhoneValid) {
                  const errorMsg = !isEmailValid 
                    ? "Invalid email format. Please repeat it back and confirm the correct email address."
                    : "Invalid phone number. It must be a valid 10-digit number. Please ask the user for a valid 10-digit mobile number.";
                  
                  console.warn(`[DPaulVoicePanel] Validation failed:`, { email, phone });
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "capture_lead_and_send_email",
                      response: { success: false, error: errorMsg }
                    }]
                  });
                  continue;
                }

                try {
                  const names = name.split(" ");
                  const firstName = names[0];
                  const lastName = names.length > 1 ? names.slice(1).join(" ") : "Holiday Lead";

                  fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      firstName,
                      lastName,
                      email: cleanedEmail,
                      phone: finalPhone,
                      companyName: "DPauls Holiday Lead",
                      additionalInfo: notes || `Captured for ${industry || 'General Enquiry'}`,
                      sourceAgent: dpaulAgent.id
                    })
                  }).catch(err => console.error("Contact API post fail:", err));

                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "capture_lead_and_send_email",
                      response: { success: true, message: "Enquiry submitted successfully." }
                    }]
                  });
                } catch (err) {
                  console.error("Tool execution error:", err);
                  sessionRef.current?.sendToolResponse({
                    functionResponses: [{
                      id: call.id,
                      name: "capture_lead_and_send_email",
                      response: { success: false, error: "System registration failed." }
                    }]
                  });
                }
              }
            }

            const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              setState('speaking');
              scheduleAudioChunk(audio);
            }

            if (msg.serverContent?.interrupted) {
              clearAudio();
              setState('listening');
            }

            const userText = 
              msg.serverContent?.inputTranscription?.text ||
              msg.inputAudioTranscription?.parts?.[0]?.text ||
              msg.inputAudioTranscription?.text ||
              msg.serverContent?.userTurn?.parts?.[0]?.text;

            if (userText && userText.trim()) {
              logSegment('User', userText.trim());
            }

            const textPart = msg.serverContent?.outputTranscription?.text;
            if (textPart) {
              logSegment('Agent', textPart);
            }

            if (msg.serverContent?.turnComplete) {
              setState('listening');
              setAudioVolume(0);
            }
          },

          onerror: (err: any) => {
            if (connectionId !== activeConnectionIdRef.current) return;
            console.error('[DPaulVoicePanel] Live error:', err);
            setState('error');
            setConnectionError(err?.message || 'Voice session connection error.');
            teardown();
          },

          onclose: (ev?: any) => {
            if (connectionId !== activeConnectionIdRef.current) return;
            console.log('[DPaulVoicePanel] Session closed', ev);
            teardown();
          }
        }
      });

      await sessionPromise;

    } catch (err: any) {
      console.error('[DPaulVoicePanel] Error connecting:', err);
      connectingRef.current = false;
      setState('error');
      setConnectionError(err?.message || 'Failed to establish live channel.');
      teardown();
    }
  }, [scheduleAudioChunk, clearAudio, teardown, logSegment, initialDestination]);

  useEffect(() => {
    if (isOpen) {
      startConnection();
    } else {
      teardown();
      setTranscript('');
    }
    return () => teardown();
  }, [isOpen, startConnection, teardown]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.08;

      let numWaves = 3;
      let amplitude = 0;
      let frequency = 0.02;
      let speedFactor = 1;

      if (state === 'listening') {
        amplitude = 6 + audioVolume * 36;
        frequency = 0.02;
        numWaves = 4;
        speedFactor = 1.1;
      } else if (state === 'speaking') {
        amplitude = 8 + audioVolume * 45;
        frequency = 0.025;
        numWaves = 5;
        speedFactor = 1.4;
      } else if (state === 'connecting') {
        amplitude = 3;
        frequency = 0.01;
        numWaves = 2;
        speedFactor = 0.6;
      } else {
        amplitude = 0.5;
        frequency = 0.005;
        numWaves = 1;
        speedFactor = 0.15;
      }

      ctx.lineWidth = 1.25;

      for (let i = 0; i < numWaves; i++) {
        ctx.beginPath();
        const yOffset = (i - (numWaves - 1) / 2) * 1.5;
        const wavePhase = phase * speedFactor + i * (Math.PI / 8);
        const opacity = 0.8 - (i / numWaves) * 0.5;
        
        ctx.strokeStyle = `rgba(0, 201, 183, ${opacity})`;

        for (let x = 0; x < width; x++) {
          const envelope = Math.sin((x / width) * Math.PI);
          const y = height / 2 + yOffset + Math.sin(x * frequency + wavePhase) * amplitude * envelope;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [state, audioVolume]);

  const handleRetry = () => {
    teardown();
    ensurePlaybackCtx().catch(() => {});
    startConnection();
  };

  const handleTryClose = () => {
    teardown();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-xl p-0 md:p-4 transition-all duration-300">
      <div className="absolute inset-0" onClick={handleTryClose} />

      <AnimatePresence>
        <motion.div
          initial={{ y: "100%", opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full md:max-w-[480px] bg-[#0d1b2a]/95 border-t md:border border-[#00c9b7]/30 rounded-t-[32px] md:rounded-[28px] shadow-2xl shadow-black/90 backdrop-blur-2xl overflow-hidden h-[58vh] md:h-auto flex flex-col z-10 p-6 pb-8 md:pb-6 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                state === 'listening' ? 'bg-[#00c9b7] animate-pulse shadow-sm shadow-[#00c9b7]' :
                state === 'speaking' ? 'bg-[#00c9b7] shadow-sm shadow-[#00c9b7]' :
                state === 'connecting' ? 'bg-amber-400 animate-pulse' :
                state === 'error' ? 'bg-red-500' : 'bg-slate-500'
              }`} />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#00c9b7]">
                {state === 'connecting' ? 'CONNECTING...' :
                 state === 'listening' ? 'LISTENING...' :
                 state === 'speaking' ? 'SPEAKING...' :
                 state === 'error' ? 'ERROR' : 'READY'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all cursor-pointer border border-white/10"
                title={isMuted ? "Unmute DPaul AI" : "Mute DPaul AI"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleTryClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-all cursor-pointer border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Content */}
          <div className="flex-1 flex flex-col items-center justify-center py-2 md:py-4 relative">
            <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mb-4 md:mb-6">
              <AnimatePresence>
                {(state === 'listening' || state === 'speaking') && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-[#00c9b7]/30 bg-[#00c9b7]/10"
                    />
                    <motion.div
                      animate={{ scale: 1.02 + audioVolume * 0.15 }}
                      transition={{ duration: 0.1 }}
                      className="absolute w-26 h-26 md:w-32 md:h-32 rounded-full border border-[#00c9b7]/50 bg-[#00c9b7]/20 shadow-md shadow-[#00c9b7]/30"
                    />
                  </>
                )}
              </AnimatePresence>

              <motion.div
                animate={(state === 'listening' || state === 'speaking') ? {
                  scale: 1 + audioVolume * 0.08
                } : { scale: 1 }}
                transition={{ duration: 0.15 }}
                onClick={state === 'error' ? handleRetry : handleTryClose}
                className="absolute w-22 h-22 md:w-26 md:h-26 rounded-full bg-[#0d1b2a] border-2 border-[#00c9b7] shadow-xl shadow-[#00c9b7]/30 flex items-center justify-center z-10 cursor-pointer overflow-hidden transition-transform hover:scale-105"
              >
                <img
                  src="/ai-avatar.png"
                  alt="DPauls AI Advisor"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#00c9b7] flex items-center justify-center text-[#0d1b2a] shadow-md">
                  <Mic className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            </div>

            {/* Canvas Visualizer */}
            <div className="w-full h-12 md:h-14 relative">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Static Subtitle / Status Display */}
            <div className="w-full max-w-[360px] text-center min-h-[44px] px-4 mt-4 flex items-center justify-center">
              {state === 'error' ? (
                <p className="text-xs font-semibold text-red-400">
                  {connectionError || 'An error occurred during secure connection setup.'}
                </p>
              ) : state === 'connecting' ? (
                <p className="text-sm font-medium text-[#00c9b7] italic animate-pulse">
                  Connecting to DPauls Voice Stack...
                </p>
              ) : (
                <p className="text-sm font-semibold text-white leading-relaxed max-line-clamp-2">
                  "Namaste! How can DPauls AI help with your holiday plans today?"
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 text-center border-t border-white/10 pt-3">
            <span className="text-[10px] font-bold text-[#00c9b7]/80 uppercase tracking-widest">
              DPauls Travel & Tours AI Voice Channel
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
