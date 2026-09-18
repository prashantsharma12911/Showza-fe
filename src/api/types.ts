// Type definitions mirroring the Showza backend JPA entities exactly (field names/types).

export interface City {
  id?: number;
  name: string;
  state: string;
  country: string;
}

export interface EventVenue {
  id?: number;
  venueName: string;
  address: string;
  city?: City | null;
}

export interface Screen {
  id?: number;
  name: string;
  eventVenue?: EventVenue | null;
}

export type SeatType = 'REGULAR' | 'GOLD' | 'PREMIUM';

export interface Seat {
  id?: number;
  row: number;
  col: number;
  type: SeatType;
  screen?: Screen | null;
}

export interface Actor {
  id?: number;
  name: string;
  description: string;
  profileImage: string;
}

export interface Movie {
  id?: number;
  name: string;
  description: string;
  rating: number;
  duration: number;
  actor?: Actor | null;
  banner: string;
}

export interface MovieShow {
  id?: number;
  movie?: Movie | null;
  screen?: Screen | null;
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  startDate: string; // YYYY-MM-DD
}

export type PriceTier = 'REGULAR' | 'PREMIUM' | 'WEEKEND';
export type ShowSeatStatus = 'AVAILABLE' | 'BOOKED';

export interface ShowSeat {
  id?: number;
  movieShow?: MovieShow | null;
  seat?: Seat | null;
  priceTier: PriceTier;
  price: number;
  status: ShowSeatStatus;
}

export type Role = 'ADMIN' | 'CUSTOMER';

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface BookingDetails {
  id?: number;
  user?: User | null;
  movieShow?: MovieShow | null;
  offer?: Offer | null;
  status: BookingStatus;
  amount: number;
  showSeat?: ShowSeat | null;
  payment?: PaymentDetails | null;
}

export type PaymentStatus = 'PASS' | 'FAILED' | 'PENDING' | 'REFUNDED';

export interface PaymentDetails {
  id?: number;
  booking?: BookingDetails | null;
  amount: number;
  status: PaymentStatus;
}

export type RefundStatus = 'DONE' | 'INPROGRESS' | 'FAILED';

export interface RefundDetails {
  id?: number;
  refundAgainstPayment?: PaymentDetails | null;
  amount: number;
  status: RefundStatus;
}

export interface Offer {
  id?: number;
  code: string;
  discountPercent: number;
  flatDiscount: number;
  maxDiscount: number;
  validFrom: string; // YYYY-MM-DD
  validTill: string; // YYYY-MM-DD
  createdBy?: User | null;
}
