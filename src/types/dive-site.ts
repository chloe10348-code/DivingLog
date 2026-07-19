export type DiveSiteType = 'Reef' | 'Wreck' | 'Cave' | 'Drift' | 'Night' | 'Deep';

export interface DiveSiteLocation {
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface DiveSite {
  siteId: string;
  name: string;
  location: DiveSiteLocation;
  type: DiveSiteType;
  avgDepth: number;
  avgVisibility: number;
  avgRating: number;
  totalLogs: number;
  createdBy: string;
}
