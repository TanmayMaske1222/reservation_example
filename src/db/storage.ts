import {
  User,
  Admin,
  Train,
  Flight,
  Bus,
  Booking,
  Payment,
  NotificationItem,
  SystemSettings,
  TransportType,
  Passenger
} from '../types';

const STORAGE_KEYS = {
  USERS: 'ts_train_sys_users',
  ADMINS: 'ts_train_sys_admins',
  TRAINS: 'ts_train_sys_trains',
  FLIGHTS: 'ts_train_sys_flights',
  BUSES: 'ts_train_sys_buses',
  BOOKINGS: 'ts_train_sys_bookings',
  PAYMENTS: 'ts_train_sys_payments',
  NOTIFICATIONS: 'ts_train_sys_notifications',
  SETTINGS: 'ts_train_sys_settings',
  INIT_FLAG: 'ts_train_sys_initialized_v2'
};

// Seed Data
const initialUsers: User[] = [
  {
    id: 'usr_101',
    name: 'Rahul Sharma',
    email: 'rahul.travel@example.com',
    phone: '+91 98765 43210',
    role: 'USER',
    status: 'ACTIVE',
    dob: '1996-05-14',
    address: 'Flat 402, Green Avenue, New Delhi, India',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'usr_102',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98220 12345',
    role: 'USER',
    status: 'ACTIVE',
    dob: '1998-08-22',
    address: 'B-12, Heritage Heights, Ahmedabad, Gujarat',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T14:30:00Z'
  },
  {
    id: 'usr_103',
    name: 'Ananya Roy',
    email: 'ananya.roy@example.com',
    phone: '+91 91234 56789',
    role: 'USER',
    status: 'ACTIVE',
    dob: '1994-11-03',
    address: 'Sector 5, Salt Lake, Kolkata, West Bengal',
    createdAt: '2026-03-01T09:15:00Z'
  }
];

const initialAdmins: Admin[] = [
  {
    id: 'adm_001',
    name: 'System Administrator',
    email: 'admin@tstrains.sys',
    role: 'ADMIN',
    status: 'ACTIVE',
    badgeTitle: 'Super Operations Chief',
    createdAt: '2025-11-01T08:00:00Z'
  },
  {
    id: 'adm_002',
    name: 'Railway Operations Desk',
    email: 'rail.ops@tstrains.sys',
    role: 'ADMIN',
    status: 'ACTIVE',
    badgeTitle: 'Fleet Director',
    createdAt: '2025-12-01T08:00:00Z'
  }
];

