const REST_API_BASE = 'https://rest.dpauls.com';

const API_HEADERS = {
  'AffiliateID': 'dpaulsaff',
  'sub-agency': '6a4385dcc2c997646fb477df',
  'Authorization': 'ckd76xj3z0000315p0eyhlo8q',
  'Content-Type': 'application/json',
};

export interface PackageDestination {
  destinationId: number;
  destinationName: string;
  destinationCode?: string;
  destinationType?: string;
  parentId?: number | null;
}

export interface PackageItem {
  code: string;
  name: string;
  destinations_covered: string;
  total_nights: number;
  themes?: string[];
  starting_price?: string | number;
  slug?: string;
  pkg_type?: string;
}

export interface PackageSearchResponse {
  success: boolean;
  destinationName?: string;
  destinationId?: number;
  totalPackages?: number;
  packages?: PackageItem[];
  error?: string;
}

export interface PackageDetailsResponse {
  success: boolean;
  code?: string;
  name?: string;
  total_nights?: number;
  destinations_covered?: string;
  themes?: string[];
  inclusions?: string[];
  cancellation_policy?: string;
  terms_conditions?: string;
  error?: string;
}

let cachedDestinations: PackageDestination[] | null = null;

/**
 * Fetches all package destinations from DPauls REST API.
 */
export async function getPackageDestinations(): Promise<PackageDestination[]> {
  if (cachedDestinations && cachedDestinations.length > 0) {
    return cachedDestinations;
  }

  try {
    const res = await fetch(`${REST_API_BASE}/packages/destinations`, {
      headers: API_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data)) {
      cachedDestinations = data;
      return data;
    }
    return [];
  } catch (err) {
    console.error('[PackageSearch] Error fetching destinations:', err);
    return [];
  }
}

/**
 * Resolves a destination name (e.g., "Europe", "Dubai", "Kerala", "Bali", "Thailand") to a destination ID.
 */
export async function resolveDestinationId(queryName: string): Promise<PackageDestination | null> {
  if (!queryName) return null;
  const q = queryName.toLowerCase().trim();

  const destinations = await getPackageDestinations();
  
  // 1. Exact match
  const exact = destinations.find(d => d.destinationName.toLowerCase().trim() === q);
  if (exact) return exact;

  // 2. Partial match
  const partial = destinations.find(d => d.destinationName.toLowerCase().includes(q) || q.includes(d.destinationName.toLowerCase()));
  if (partial) return partial;

  return null;
}

/**
 * Searches holiday packages for a destination name or destination ID.
 */
export async function searchHolidayPackages({
  destination,
  from = 1,
  to = 50,
}: {
  destination: string;
  from?: number;
  to?: number;
}): Promise<PackageSearchResponse> {
  try {
    let destId: number | null = null;
    let destName = destination;

    if (/^\d+$/.test(destination.trim())) {
      destId = parseInt(destination.trim(), 10);
    } else {
      const resolved = await resolveDestinationId(destination);
      if (resolved) {
        destId = resolved.destinationId;
        destName = resolved.destinationName;
      }
    }

    if (!destId) {
      return {
        success: false,
        error: `Could not resolve destination ID for "${destination}".`,
      };
    }

    const url = `${REST_API_BASE}/packages/search/products?dest_id=${destId}&from=${from}&to=${to}`;
    const res = await fetch(url, {
      headers: API_HEADERS,
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return { success: false, error: `REST API returned status ${res.status}` };
    }

    const result = await res.json();
    const pkgList: any[] = result.data || result;

    if (!Array.isArray(pkgList) || pkgList.length === 0) {
      return {
        success: false,
        destinationName: destName,
        destinationId: destId,
        error: `No tour packages found for destination "${destName}".`,
      };
    }

    const packages: PackageItem[] = pkgList.map((p: any) => ({
      code: p.code || '',
      name: p.name || 'DPauls Special Package',
      destinations_covered: p.destinations_covered || '',
      total_nights: p.total_nights || 0,
      themes: p.themes || [],
      slug: p.slug || '',
      pkg_type: p.pkg_type || 'enquiry',
    }));

    return {
      success: true,
      destinationName: destName,
      destinationId: destId,
      totalPackages: packages.length,
      packages,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Failed to fetch holiday packages: ${err.message}`,
    };
  }
}

/**
 * Fetches detailed package information, itinerary highlights, and inclusions for a product code (e.g. DP701).
 */
export async function getPackageDetails(productCode: string): Promise<PackageDetailsResponse> {
  if (!productCode) {
    return { success: false, error: 'Product code is required' };
  }

  try {
    const url = `${REST_API_BASE}/packages/product/details?product_code=${productCode.trim().toUpperCase()}`;
    const res = await fetch(url, {
      headers: API_HEADERS,
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return { success: false, error: `REST API returned status ${res.status}` };
    }

    const data = await res.json();
    if (!data || !data.name) {
      return { success: false, error: `No details found for package code ${productCode}` };
    }

    // Format HTML inclusions into clean plain text bullet strings
    const cleanInclusions = (data.inclusions || []).map((inc: string) => 
      inc.replace(/<[^>]*>/g, '').trim()
    ).filter((inc: string) => inc.length > 0);

    return {
      success: true,
      code: data.code || productCode,
      name: data.name,
      total_nights: data.total_nights,
      destinations_covered: data.destinations_covered,
      themes: data.themes || [],
      inclusions: cleanInclusions.slice(0, 10),
      cancellation_policy: data.cancellation_policy ? data.cancellation_policy.replace(/<[^>]*>/g, '').trim() : undefined,
      terms_conditions: data.terms_conditions ? data.terms_conditions.replace(/<[^>]*>/g, '').trim() : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Failed to fetch package details: ${err.message}`,
    };
  }
}
