import type { EntityConfig } from './types';

export const SEAT_TYPES = ['REGULAR', 'GOLD', 'PREMIUM'] as const;
export const PRICE_TIERS = ['REGULAR', 'PREMIUM', 'WEEKEND'] as const;
export const SHOW_SEAT_STATUSES = ['AVAILABLE', 'BOOKED'] as const;
export const ROLES = ['ADMIN', 'CUSTOMER'] as const;
export const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const;
export const PAYMENT_STATUSES = ['PASS', 'FAILED', 'PENDING', 'REFUNDED'] as const;
export const REFUND_STATUSES = ['DONE', 'INPROGRESS', 'FAILED'] as const;

const money = (v: unknown) => (typeof v === 'number' ? `$${v.toFixed(2)}` : v ?? '-');

export const ENTITY_CONFIGS: Record<string, EntityConfig> = {
  city: {
    key: 'city',
    name: 'Cities',
    singularName: 'City',
    endpoint: '/api/cities',
    defaultLabel: (i) => (i ? `${i.name}, ${i.state}` : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'state', label: 'State' },
      { key: 'country', label: 'Country' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text', required: true },
      { name: 'country', label: 'Country', type: 'text', required: true },
    ],
  },

  eventVenue: {
    key: 'eventVenue',
    name: 'Event Venues',
    singularName: 'Event Venue',
    endpoint: '/api/venues',
    defaultLabel: (i) => (i ? i.venueName : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'venueName', label: 'Venue Name' },
      { key: 'address', label: 'Address' },
      { key: 'city', label: 'City', render: (i) => i.city?.name ?? '-' },
    ],
    fields: [
      { name: 'venueName', label: 'Venue Name', type: 'text', required: true },
      { name: 'address', label: 'Address', type: 'textarea', required: true },
      { name: 'city', label: 'City', type: 'entity', entityKey: 'city', required: true },
    ],
  },

  screen: {
    key: 'screen',
    name: 'Screens',
    singularName: 'Screen',
    endpoint: '/api/screens',
    defaultLabel: (i) => (i ? i.name : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'eventVenue', label: 'Venue', render: (i) => i.eventVenue?.venueName ?? '-' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'eventVenue', label: 'Event Venue', type: 'entity', entityKey: 'eventVenue', required: true },
    ],
  },

  seat: {
    key: 'seat',
    name: 'Seats',
    singularName: 'Seat',
    endpoint: '/api/seats',
    defaultLabel: (i) => (i ? `R${i.row}C${i.col}` : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'row', label: 'Row' },
      { key: 'col', label: 'Col' },
      { key: 'type', label: 'Type' },
      { key: 'screen', label: 'Screen', render: (i) => i.screen?.name ?? '-' },
    ],
    fields: [
      { name: 'row', label: 'Row', type: 'number', required: true },
      { name: 'col', label: 'Col', type: 'number', required: true },
      { name: 'type', label: 'Seat Type', type: 'enum', enumValues: SEAT_TYPES, required: true },
      { name: 'screen', label: 'Screen', type: 'entity', entityKey: 'screen', required: true },
    ],
  },

  actor: {
    key: 'actor',
    name: 'Actors',
    singularName: 'Actor',
    endpoint: '/api/actors',
    defaultLabel: (i) => (i ? i.name : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description', render: (i) => (i.description ?? '').slice(0, 60) },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', maxLength: 2000, colSpan: 2 },
      { name: 'profileImage', label: 'Profile Image URL', type: 'text', colSpan: 2 },
    ],
  },

  movie: {
    key: 'movie',
    name: 'Movies',
    singularName: 'Movie',
    endpoint: '/api/movies',
    defaultLabel: (i) => (i ? i.name : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'rating', label: 'Rating' },
      { key: 'duration', label: 'Duration (min)' },
      { key: 'actor', label: 'Actor', render: (i) => i.actor?.name ?? '-' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', maxLength: 2000, colSpan: 2 },
      { name: 'rating', label: 'Rating', type: 'number', required: true },
      { name: 'duration', label: 'Duration (minutes)', type: 'number', required: true },
      { name: 'actor', label: 'Actor', type: 'entity', entityKey: 'actor', required: true },
      { name: 'banner', label: 'Banner URL', type: 'text', colSpan: 2 },
    ],
  },

  movieShow: {
    key: 'movieShow',
    name: 'Movie Shows',
    singularName: 'Movie Show',
    endpoint: '/api/movie-shows',
    defaultLabel: (i) => (i ? `${i.movie?.name ?? 'Show'} @ ${i.startTime ?? ''}` : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'movie', label: 'Movie', render: (i) => i.movie?.name ?? '-' },
      { key: 'screen', label: 'Screen', render: (i) => i.screen?.name ?? '-' },
      { key: 'startDate', label: 'Date' },
      { key: 'startTime', label: 'Start' },
      { key: 'endTime', label: 'End' },
    ],
    fields: [
      { name: 'movie', label: 'Movie', type: 'entity', entityKey: 'movie', required: true },
      { name: 'screen', label: 'Screen', type: 'entity', entityKey: 'screen', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true },
      { name: 'startTime', label: 'Start Time', type: 'time', required: true, step: '1' },
      { name: 'endTime', label: 'End Time', type: 'time', required: true, step: '1' },
    ],
  },

  showSeat: {
    key: 'showSeat',
    name: 'Show Seats',
    singularName: 'Show Seat',
    endpoint: '/api/show-seats',
    defaultLabel: (i) => (i ? `Seat #${i.seat?.id ?? i.id}` : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'movieShow', label: 'Movie Show', render: (i) => i.movieShow?.movie?.name ?? `#${i.movieShow?.id ?? '-'}` },
      { key: 'seat', label: 'Seat', render: (i) => (i.seat ? `R${i.seat.row}C${i.seat.col}` : '-') },
      { key: 'priceTier', label: 'Price Tier' },
      { key: 'price', label: 'Price', render: (i) => money(i.price) },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'movieShow', label: 'Movie Show', type: 'entity', entityKey: 'movieShow', required: true },
      { name: 'seat', label: 'Seat', type: 'entity', entityKey: 'seat', required: true },
      { name: 'priceTier', label: 'Price Tier', type: 'enum', enumValues: PRICE_TIERS, required: true },
      { name: 'price', label: 'Price', type: 'number', required: true, step: '0.01' },
      { name: 'status', label: 'Status', type: 'enum', enumValues: SHOW_SEAT_STATUSES, required: true },
    ],
  },

  user: {
    key: 'user',
    name: 'Users',
    singularName: 'User',
    endpoint: '/api/users',
    defaultLabel: (i) => (i ? `${i.name} (${i.email})` : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'role', label: 'Role' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'enum', enumValues: ROLES, required: true },
    ],
  },

  booking: {
    key: 'booking',
    name: 'Bookings',
    singularName: 'Booking',
    endpoint: '/api/bookings',
    defaultLabel: (i) => (i ? `Booking #${i.id}` : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'user', label: 'User', render: (i) => i.user?.name ?? '-' },
      { key: 'movieShow', label: 'Movie Show', render: (i) => i.movieShow?.movie?.name ?? `#${i.movieShow?.id ?? '-'}` },
      { key: 'offer', label: 'Offer', render: (i) => i.offer?.code ?? '-' },
      { key: 'amount', label: 'Amount', render: (i) => money(i.amount) },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'user', label: 'User', type: 'entity', entityKey: 'user', required: true },
      { name: 'movieShow', label: 'Movie Show', type: 'entity', entityKey: 'movieShow', required: true },
      { name: 'showSeat', label: 'Show Seat', type: 'entity', entityKey: 'showSeat', required: true },
      { name: 'offer', label: 'Offer', type: 'entity', entityKey: 'offer', nullable: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true, step: '0.01' },
      { name: 'status', label: 'Status', type: 'enum', enumValues: BOOKING_STATUSES, required: true },
    ],
  },

  payment: {
    key: 'payment',
    name: 'Payments',
    singularName: 'Payment',
    endpoint: '/api/payments',
    defaultLabel: (i) => (i ? `Payment #${i.id}` : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'booking', label: 'Booking', render: (i) => (i.booking ? `#${i.booking.id}` : '-') },
      { key: 'amount', label: 'Amount', render: (i) => money(i.amount) },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'booking', label: 'Booking', type: 'entity', entityKey: 'booking', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true, step: '0.01' },
      { name: 'status', label: 'Status', type: 'enum', enumValues: PAYMENT_STATUSES, required: true },
    ],
  },

  refund: {
    key: 'refund',
    name: 'Refunds',
    singularName: 'Refund',
    endpoint: '/api/refunds',
    defaultLabel: (i) => (i ? `Refund #${i.id}` : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'refundAgainstPayment', label: 'Payment', render: (i) => (i.refundAgainstPayment ? `#${i.refundAgainstPayment.id}` : '-') },
      { key: 'amount', label: 'Amount', render: (i) => money(i.amount) },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'refundAgainstPayment', label: 'Payment', type: 'entity', entityKey: 'payment', required: true },
      { name: 'amount', label: 'Amount', type: 'number', required: true, step: '0.01' },
      { name: 'status', label: 'Status', type: 'enum', enumValues: REFUND_STATUSES, required: true },
    ],
  },

  offer: {
    key: 'offer',
    name: 'Offers',
    singularName: 'Offer',
    endpoint: '/api/offers',
    defaultLabel: (i) => (i ? i.code : ''),
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'code', label: 'Code' },
      { key: 'discountPercent', label: 'Discount %' },
      { key: 'flatDiscount', label: 'Flat Discount', render: (i) => money(i.flatDiscount) },
      { key: 'maxDiscount', label: 'Max Discount', render: (i) => money(i.maxDiscount) },
      { key: 'validFrom', label: 'Valid From' },
      { key: 'validTill', label: 'Valid Till' },
    ],
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'discountPercent', label: 'Discount %', type: 'number', step: '0.01' },
      { name: 'flatDiscount', label: 'Flat Discount', type: 'number', step: '0.01' },
      { name: 'maxDiscount', label: 'Max Discount', type: 'number', step: '0.01' },
      { name: 'validFrom', label: 'Valid From', type: 'date', required: true },
      { name: 'validTill', label: 'Valid Till', type: 'date', required: true },
      { name: 'createdBy', label: 'Created By', type: 'entity', entityKey: 'user', required: true },
    ],
  },
};

export const ENTITY_ORDER = [
  'city',
  'eventVenue',
  'screen',
  'seat',
  'actor',
  'movie',
  'movieShow',
  'showSeat',
  'user',
  'offer',
  'booking',
  'payment',
  'refund',
];