const initialTrains: Train[] = [
  {
    id: 'trn_22436',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    source: 'New Delhi (NDLS)',
    destination: 'Varanasi Jn (BSB)',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h 00m',
    trainType: 'Vande Bharat',
    classes: [
      { code: '1A', name: 'Exec Chair Car (EC)', fare: 3200, totalSeats: 48, availableSeats: 18 },
      { code: '2A', name: 'AC Chair Car (CC)', fare: 1750, totalSeats: 240, availableSeats: 82 }
    ],
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    status: 'ON_TIME'
  },
  {
    id: 'trn_12952',
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    source: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    trainType: 'Rajdhani Express',
    classes: [
      { code: '1A', name: 'AC First Class (1A)', fare: 4850, totalSeats: 24, availableSeats: 6 },
      { code: '2A', name: 'AC 2 Tier (2A)', fare: 2980, totalSeats: 120, availableSeats: 34 },
      { code: '3A', name: 'AC 3 Tier (3A)', fare: 2150, totalSeats: 360, availableSeats: 110 }
    ],
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    status: 'ON_TIME'
  },
  {
    id: 'trn_12004',
    trainNumber: '12004',
    trainName: 'Lucknow Shatabdi Express',
    source: 'New Delhi (NDLS)',
    destination: 'Lucknow Jn (LJN)',
    departureTime: '06:10',
    arrivalTime: '12:40',
    duration: '6h 30m',
    trainType: 'Superfast',
    classes: [
      { code: '1A', name: 'Executive Anubhuti', fare: 2100, totalSeats: 56, availableSeats: 22 },
      { code: '2A', name: 'AC Chair Car', fare: 1165, totalSeats: 280, availableSeats: 94 }
    ],
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    status: 'ON_TIME'
  },
  {
    id: 'trn_12626',
    trainNumber: '12626',
    trainName: 'Kerala Superfast Express',
    source: 'New Delhi (NDLS)',
    destination: 'Trivandrum (TVC)',
    departureTime: '20:10',
    arrivalTime: '18:00',
    duration: '45h 50m',
    trainType: 'Express',
    classes: [
      { code: '2A', name: 'AC 2 Tier', fare: 3750, totalSeats: 96, availableSeats: 14 },
      { code: '3A', name: 'AC 3 Tier', fare: 2600, totalSeats: 420, availableSeats: 78 },
      { code: 'SL', name: 'Sleeper Class (SL)', fare: 990, totalSeats: 640, availableSeats: 165 },
      { code: 'GN', name: 'General Unreserved', fare: 480, totalSeats: 200, availableSeats: 88 }
    ],
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    status: 'DELAYED'
  },
  {
    id: 'trn_12245',
    trainNumber: '12245',
    trainName: 'Howrah - SMVT Duronto Express',
    source: 'Howrah Jn (HWH)',
    destination: 'Bengaluru (SMVB)',
    departureTime: '10:50',
    arrivalTime: '16:00',
    duration: '29h 10m',
    trainType: 'Duronto',
    classes: [
      { code: '1A', name: 'AC First Class', fare: 5200, totalSeats: 20, availableSeats: 4 },
      { code: '2A', name: 'AC 2 Tier', fare: 3450, totalSeats: 110, availableSeats: 28 },
      { code: '3A', name: 'AC 3 Tier', fare: 2420, totalSeats: 380, availableSeats: 65 },
      { code: 'SL', name: 'Sleeper Class', fare: 920, totalSeats: 400, availableSeats: 112 }
    ],
    runsOn: ['Tue', 'Wed', 'Fri', 'Sun'],
    status: 'ON_TIME'
  }
];

const initialFlights: Flight[] = [
  {
    id: 'flt_6e205',
    flightNumber: '6E-205',
    airline: 'IndiGo Airlines',
    airlineCode: '6E',
    source: 'Delhi',
    sourceAirport: 'Indira Gandhi Int Airport (DEL)',
    destination: 'Mumbai',
    destinationAirport: 'Chhatrapati Shivaji Maharaj Airport (BOM)',
    departureTime: '07:15',
    arrivalTime: '09:30',
    duration: '2h 15m',
    stops: 'Non-stop',
    classes: [
      { code: 'ECONOMY', name: 'Saver Economy', fare: 4850, seatsLeft: 42 },
      { code: 'PREMIUM_ECONOMY', name: 'Flexi Plus', fare: 6200, seatsLeft: 12 }
    ],
    status: 'ON_TIME'
  },
  {
    id: 'flt_ai887',
    flightNumber: 'AI-887',
    airline: 'Air India',
    airlineCode: 'AI',
    source: 'Mumbai',
    sourceAirport: 'Chhatrapati Shivaji Maharaj Airport (BOM)',
    destination: 'Bengaluru',
    destinationAirport: 'Kempegowda Int Airport (BLR)',
    departureTime: '11:00',
    arrivalTime: '12:45',
    duration: '1h 45m',
    stops: 'Non-stop',
    classes: [
      { code: 'ECONOMY', name: 'Comfort Economy', fare: 4200, seatsLeft: 30 },
      { code: 'BUSINESS', name: 'Maharaja Business', fare: 14500, seatsLeft: 8 }
    ],
    status: 'BOARDING'
  },
  {
    id: 'flt_uk945',
    flightNumber: 'UK-945',
    airline: 'Vistara Prime',
    airlineCode: 'UK',
    source: 'Delhi',
    sourceAirport: 'Indira Gandhi Int Airport (DEL)',
    destination: 'Bengaluru',
    destinationAirport: 'Kempegowda Int Airport (BLR)',
    departureTime: '17:30',
    arrivalTime: '20:15',
    duration: '2h 45m',
    stops: 'Non-stop',
    classes: [
      { code: 'ECONOMY', name: 'Standard Economy', fare: 5900, seatsLeft: 25 },
      { code: 'PREMIUM_ECONOMY', name: 'Premium Economy', fare: 8400, seatsLeft: 14 },
      { code: 'BUSINESS', name: 'Club Vistara Business', fare: 18200, seatsLeft: 6 }
    ],
    status: 'ON_TIME'
  },
  {
    id: 'flt_sg401',
    flightNumber: 'SG-401',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    source: 'Kolkata',
    sourceAirport: 'Netaji Subhash Chandra Bose Airport (CCU)',
    destination: 'Delhi',
    destinationAirport: 'Indira Gandhi Int Airport (DEL)',
    departureTime: '19:40',
    arrivalTime: '22:10',
    duration: '2h 30m',
    stops: 'Non-stop',
    classes: [
      { code: 'ECONOMY', name: 'Spicestyle Economy', fare: 4600, seatsLeft: 19 }
    ],
    status: 'ON_TIME'
  }
];

