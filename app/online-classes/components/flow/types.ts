export interface Offering {
  id: string;
  title: string;
  description: string;
  duration: string;
  single_price: number;
  package_5_price: number;
  package_10_price: number;
  package_15_price: number;
}

export interface Session {
  id: string;
  session_date: string;
  start_time: string;
  capacity: number;
  booked_count: number;
  meeting_link: string;
  yoga_offerings?: { title: string };
}

export interface UserData {
  name: string;
  email: string;
  message: string;
}
