"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  addRoomAction, 
  deleteRoomAction, 
  createHotelWithRooms,
  getHotelData,
  checkOrCreateUserAction,
  purgeHotelDataAction,
  updateHotelAction,
  updateRoomStatusAction,
  updateRoomAction,
  addReservationAction,
  validateMasterKeyAction,
  updateReservationPaymentAction
} from "@/app/actions/aura";

import { 
  Room, 
  Reservation, 
  RoomStatus, 
  Role,
  AuditLog,
  Hotel,
  InventoryItem,
  Restaurant,
  Order,
  BusinessMode
} from "@/types";

export interface HotelConfig {
  name: string;
  type: string; // Hotel, Hostal, Vivienda, Restaurante, etc.
  businessMode: BusinessMode;
  roomsCount: number;
  services: string[]; // Restaurant, Pool, etc.
  logoUrl?: string;
}


interface AuraContextType {
  rooms: Room[];
  reservations: Reservation[];
  inventoryItems: InventoryItem[];
  restaurants: Restaurant[];
  activeOrders: Order[];
  hotelConfig: HotelConfig | null;
  hotelId: string | null;
  businessMode: BusinessMode;
  isSetupComplete: boolean;
  role: "ADMIN" | "GERENTE" | "RESERVADOR" | Role | null;
  subscription: "BASIC" | "PRO" | "ENTERPRISE";
  connectionCode: string | null;
  trialDaysLeft: number;
  isOwner: boolean;
  logs: AuditLog[];
  refreshData: () => Promise<void>;
  updateHotel: (data: { name?: string, type?: string, logoUrl?: string, businessMode?: BusinessMode }) => Promise<{ success: boolean, error?: string }>;
  addRoom: (room: { number: string, type: string, status?: RoomStatus }) => Promise<{ success: boolean, error?: string }>;
  applyMasterKey: (key: string) => Promise<{ success: boolean, error?: string }>;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => Promise<void>;
  clearRooms: () => void;
  toggleRoomStatus: (id: string) => void;
  addReservation: (res: Omit<Reservation, "id">) => void;
  updateReservationPayment: (id: string, data: { paymentStatus: string, paymentMethod: string, amount?: number }) => Promise<{ success: boolean, error?: string }>;
  completeSetup: (config: HotelConfig) => Promise<void>;
  purgeData: (type: "RESERVATIONS" | "LOGS" | "ALL") => Promise<{ success: boolean, error?: string }>;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export const AuraProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [hotelConfig, setHotelConfig] = useState<HotelConfig | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [businessMode, setBusinessMode] = useState<BusinessMode>("HOSPITALITY");
  const [role, setRole] = useState<"ADMIN" | "GERENTE" | "RESERVADOR" | null>(null);
  const [subscription, setSubscription] = useState<"BASIC" | "PRO" | "ENTERPRISE">("BASIC");
  const [connectionCode, setConnectionCode] = useState<string | null>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(15);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function hydrate() {
      if (user) {
        // Ensure user exists in local DB
        const userRes = await checkOrCreateUserAction(user.id, user.primaryEmailAddress?.emailAddress || "");
        if (userRes.success && userRes.user) {
          setRole(userRes.user.role as Role);
        }
        
        const result = await getHotelData(user.id);
        if (result.success && result.hotel) {
          setHotelConfig({
            name: result.hotel.name,
            type: result.hotel.type,
            businessMode: result.hotel.businessMode as BusinessMode,
            roomsCount: result.rooms?.length || 0,
            services: [],
            logoUrl: result.hotel.logoUrl || undefined
          });
          setBusinessMode(result.hotel.businessMode as BusinessMode);
          setRooms(result.rooms as Room[] || []);
          setReservations(result.reservations as Reservation[] || []);
          setInventoryItems(result.inventory as InventoryItem[] || []);
          setRestaurants(result.restaurants as Restaurant[] || []);
          setActiveOrders(result.hotel.orders as Order[] || []);
          setLogs(result.logs as AuditLog[] || []);
          const isOwnerUser = result.isOwner || false;
          setIsOwner(isOwnerUser);
          const hotel = result.hotel as Hotel;
          setSubscription(isOwnerUser ? "ENTERPRISE" : (hotel.subscription || "BASIC"));
          setConnectionCode(hotel.connectionCode || null);
          
          // Trial Logic
          const trialStart = new Date(hotel.trialStartedAt || hotel.createdAt);
          const now = new Date();
          const diffDays = Math.max(0, 15 - Math.ceil((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)));
          setTrialDaysLeft(diffDays);

          setIsSetupComplete(true);
          setHotelId(result.hotel.id);
        }
      }
    }
    hydrate();
  }, [user]);

  const addRoom = async (roomData: { number: string, type: string, status?: RoomStatus }) => {
    const result = await addRoomAction(hotelId!, roomData.number, roomData.type, roomData.status);
    if (result.success && result.room) {
      setRooms(prev => [...prev, result.room as Room]);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const updateHotel = async (data: { name?: string, type?: string, logoUrl?: string, businessMode?: BusinessMode }) => {
    if (!hotelId) return { success: false, error: "No hotel ID" };
    const res = await updateHotelAction(hotelId, data);
    if (res.success && res.hotel) {
      setHotelConfig(prev => prev ? { ...prev, ...data } : null);
      return { success: true };
    }
    return res;
  };

  const applyMasterKey = async (key: string) => {
    if (!hotelId) return { success: false, error: "No hotel identified" };
    const res = await validateMasterKeyAction(hotelId, key);
    if (res.success) {
        setSubscription("ENTERPRISE");
        localStorage.setItem("aura_master_unlocked", "true");
        return { success: true };
    }
    return res;
  };

  const updateRoom = async (id: string, updates: Partial<Room>) => {
    const res = await updateRoomAction(id, updates);
    if (res.success) {
      setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    }
  };

  const deleteRoom = async (id: string) => {
    const result = await deleteRoomAction(id);
    if (result.success) {
      setRooms(prev => prev.filter(r => r.id !== id));
    }
  };

  const clearRooms = async () => {
    if (!hotelId) return;
    const res = await purgeHotelDataAction(hotelId, "ALL"); // Purge all will include rooms if I update the action
    if (res.success) {
      setRooms([]);
      setReservations([]);
      setLogs([]);
    }
  };

  const toggleRoomStatus = async (id: string) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    const nextStatus: Record<RoomStatus, RoomStatus> = {
      "Sucia": "Limpia",
      "Limpia": "Ocupada",
      "Ocupada": "Sucia",
      "Mantenimiento": "Limpia"
    };
    const newStatus = nextStatus[room.status];
    
    const res = await updateRoomStatusAction(id, newStatus);
    if (res.success) {
      setRooms(prev => prev.map(room => room.id === id ? { ...room, status: newStatus } : room));
    }
  };

  const addReservation = async (resData: Omit<Reservation, "id">) => {
    if (!hotelId) return;
    const result = await addReservationAction(hotelId, {
      guestName: resData.guestName,
      roomNumber: resData.roomNumber,
      status: resData.status,
      paymentMethod: resData.paymentMethod?.toString(),
      paymentStatus: resData.paymentStatus?.toString(),
      paymentProvider: resData.paymentProvider?.toString(),
      amount: resData.amount === null ? undefined : resData.amount,
      checkIn: resData.checkIn instanceof Date ? resData.checkIn.toISOString() : (resData.checkIn as unknown as string),
      checkOut: resData.checkOut instanceof Date ? resData.checkOut.toISOString() : (resData.checkOut as unknown as string | undefined)
    });
    if (result.success && result.reservation) {
      setReservations(prev => [result.reservation as Reservation, ...prev]);
    }
  };

  const updateReservationPayment = async (id: string, data: { paymentStatus: string, paymentMethod: string, amount?: number }) => {
    const result = await updateReservationPaymentAction(id, data);
    if (result.success && result.reservation) {
      setReservations(prev => prev.map(res => 
        res.id === id ? { ...res, paymentStatus: result.reservation.paymentStatus, paymentMethod: result.reservation.paymentMethod, amount: result.reservation.amount } : res
      ));
      return { success: true };
    }
    return { success: false, error: "Failed to update payment" };
  };

  const purgeData = async (type: "RESERVATIONS" | "LOGS" | "ALL") => {
    if (!hotelId) return { success: false, error: "No hotel identified" };
    const result = await purgeHotelDataAction(hotelId, type);
    if (result.success) {
      if (type === "RESERVATIONS" || type === "ALL") setReservations([]);
      if (type === "LOGS" || type === "ALL") setLogs([]);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const completeSetup = async (config: HotelConfig) => {
    if (!user) return;
    const result = await createHotelWithRooms(config, user.id);
    if (result.success && result.hotelId) {
      setHotelConfig(config);
      setIsSetupComplete(true);
      setHotelId(result.hotelId);
      setRole("ADMIN"); // The one completing setup is always ADMIN
    }
  };

  const refreshData = async () => {
    if (user?.id) {
      const result = await getHotelData(user.id);
      if (result.success && result.hotel) {
        setHotelConfig({
          name: result.hotel.name,
          type: result.hotel.type,
          businessMode: result.hotel.businessMode as BusinessMode,
          roomsCount: result.rooms?.length || 0,
          services: [] // We can expand this later
        });
        setBusinessMode(result.hotel.businessMode as BusinessMode);
        setRooms(result.rooms as Room[] || []);
        setReservations(result.reservations as Reservation[] || []);
        setInventoryItems(result.inventory as InventoryItem[] || []);
        setRestaurants(result.restaurants as Restaurant[] || []);
        setActiveOrders(result.hotel.orders as Order[] || []);
        setLogs(result.logs as AuditLog[] || []);
        
        const isOwnerUser = result.isOwner || false;
        setIsOwner(isOwnerUser);
        const hotel = result.hotel as Hotel;
        setSubscription(isOwnerUser ? "ENTERPRISE" : (hotel.subscription || "BASIC"));
        setConnectionCode(hotel.connectionCode || null);
        
        const trialStart = new Date(hotel.trialStartedAt || hotel.createdAt);
        const diffDays = Math.max(0, 15 - Math.ceil((new Date().getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)));
        setTrialDaysLeft(diffDays);

        setHotelId(hotel.id);
      }
    }
  };

  return (
    <AuraContext.Provider value={{ 
      rooms, 
      reservations, 
      inventoryItems,
      restaurants,
      activeOrders,
      hotelConfig, 
      hotelId,
      businessMode,
      isSetupComplete, 
      role,
      subscription,
      connectionCode,
      trialDaysLeft,
      isOwner,
      logs,
      refreshData,
      updateHotel,
      addRoom,
      applyMasterKey,
      updateRoom,
      deleteRoom,
      clearRooms,
      toggleRoomStatus, 
      addReservation, 
      completeSetup,
      purgeData,
      updateReservationPayment
    }}>
      {children}
    </AuraContext.Provider>
  );
};

export const useAura = () => {
  const context = useContext(AuraContext);
  if (!context) throw new Error("useAura must be used within AuraProvider");
  return context;
};