const initialBuses: Bus[] = [
  {
    id: 'bus_ts101',
    busNumber: 'TS-B101',
    operator: 'TS Royal Express',
    busType: 'Volvo Multi-Axle AC',
    source: 'New Delhi (Kashmere Gate ISBT)',
    destination: 'Manali (Mall Road)',
    departureTime: '20:30',
    arrivalTime: '08:45',
    duration: '12h 15m',
    seatCapacity: 40,
    availableSeats: 16,
    fare: 1450,
    ratings: 4.8,
    amenities: ['Charging Port', 'Blankets', 'Water Bottle', 'Free Wi-Fi', 'GPS Live Tracking'],
    status: 'SCHEDULED'
  },
  {
    id: 'bus_ts102',
    busNumber: 'TS-B102',
    operator: 'Bharat Super Travels',
    busType: 'AC Sleeper (2+1)',
    source: 'Mumbai (Borivali West)',
    destination: 'Goa (Panaji Bus Stand)',
    departureTime: '19:00',
    arrivalTime: '07:30',
    duration: '12h 30m',
    seatCapacity: 36,
    availableSeats: 9,
    fare: 1850,
    ratings: 4.7,
    amenities: ['Personal TV Screen', 'Reading Light', 'Pillow & Linen', 'Snacks', 'CCTV'],
    status: 'BOARDING'
  },
  {
    id: 'bus_ts103',
    busNumber: 'TS-B103',
    operator: 'GreenLine Cruiser',
    busType: 'BharatBenz AC Seater',
    source: 'Bengaluru (Majestic)',
    destination: 'Hyderabad (MGBS)',
    departureTime: '22:15',
    arrivalTime: '06:30',
    duration: '8h 15m',
    seatCapacity: 44,
    availableSeats: 21,
    fare: 980,
    ratings: 4.6,
    amenities: ['Emergency Exit', 'Reclining Seats', 'Live Tracking', 'Water Bottle'],
    status: 'SCHEDULED'
  },
  {
    id: 'bus_ts104',
    busNumber: 'TS-B104',
    operator: 'ZingBus Premium',
    busType: 'Super Luxury Express',
    source: 'Jaipur (Sindhi Camp)',
    destination: 'New Delhi (Dhaula Kuan)',
    departureTime: '16:00',
    arrivalTime: '21:00',
    duration: '5h 00m',
    seatCapacity: 48,
    availableSeats: 26,
    fare: 650,
    ratings: 4.5,
    amenities: ['Air Conditioned', 'USB Ports', 'Luggage Compartment'],
    status: 'ON_ROUTE'
  }
];

