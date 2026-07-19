import type { Timestamp } from 'firebase/firestore';

export interface DiveLog {
  id?: string;
  userId: string;
  diveSiteName: string;
  date: Date | Timestamp;
  diveType: 'reef' | 'wreck' | 'cave' | 'drift' | 'night' | 'deep';
  buddyName?: string;
  maxDepth: number;
  bottomTime: number;
  waterTemp: number;
  visibility: number;
  startPressure: number;
  endPressure: number;
  tankSize: number;
  weight: number;
  notes?: string;
  photos: string[];
  rating: number;
  airConsumption?: number;
  isPublic: boolean;
  createdAt: Date | Timestamp;
}
