export type CertificationLevel = 'OW' | 'AOW' | 'Rescue' | 'DM' | 'Instructor';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  certificationLevel: CertificationLevel;
  totalDives: number;
  joinedAt: Date;
  homeBase?: string;
}