const initialBookings: Booking[] = [
  {
    id: 'bkg_849201',
    pnr: 'TS-PNR-849201',
    userId: 'usr_101',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.travel@example.com',
    userPhone: '+91 98765 43210',
    transportType: 'TRAIN',
    transportId: 'trn_22436',
    transportNumber: '22436',
    transportName: 'Vande Bharat Express',
    source: 'New Delhi (NDLS)',
    destination: 'Varanasi Jn (BSB)',
    journeyDate: '2026-10-10',
    departureTime: '06:00',
    arrivalTime: '14:00',
    travelClass: 'AC Chair Car (CC)',
    seats: ['C4-24', 'C4-25'],
    passengers: [
      { name: 'Rahul Sharma', age: 30, gender: 'MALE', seatNumber: 'C4-24', berthPreference: 'Window' },
      { name: 'Megha Sharma', age: 28, gender: 'FEMALE', seatNumber: 'C4-25', berthPreference: 'Aisle' }
    ],
    baseFare: 3500,
    tax: 175,
    amount: 3675,
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    transactionId: 'TXN_UPI_994821',
    createdAt: '2026-09-28T11:20:00Z'
  },
  {
    id: 'bkg_712490',
    pnr: 'TS-PNR-712490',
    userId: 'usr_101',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.travel@example.com',
    userPhone: '+91 98765 43210',
    transportType: 'FLIGHT',
    transportId: 'flt_6e205',
    transportNumber: '6E-205',
    transportName: 'IndiGo Airlines',
    source: 'Delhi (DEL)',
    destination: 'Mumbai (BOM)',
    journeyDate: '2026-10-18',
    departureTime: '07:15',
    arrivalTime: '09:30',
    travelClass: 'Saver Economy',
    seats: ['14B'],
    passengers: [
      { name: 'Rahul Sharma', age: 30, gender: 'MALE', seatNumber: '14B' }
    ],
    baseFare: 4850,
    tax: 242,
    amount: 5092,
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: 'CREDIT_CARD',
    transactionId: 'TXN_CARD_102938',
    createdAt: '2026-09-29T15:40:00Z'
  },
  {
    id: 'bkg_550211',
    pnr: 'TS-PNR-550211',
    userId: 'usr_102',
    userName: 'Priya Patel',
    userEmail: 'priya.patel@example.com',
    userPhone: '+91 98220 12345',
    transportType: 'BUS',
    transportId: 'bus_ts102',
    transportNumber: 'TS-B102',
    transportName: 'Bharat Super Travels',
    source: 'Mumbai (Borivali West)',
    destination: 'Goa (Panaji Bus Stand)',
    journeyDate: '2026-10-05',
    departureTime: '19:00',
    arrivalTime: '07:30',
    travelClass: 'AC Sleeper',
    seats: ['SL-04'],
    passengers: [
      { name: 'Priya Patel', age: 26, gender: 'FEMALE', seatNumber: 'SL-04' }
    ],
    baseFare: 1850,
    tax: 92,
    amount: 1942,
    bookingStatus: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'NET_BANKING',
    transactionId: 'TXN_NET_883019',
    createdAt: '2026-09-15T08:10:00Z'
  }
];

const initialPayments: Payment[] = [
  {
    id: 'pay_901',
    bookingId: 'bkg_849201',
    pnr: 'TS-PNR-849201',
    userId: 'usr_101',
    userName: 'Rahul Sharma',
    amount: 3675,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    transactionId: 'TXN_UPI_994821',
    paymentDate: '2026-09-28T11:22:00Z'
  },
  {
    id: 'pay_902',
    bookingId: 'bkg_712490',
    pnr: 'TS-PNR-712490',
    userId: 'usr_101',
    userName: 'Rahul Sharma',
    amount: 5092,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    transactionId: 'TXN_CARD_102938',
    paymentDate: '2026-09-29T15:42:00Z'
  },
  {
    id: 'pay_903',
    bookingId: 'bkg_550211',
    pnr: 'TS-PNR-550211',
    userId: 'usr_102',
    userName: 'Priya Patel',
    amount: 1942,
    paymentMethod: 'NET_BANKING',
    paymentStatus: 'PAID',
    transactionId: 'TXN_NET_883019',
    paymentDate: '2026-09-15T08:12:00Z'
  }
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_101',
    title: 'Booking Confirmed - PNR TS-PNR-849201',
    message: 'Your Vande Bharat Express reservation (NDLS → BSB) for 2026-10-10 is confirmed. Coach C4, Seats 24, 25.',
    type: 'BOOKING',
    isRead: false,
    createdAt: '2026-09-28T11:22:30Z'
  },
  {
    id: 'notif_2',
    userId: 'usr_101',
    title: 'Flight Boarding Pass Ready',
    message: 'Check-in for your flight 6E-205 to Mumbai is now open. Digital ticket is ready in My Bookings.',
    type: 'ALERT',
    isRead: true,
    createdAt: '2026-09-29T15:45:00Z'
  },
  {
    id: 'notif_3',
    userId: 'usr_101',
    title: 'TS train_sys Festive Offer',
    message: 'Get up to 20% discount on interstate bus and premium train bookings with code TSFESTIVE.',
    type: 'PROMO',
    isRead: true,
    createdAt: '2026-09-20T10:00:00Z'
  }
];

