"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  addRoomAction, 
  deleteRoomAction, 
  createHotelWithRooms,
  getHotelData,
  checkOrCreateUserAction
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
}

interface AuraContextType {
  rooms: Room[];
  reservations: Reservation[];
  hotelConfig: HotelConfig | null;
  hotelId: string | null;
  isSetupComplete: boolean;
  role: "ADMIN" | "GERENTE" | "RESERVADOR" | null;
  addRoom: (room: Omit<Room, "id">) => Promise<void>;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => Promise<void>;
  clearRooms: () => void;
  toggleRoomStatus: (id: string) => void;
  addReservation: (res: Omit<Reservation, "id">) => void;
  completeSetup: (config: HotelConfig) => Promise<void>;
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
            services: [] 
          });
          setRooms(result.rooms as any || []);
          setReservations(result.reservations as any || []);
          setIsSetupComplete(true);
          setHotelId(result.hotel.id);
        }
      }
    }
    hydrate();
  }, [user]);

  const addRoom = async (roomData: Omit<Room, "id">) => {
    if (!hotelId) return;
    const result = await addRoomAction(hotelId, roomData);
    if (result.success && result.room) {
      setRooms(prev => [...prev, result.room as any]);
    }
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoom = async (id: string) => {
    const result = await deleteRoomAction(id);
    if (result.success) {
      setRooms(prev => prev.filter(r => r.id !== id));
    }
  };

  const clearRooms = () => setRooms([]);

  const toggleRoomStatus = (id: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === id) {
        const nextStatus: Record<RoomStatus, RoomStatus> = {
          "Sucia": "Limpia",
          "Limpia": "Ocupada",
          "Ocupada": "Sucia",
          "Mantenimiento": "Limpia"
        };
        return { ...room, status: nextStatus[room.status] };
      }
      return room;
    }));
  };

  const addReservation = (res: Omit<Reservation, "id">) => {
    setReservations(prev => [...prev, { ...res, id: Math.random().toString(36).substr(2, 9) }]);
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

  return (
    <AuraContext.Provider value={{ 
      rooms, 
      reservations, 
      hotelConfig, 
      hotelId,
      isSetupComplete, 
      role,
      addRoom,
      updateRoom,
      deleteRoom,
      clearRooms,
      toggleRoomStatus, 
      addReservation, 
      completeSetup 
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
