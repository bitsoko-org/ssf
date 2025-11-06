
export interface Boxer {
  id: number;
  name: string;
  nickname: string;
  points: number;
  record: { wins: number; losses: number; draws: number };
  address: string;
  avatarUrl: string;
  bio: string;
}

export interface FightEvent {
  id: number;
  title: string;
  date: Date;
  location: string;
  boxer1: string;
  boxer2: string;
}

export interface JoinRequest {
  id: number;
  name: string;
  nickname: string;
  phone: string;
  status: 'pending' | 'approved' | 'denied';
}
