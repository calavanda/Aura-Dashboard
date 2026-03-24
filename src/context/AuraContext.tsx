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
  validateMasterKeyAction
} from "@/app/actions/aura";

export type RoomStatus = "Sucia" | "Limpia" | "Ocupada" | "Mantenimiento";

export interface Room {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
}

export interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  status: "CONFIRMADO" | "PENDIENTE" | "CANCELADO";
  checkIn: string;
  paymentMethod?: "EN_LINEA" | "EFECTIVO";
  paymentStatus?: "PENDIENTE" | "PAGADO" | "FALLIDO" | "REEMBOLSADO";
  paymentProvider?: "STRIPE" | "PAYPAL" | "MERCADOPAGO" | "NINGUNO";
  transactionId?: string;
  amount?: number;
}

export interface HotelConfig {
  name: string;
  type: string; // Hotel, Hostal, Vivienda, etc.
  roomsCount: number;
  services: string[]; // Restaurant, Pool, etc.
  logoUrl?: string;
}

// Assuming 'Role' is a type that needs to be defined or imported if it's not a literal string.
// For now, I'll assume it's a string literal or a type alias that should be added to the union.
// Given the context, it's likely a type alias for user roles.
// Since it's not defined in the provided code, I'll add it as a placeholder string type.
type Role = "ADMIN" | "GERENTE" | "RESERVADOR"; // This is a placeholder, adjust if 'Role' is defined elsewhere.

interface AuraContextType {
  rooms: Room[];
  reservations: Reservation[];
  hotelConfig: HotelConfig | null;
  hotelId: string | null;
  isSetupComplete: boolean;
  role: "ADMIN" | "GERENTE" | "RESERVADOR" | Role | null;
  subscription: "BASIC" | "PRO" | "ENTERPRISE";
  connectionCode: string | null;
  trialDaysLeft: number;
  isOwner: boolean;
  logs: any[];
  refreshData: () => Promise<void>;
  updateHotel: (data: { name?: string, type?: string, logoUrl?: string }) => Promise<{ success: boolean, error?: string }>;
  addRoom: (room: { number: string, type: string, status?: RoomStatus }) => Promise<{ success: boolean, error?: string }>;
  applyMasterKey: (key: string) => Promise<{ success: boolean, error?: string }>;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => Promise<void>;
  clearRooms: () => void;
  toggleRoomStatus: (id: string) => void;
  addReservation: (res: Omit<Reservation, "id">) => void;
  completeSetup: (config: HotelConfig) => Promise<void>;
  purgeData: (type: "RESERVATIONS" | "LOGS" | "ALL") => Promise<{ success: boolean, error?: string }>;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export const AuraProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [hotelConfig, setHotelConfig] = useState<HotelConfig | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [role, setRole] = useState<"ADMIN" | "GERENTE" | "RESERVADOR" | null>(null);
  const [subscription, setSubscription] = useState<"BASIC" | "PRO" | "ENTERPRISE">("BASIC");
  const [connectionCode, setConnectionCode] = useState<string | null>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(15);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function hydrate() {
      if (user) {
        // Ensure user exists in local DB
        const userRes = await checkOrCreateUserAction(user.id, user.primaryEmailAddress?.emailAddress || "");
        if (userRes.success && userRes.user) {
          setRole(userRes.user.role as any);
        }
        
        const result = await getHotelData(user.id);
        if (result.success && result.hotel) {
          setHotelConfig({
            name: result.hotel.name,
            type: result.hotel.type,
            roomsCount: result.rooms?.length || 0,
            services: [],
            logoUrl: result.hotel.logoUrl || undefined
          });
          setRooms(result.rooms as any || []);
          setReservations(result.reservations as any || []);
          setLogs(result.logs as any || []);
          const isOwnerUser = result.isOwner || false;
          setIsOwner(isOwnerUser);
          const hotel = result.hotel as any;
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
      setRooms(prev => [...prev, result.room as any]);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const updateHotel = async (data: { name?: string, type?: string, logoUrl?: string }) => {
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
      ...resData,
      checkIn: resData.checkIn // Already ISO string from UI usually
    });
    if (result.success && result.reservation) {
      setReservations(prev => [result.reservation as any, ...prev]);
    }
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
          roomsCount: result.rooms?.length || 0,
          services: [] // We can expand this later
        });
        setRooms(result.rooms as any || []);
        setReservations(result.reservations as any || []);
        setLogs(result.logs as any || []);
        
        const isOwnerUser = result.isOwner || false;
        setIsOwner(isOwnerUser);
        const hotel = result.hotel as any;
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
      hotelConfig, 
      hotelId,
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
      purgeData
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
