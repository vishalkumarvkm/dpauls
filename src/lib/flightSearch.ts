const GRAPHQL_URL = 'https://gql.dpauls.com/eserver/graphql';

export interface AirportInfo {
  code: string;
  cityName: string;
  country: string;
}

const AIRPORT_MAP: { [key: string]: AirportInfo } = {
  'delhi': { code: 'DEL', cityName: 'New Delhi', country: 'India' },
  'new delhi': { code: 'DEL', cityName: 'New Delhi', country: 'India' },
  'del': { code: 'DEL', cityName: 'New Delhi', country: 'India' },
  'mumbai': { code: 'BOM', cityName: 'Mumbai', country: 'India' },
  'bom': { code: 'BOM', cityName: 'Mumbai', country: 'India' },
  'chennai': { code: 'MAA', cityName: 'Chennai', country: 'India' },
  'maa': { code: 'MAA', cityName: 'Chennai', country: 'India' },
  'bangalore': { code: 'BLR', cityName: 'Bengaluru', country: 'India' },
  'bengaluru': { code: 'BLR', cityName: 'Bengaluru', country: 'India' },
  'blr': { code: 'BLR', cityName: 'Bengaluru', country: 'India' },
  'kolkata': { code: 'CCU', cityName: 'Kolkata', country: 'India' },
  'ccu': { code: 'CCU', cityName: 'Kolkata', country: 'India' },
  'hyderabad': { code: 'HYD', cityName: 'Hyderabad', country: 'India' },
  'hyd': { code: 'HYD', cityName: 'Hyderabad', country: 'India' },
  'goa': { code: 'GOI', cityName: 'Goa', country: 'India' },
  'goi': { code: 'GOI', cityName: 'Goa', country: 'India' },
  'dubai': { code: 'DXB', cityName: 'Dubai', country: 'United Arab Emirates' },
  'dxb': { code: 'DXB', cityName: 'Dubai', country: 'United Arab Emirates' },
  'london': { code: 'LHR', cityName: 'London', country: 'United Kingdom' },
  'lhr': { code: 'LHR', cityName: 'London', country: 'United Kingdom' },
  'singapore': { code: 'SIN', cityName: 'Singapore', country: 'Singapore' },
  'sin': { code: 'SIN', cityName: 'Singapore', country: 'Singapore' },
  'bangkok': { code: 'BKK', cityName: 'Bangkok', country: 'Thailand' },
  'bkk': { code: 'BKK', cityName: 'Bangkok', country: 'Thailand' },
};

export interface FlightItem {
  id: string;
  airlineName: string;
  flightCode: string;
  srcCode: string;
  destCode: string;
  departureTime: string;
  arrivalTime: string;
  duration?: string;
  stops: number;
  cabinClass: string;
  fare: string;
  rawFare: number;
  mealInfo?: string;
}

export interface LiveFlightSearchResponse {
  success: boolean;
  originCity?: string;
  destinationCity?: string;
  originCode?: string;
  destinationCode?: string;
  departureDate?: string;
  returnDate?: string;
  isDomestic?: boolean;
  isRoundTrip?: boolean;
  totalFlights?: number;
  cheapestFare?: string;
  highestFare?: string;
  priceRange?: string;
  cheapestFlight?: FlightItem;
  fastestFlight?: FlightItem;
  flights?: FlightItem[];
  error?: string;
}

export function resolveAirport(input: string): AirportInfo {
  if (!input) return { code: 'DEL', cityName: 'New Delhi', country: 'India' };
  const q = input.toLowerCase().trim();

  if (AIRPORT_MAP[q]) return AIRPORT_MAP[q];

  for (const key of Object.keys(AIRPORT_MAP)) {
    if (key.includes(q) || q.includes(key)) {
      return AIRPORT_MAP[key];
    }
  }

  // If 3-letter IATA code
  if (input.trim().length === 3) {
    const uppercase = input.trim().toUpperCase();
    return { code: uppercase, cityName: uppercase, country: 'Global' };
  }

  return { code: 'DEL', cityName: input, country: 'India' };
}

/**
 * Fetches flight availability live from DPauls GraphQL API (`flt_availability`).
 */
