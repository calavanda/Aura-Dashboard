export type Role = "ADMIN" | "GERENTE" | "RESERVADOR";
export type RoomStatus = "Limpia" | "Sucia" | "Ocupada" | "Mantenimiento";
export type SubscriptionTier = "BASIC" | "PRO" | "ENTERPRISE";
export type PaymentMethod = "EN_LINEA" | "EFECTIVO" | "CARGO_A_HABITACION";
export type PaymentStatus = "PENDIENTE" | "PAGADO" | "FALLIDO" | "REEMBOLSADO";
export type PaymentProvider = "STRIPE" | "PAYPAL" | "MERCADOPAGO" | "NINGUNO";

export interface Hotel {
  id: string;
  name: string;
  type: string;
  logoUrl?: string | null;
  subscription: SubscriptionTier;
  connectionCode?: string | null;
  trialStartedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: RoomStatus;
  hotelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: Date;
  checkOut?: Date | null;
  status: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProvider: PaymentProvider;
  transactionId?: string | null;
  amount?: number | null;
  hotelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  hotelId: string;
  categories?: MenuCategory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  restaurantId: string;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  categoryId: string;
  available: boolean;
}

export interface Order {
  id: string;
  hotelId: string;
  roomNumber?: string | null;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
  hotelId: string;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details?: string | null;
  timestamp: Date;
  userName?: string;
}

export interface AdvancedStats {
  occupancyRate: string;
  adr: string;
  revpar: string;
  totalRevenue: string;
  fnbRevenue: string;
  roomRevenue: string;
  growth: string;
}