const initialSettings: SystemSettings = {
  websiteName: 'TS train_sys',
  tagline: 'One Platform. Every Journey.',
  supportEmail: 'support@tstrains.sys',
  supportPhone: '1800-425-9999 (Toll Free 24x7)',
  cancellationRefundRate: 85,
  enableSimulatedPayment: true,
  maintenanceMode: false,
  allowNewRegistrations: true,
  gstRate: 5,
  advanceBookingDays: 120,
  roleIsolationEnforced: true
};

// Storage helper functions
export class DatabaseStorage {
  private static get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  public static initialize(): void {
    const initialized = localStorage.getItem(STORAGE_KEYS.INIT_FLAG);
    if (!initialized) {
      this.set(STORAGE_KEYS.USERS, initialUsers);
      this.set(STORAGE_KEYS.ADMINS, initialAdmins);
      this.set(STORAGE_KEYS.TRAINS, initialTrains);
      this.set(STORAGE_KEYS.FLIGHTS, initialFlights);
      this.set(STORAGE_KEYS.BUSES, initialBuses);
      this.set(STORAGE_KEYS.BOOKINGS, initialBookings);
      this.set(STORAGE_KEYS.PAYMENTS, initialPayments);
      this.set(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
      this.set(STORAGE_KEYS.SETTINGS, initialSettings);
      localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
    }
  }

  // USERS
  public static getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, initialUsers);
  }

  public static saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.set(STORAGE_KEYS.USERS, users);
  }

  public static deleteUser(id: string): void {
    const users = this.getUsers().filter(u => u.id !== id);
    this.set(STORAGE_KEYS.USERS, users);
  }

  // ADMINS
  public static getAdmins(): Admin[] {
    return this.get<Admin[]>(STORAGE_KEYS.ADMINS, initialAdmins);
  }

  // TRAINS
  public static getTrains(): Train[] {
    return this.get<Train[]>(STORAGE_KEYS.TRAINS, initialTrains);
  }

  public static saveTrain(train: Train): void {
    const list = this.getTrains();
    const idx = list.findIndex(t => t.id === train.id);
    if (idx >= 0) {
      list[idx] = train;
    } else {
      list.push(train);
    }
    this.set(STORAGE_KEYS.TRAINS, list);
  }

  public static deleteTrain(id: string): void {
    const list = this.getTrains().filter(t => t.id !== id);
    this.set(STORAGE_KEYS.TRAINS, list);
  }

  // FLIGHTS
  public static getFlights(): Flight[] {
    return this.get<Flight[]>(STORAGE_KEYS.FLIGHTS, initialFlights);
  }

  public static saveFlight(flight: Flight): void {
    const list = this.getFlights();
    const idx = list.findIndex(f => f.id === flight.id);
    if (idx >= 0) {
      list[idx] = flight;
    } else {
      list.push(flight);
    }
    this.set(STORAGE_KEYS.FLIGHTS, list);
  }

  public static deleteFlight(id: string): void {
    const list = this.getFlights().filter(f => f.id !== id);
    this.set(STORAGE_KEYS.FLIGHTS, list);
  }

  // BUSES
  public static getBuses(): Bus[] {
    return this.get<Bus[]>(STORAGE_KEYS.BUSES, initialBuses);
  }

  public static saveBus(bus: Bus): void {
    const list = this.getBuses();
    const idx = list.findIndex(b => b.id === bus.id);
    if (idx >= 0) {
      list[idx] = bus;
    } else {
      list.push(bus);
    }
    this.set(STORAGE_KEYS.BUSES, list);
  }

  public static deleteBus(id: string): void {
    const list = this.getBuses().filter(b => b.id !== id);
    this.set(STORAGE_KEYS.BUSES, list);
  }

  // BOOKINGS
  public static getBookings(): Booking[] {
    return this.get<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
  }

  public static createBooking(
    userId: string,
    transportType: TransportType,
    transportId: string,
    transportNumber: string,
    transportName: string,
    source: string,
    destination: string,
    journeyDate: string,
    departureTime: string,
    arrivalTime: string,
    travelClass: string,
    seats: string[],
    passengers: Passenger[],
    baseFare: number,
    paymentMethod: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING'
  ): Booking {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId) || users[0];

    const settings = this.getSettings();
    const tax = Math.round(baseFare * (settings.gstRate / 100));
    const totalAmount = baseFare + tax;

    // Generate unique 6 digit number for PNR
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const pnr = `TS-PNR-${randomDigits}`;
    const bookingId = `bkg_${Date.now()}`;
    const txnId = `TXN_${paymentMethod}_${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: bookingId,
      pnr,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      transportType,
      transportId,
      transportNumber,
      transportName,
      source,
      destination,
      journeyDate,
      departureTime,
      arrivalTime,
      travelClass,
      seats,
      passengers,
      baseFare,
      tax,
      amount: totalAmount,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod,
      transactionId: txnId,
      createdAt: new Date().toISOString()
    };

    // Save booking
    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.set(STORAGE_KEYS.BOOKINGS, bookings);

    // Save payment record
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      bookingId: newBooking.id,
      pnr: newBooking.pnr,
      userId: user.id,
      userName: user.name,
      amount: totalAmount,
      paymentMethod,
      paymentStatus: 'PAID',
      transactionId: txnId,
      paymentDate: new Date().toISOString()
    };
    const payments = this.getPayments();
    payments.unshift(newPayment);
    this.set(STORAGE_KEYS.PAYMENTS, payments);

    // Save user notification
    const newNotification: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: user.id,
      title: `Booking Confirmed: ${pnr}`,
      message: `Your journey on ${transportName} (${transportNumber}) from ${source} to ${destination} is confirmed. Seat(s): ${seats.join(', ')}.`,
      type: 'BOOKING',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    const notifs = this.getNotifications();
    notifs.unshift(newNotification);
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);

    return newBooking;
  }

  public static updateBookingStatus(id: string, status: Booking['bookingStatus']): void {
    const list = this.getBookings();
    const idx = list.findIndex(b => b.id === id);
    if (idx >= 0) {
      list[idx].bookingStatus = status;
      if (status === 'CANCELLED') {
        list[idx].paymentStatus = 'REFUNDED';
        // Add refund notification
        const notif: NotificationItem = {
          id: `notif_${Date.now()}`,
          userId: list[idx].userId,
          title: `Reservation Cancelled: ${list[idx].pnr}`,
          message: `Your booking ${list[idx].pnr} was cancelled. Refund of 85% fare has been processed to your original payment method.`,
          type: 'ALERT',
          isRead: false,
          createdAt: new Date().toISOString()
        };
        const notifs = this.getNotifications();
        notifs.unshift(notif);
        this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
      }
      this.set(STORAGE_KEYS.BOOKINGS, list);
    }
  }

  // PAYMENTS
  public static getPayments(): Payment[] {
    return this.get<Payment[]>(STORAGE_KEYS.PAYMENTS, initialPayments);
  }

  // NOTIFICATIONS
  public static getNotifications(): NotificationItem[] {
    return this.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }

  public static markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      this.set(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }

  public static markAllNotificationsRead(userId: string): void {
    const list = this.getNotifications();
    list.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    this.set(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // SETTINGS
  public static getSettings(): SystemSettings {
    return this.get<SystemSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  }

  public static saveSettings(settings: SystemSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  // Reset to default seed
  public static resetToFactoryDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.INIT_FLAG);
    this.initialize();
  }
}
