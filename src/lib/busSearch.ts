import busData from '../../bus-destinations.json';

export interface BusCity {
  id: string;
  name: string;
  state: string;
  stateId: string;
  latitude: string;
  longitude: string;
  locationType: string;
}

const cityMap = new Map<string, BusCity>();
const citiesByStateMap = new Map<string, BusCity[]>();
const allCitiesList: BusCity[] = [];

// Initialize index on module load
(busData.cities as BusCity[]).forEach((city) => {
  if (!city || !city.name) return;

  const cleanName = city.name.trim();
  const normalizedKey = cleanName.toLowerCase();

  const cityObj: BusCity = {
    id: city.id,
    name: cleanName,
    state: city.state || 'India',
    stateId: city.stateId || '',
    latitude: city.latitude || '',
    longitude: city.longitude || '',
    locationType: city.locationType || 'CITY',
  };

  allCitiesList.push(cityObj);
  cityMap.set(normalizedKey, cityObj);

  const stateKey = (city.state || 'Other').toLowerCase().trim();
  if (!citiesByStateMap.has(stateKey)) {
    citiesByStateMap.set(stateKey, []);
  }
  citiesByStateMap.get(stateKey)!.push(cityObj);
});

/**
 * Searches for a bus destination city by name (exact or fuzzy partial match).
 */
export function searchBusCity(cityName: string): { found: boolean; city?: BusCity; matches?: string[] } {
  if (!cityName) return { found: false };

  const query = cityName.toLowerCase().trim();

  // 1. Direct O(1) exact match
  if (cityMap.has(query)) {
    return { found: true, city: cityMap.get(query) };
  }

  // 2. Partial word match
  const matches: BusCity[] = [];
  for (const [key, city] of cityMap.entries()) {
    if (key.includes(query) || query.includes(key)) {
      matches.push(city);
      if (matches.length >= 5) break;
    }
  }

  if (matches.length > 0) {
    return {
      found: true,
      city: matches[0],
      matches: matches.map((m) => `${m.name} (${m.state})`),
    };
  }

  return { found: false };
}

/**
 * Retrieves bus destinations available in a specific state.
 */
export function getBusDestinationsByState(stateName: string, limit = 8): { found: boolean; stateName: string; total: number; cities: string[] } {
  if (!stateName) return { found: false, stateName: '', total: 0, cities: [] };

  const query = stateName.toLowerCase().trim();
  
  // Find matching state key
  let targetKey = query;
  if (!citiesByStateMap.has(query)) {
    for (const key of citiesByStateMap.keys()) {
      if (key.includes(query) || query.includes(key)) {
        targetKey = key;
        break;
      }
    }
  }

  const list = citiesByStateMap.get(targetKey);
  if (!list || list.length === 0) {
    return { found: false, stateName, total: 0, cities: [] };
  }

  return {
    found: true,
    stateName: list[0].state,
    total: list.length,
    cities: list.slice(0, limit).map((c) => c.name),
  };
}

export interface LiveBusTrip {
  travels: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: string;
  fare: string;
  rawFare: number;
  ac: boolean;
}

export interface LiveBusSearchResponse {
  success: boolean;
  originName?: string;
  destinationName?: string;
  originId?: string;
  destinationId?: string;
  travelDate?: string;
  totalTrips?: number;
  cheapestFare?: string;
  highestFare?: string;
  priceRangeStr?: string;
  cheapestTrip?: LiveBusTrip;
  recommendedTrip?: LiveBusTrip;
  trips?: LiveBusTrip[];
  error?: string;
}

/**
 * Resolves a city name or numeric ID string to a valid DPauls City ID.
 */
export function resolveBusCityId(input: string): { id: string | null; name: string } {
  if (!input) return { id: null, name: '' };
  const trimmed = input.trim();
  
  // If input is already numeric ID (e.g., "649")
  if (/^\d+$/.test(trimmed)) {
    const found = allCitiesList.find(c => c.id === trimmed);
    return { id: trimmed, name: found ? found.name : `City #${trimmed}` };
  }

  const search = searchBusCity(trimmed);
  if (search.found && search.city) {
    return { id: search.city.id, name: search.city.name };
  }

  return { id: null, name: trimmed };
}

