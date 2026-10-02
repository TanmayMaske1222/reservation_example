export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER';
  status: 'ACTIVE' | 'BLOCKED';
  dob?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN';
  status: 'ACTIVE';
  badgeTitle: string;
  createdAt: string;
}

export type TransportType = 'TRAIN' | 'FLIGHT' | 'BUS';

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  trainType: 'Vande Bharat' | 'Rajdhani Express' | 'Superfast' | 'Express' | 'Duronto';
  classes: {
    code: '1A' | '2A' | '3A' | 'SL' | 'GN';
    name: string;
    fare: number;
    totalSeats: number;
    availableSeats: number;
  }[];
  runsOn: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED';
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  source: string;
  sourceAirport: string;
  destination: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: 'Non-stop' | '1 Stop' | '2 Stops';
  classes: {
    code: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
    name: string;
    fare: number;
    seatsLeft: number;
  }[];
  status: 'ON_TIME' | 'BOARDING' | 'DELAYED';
}

export interface Bus {
  id: string;
  busNumber: string;
  operator: string;
  busType: 'AC Sleeper (2+1)' | 'Volvo Multi-Axle AC' | 'BharatBenz AC Seater' | 'Super Luxury Express';
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  seatCapacity: number;
  availableSeats: number;
  fare: number;
  ratings: number;
  amenities: string[];
  status: 'SCHEDULED' | 'BOARDING' | 'ON_ROUTE';
}

export interface Seat {
  id: string;
  seatNumber: string;
  tier?: string;
  isBooked: boolean;
  isSelected?: boolean;
  category?: 'WINDOW' | 'AISLE' | 'MIDDLE' | 'UPPER' | 'LOWER';
  fareMultiplier?: number;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  seatNumber: string;
  berthPreference?: string;
  idType?: string;
  idNumber?: string;
}

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PAID' | 'REFUNDED' | 'FAILED';

export interface Booking {
  id: string;
  pnr: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  transportType: TransportType;
  transportId: string;
  transportNumber: string;
  transportName: string;
  source: string;
  destination: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  seats: string[];
  passengers: Passenger[];
  amount: number;
  baseFare: number;
  tax: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING';
  transactionId: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  pnr: string;
  userId: string;
  userName: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId: string;
  paymentDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'ALERT' | 'PROMO' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface SystemSettings {
  websiteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  cancellationRefundRate: number; // percentage e.g. 85%
  enableSimulatedPayment: boolean;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  gstRate: number; // e.g. 5%
  advanceBookingDays?: number;
  roleIsolationEnforced?: boolean;
}