export async function fetchLiveFlightSearch({
  origin,
  destination,
  departureDate = '17 Aug 2026',
  returnDate = '',
  adults = 1,
  children = 0,
  infants = 0,
  cabinClass = 'Y',
}: {
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: 'Y' | 'C' | 'F' | 'PE' | string;
}): Promise<LiveFlightSearchResponse> {
  const srcInfo = resolveAirport(origin);
  const destInfo = resolveAirport(destination);

  const isDomestic = srcInfo.country === 'India' && destInfo.country === 'India';
  const isRoundTrip = Boolean(returnDate && returnDate.trim().length > 0);

  // 1. Fetch active flight suppliers & credentials from DPauls GraphQL backend
  let suppliers: { supplier: string; cred: string }[] = [];
  try {
    const credRes = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { flt_credentials { supplier credentials } }`
      }),
    });
    const credJson = await credRes.json();
    if (credJson.data?.flt_credentials) {
      credJson.data.flt_credentials.forEach((c: any) => {
        if (c.credentials && c.credentials.length > 0) {
          suppliers.push({ supplier: c.supplier, cred: c.credentials[0] });
        }
      });
    }
  } catch (e) {
    console.warn('[FlightSearch] Failed to fetch credentials, using fallback:', e);
  }

  if (suppliers.length === 0) {
    suppliers = [
      { supplier: 'gal', cred: 'cl2it8pzz0000y9nperj34bcc' },
      { supplier: 'indigo', cred: 'cl2itbs6k0002y9npdewu-ez8' },
      { supplier: 'kafila', cred: 'zyx955zjhzszoxottyt884ae' },
    ];
  }

  const query = `
    query flt_availability($apiType: String!, $payload: JSON!) {
      flt_availability(apiType: $apiType, payload: $payload)
    }
  `;

  const fltparam = {
    src: srcInfo.code,
    dest: destInfo.code,
    deptDT: departureDate,
    arrDT: returnDate,
    adt: adults,
    chd: children,
    inf: infants,
    isDom: isDomestic,
    isRT: isRoundTrip,
    bcls: cabinClass,
    srcCity: srcInfo.cityName,
    destCity: destInfo.cityName,
    is_group: false,
  };

  const allFlights: FlightItem[] = [];

  // Query suppliers in parallel
  await Promise.all(
    suppliers.map(async (s) => {
      try {
        const payload = { fltparam: { ...fltparam, cred: s.cred } };
        const res = await fetch(GRAPHQL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            variables: { apiType: s.supplier, payload },
          }),
        });

        if (!res.ok) return;

        const json = await res.json();
        const avail = json.data?.flt_availability;

        if (Array.isArray(avail) && avail.length > 0) {
          avail.forEach((item: any, idx: number) => {
            const route = item.RouteDetails?.[0] || item.onward_list?.[0]?.RouteDetails?.[0] || {};
            const fareDetails = item.FareDetails || item.fareDetails || {};
            const rawFare = Number(fareDetails.TotalFare || fareDetails.totalFare || item.Fares || item.fare || 0);

            allFlights.push({
              id: `${s.supplier}-${idx}`,
              airlineName: route.airlineName || item.AirLineCode || 'Airline Partner',
              flightCode: route.flightCode || route.flightNo || 'FLT',
              srcCode: route.srcCode || srcInfo.code,
              destCode: route.destCode || destInfo.code,
              departureTime: route.deptm || route.departureTime || 'TBD',
              arrivalTime: route.arrtm || route.arrivalTime || 'TBD',
              duration: route.TotDuration || route.duration || 'Direct',
              stops: route.stops !== undefined ? Number(route.stops) : 0,
              cabinClass: route.cabinClass || (cabinClass === 'C' ? 'Business' : 'Economy'),
              fare: rawFare > 0 ? `₹${rawFare}` : 'Contact for Fare',
              rawFare: rawFare,
              mealInfo: route.mealRmk || undefined,
            });
          });
        }
      } catch (err) {
        console.warn(`[FlightSearch] Supplier ${s.supplier} failed:`, err);
      }
    })
  );

  if (allFlights.length === 0) {
    return {
      success: false,
      originCity: srcInfo.cityName,
      destinationCity: destInfo.cityName,
      originCode: srcInfo.code,
      destinationCode: destInfo.code,
      departureDate,
      error: `No flight availability returned for ${srcInfo.cityName} to ${destInfo.cityName} on ${departureDate}.`,
    };
  }

  // Sort flights by raw fare
  const validFareFlights = allFlights.filter(f => f.rawFare > 0).sort((a, b) => a.rawFare - b.rawFare);
  const cheapestFlight = validFareFlights.length > 0 ? validFareFlights[0] : allFlights[0];
  const highestFlight = validFareFlights.length > 0 ? validFareFlights[validFareFlights.length - 1] : allFlights[allFlights.length - 1];

  const minFareStr = cheapestFlight ? cheapestFlight.fare : 'N/A';
  const maxFareStr = highestFlight ? highestFlight.fare : 'N/A';

  return {
    success: true,
    originCity: srcInfo.cityName,
    destinationCity: destInfo.cityName,
    originCode: srcInfo.code,
    destinationCode: destInfo.code,
    departureDate,
    returnDate,
    isDomestic,
    isRoundTrip,
    totalFlights: allFlights.length,
    cheapestFare: minFareStr,
    highestFare: maxFareStr,
    priceRange: `${minFareStr} to ${maxFareStr}`,
    cheapestFlight,
    flights: validFareFlights.slice(0, 10),
  };
}