/**
 * Fetches real-time bus trip data directly from DPauls GraphQL service.
 * Supports origin/destination as city names (e.g. "Mumbai", "Goa") or IDs (e.g. "649", "615").
 */
export async function fetchLiveBusTrips({
  origin,
  destination,
  travelDate = '2026-10-02'
}: {
  origin: string;
  destination: string;
  travelDate?: string;
}): Promise<LiveBusSearchResponse> {
  const originRes = resolveBusCityId(origin);
  const destRes = resolveBusCityId(destination);

  if (!originRes.id || !destRes.id) {
    return {
      success: false,
      error: `Could not resolve bus location ID for origin "${origin}" or destination "${destination}".`,
    };
  }

  const query = `
    query getBusList($payload: JSON) {
      getBusList(payload: $payload)
    }
  `;

  try {
    const response = await fetch('https://gql.dpauls.com/eserver/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: {
          payload: {
            from: originRes.id,
            to: destRes.id,
            date: travelDate,
          },
        },
      }),
    });

    if (!response.ok) {
      return { success: false, error: `GraphQL server returned HTTP status ${response.status}` };
    }

    const json = await response.json();
    const busData = json.data?.getBusList;

    if (!busData || !busData.availableTrips) {
      return {
        success: false,
        originName: originRes.name,
        destinationName: destRes.name,
        travelDate,
        error: `No available bus trips found from ${originRes.name} to ${destRes.name} on ${travelDate}.`,
      };
    }

    const rawTrips = Array.isArray(busData.availableTrips)
      ? busData.availableTrips
      : [busData.availableTrips];

    const trips: LiveBusTrip[] = rawTrips.map((t: any) => {
      let fareVal: number = 0;
      if (Array.isArray(t.fares)) {
        const numFares = t.fares.map(Number).filter((n: number) => !isNaN(n));
        if (numFares.length > 0) fareVal = Math.min(...numFares);
      } else if (t.fares) {
        fareVal = Number(t.fares) || 0;
      }

      const depMinutes = parseInt(t.departureTime || '0', 10);
      const arrMinutes = parseInt(t.arrivalTime || '0', 10);

      const formatMinutesToTime = (mins: number) => {
        if (isNaN(mins) || mins === 0) return t.departureTime || 'TBD';
        const h = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
      };

      return {
        travels: t.travels || 'Standard Operator',
        busType: t.busType || 'A/C Bus',
        departureTime: formatMinutesToTime(depMinutes),
        arrivalTime: formatMinutesToTime(arrMinutes),
        availableSeats: String(t.availableSeats || 'Available'),
        fare: fareVal > 0 ? `₹${fareVal}` : 'Contact for Fare',
        rawFare: fareVal,
        ac: t.AC === 'true' || t.AC === true,
      };
    });

    // Sort trips by fare (ascending)
    const validFareTrips = trips.filter(t => t.rawFare > 0).sort((a, b) => a.rawFare - b.rawFare);
    const cheapestTrip = validFareTrips.length > 0 ? validFareTrips[0] : trips[0];
    const highestTrip = validFareTrips.length > 0 ? validFareTrips[validFareTrips.length - 1] : trips[trips.length - 1];

    // Find recommended trip: AC Sleeper with decent seats or lowest fare among AC buses
    const acTrips = validFareTrips.filter(t => t.ac && t.busType.toLowerCase().includes('sleeper'));
    const recommendedTrip = acTrips.length > 0 ? acTrips[0] : (validFareTrips[0] || trips[0]);

    const minFareStr = cheapestTrip ? cheapestTrip.fare : 'N/A';
    const maxFareStr = highestTrip ? highestTrip.fare : 'N/A';
    const priceRangeStr = `${minFareStr} to ${maxFareStr}`;

    return {
      success: true,
      originName: originRes.name,
      destinationName: destRes.name,
      originId: originRes.id,
      destinationId: destRes.id,
      travelDate,
      totalTrips: trips.length,
      cheapestFare: minFareStr,
      highestFare: maxFareStr,
      priceRangeStr,
      cheapestTrip,
      recommendedTrip,
      trips,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Failed to connect to DPauls bus service: ${err.message}`,
    };
  }
}


