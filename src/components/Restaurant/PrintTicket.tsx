"use client";

import React from "react";
import { Order } from "@/types";

interface PrintTicketProps {
  order: Order;
  hotelName: string;
}

export function PrintTicket({ order, hotelName }: PrintTicketProps) {
  return (
    <div className="hidden print:block p-8 bg-white text-black font-mono text-sm w-[80mm] mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold uppercase">{hotelName}</h2>
        <p className="text-xs">COMPROBANTE DE ORDEN</p>
        <div className="border-b border-black border-dashed my-4" />
      </div>

      <div className="space-y-1 mb-6">
        <div className="flex justify-between">
          <span>ORDEN:</span>
          <span className="font-bold">#{order.id.slice(-6).toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>FECHA:</span>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>MESA/HAB:</span>
          <span className="font-bold">{order.roomNumber || "SALÓN"}</span>
        </div>
      </div>

      <div className="border-b border-black border-dashed mb-4" />

      <div className="space-y-4 mb-6">
        {order.items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between font-bold">
              <span>{item.quantity} x {item.menuItem.name}</span>
              <span>${(item.quantity * item.price).toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-zinc-500">Precio Unit: ${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-b border-black border-dashed mb-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-lg font-bold">
          <span>TOTAL:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs mt-4">
          <span>Método:</span>
          <span>{order.paymentMethod}</span>
        </div>
      </div>

      <div className="text-center mt-10 space-y-2 opacity-50">
        <p className="text-[10px]">¡Gracias por su preferencia!</p>
        <p className="text-[8px] uppercase tracking-widest leading-tight">Powered by Aura Institutional Systems</p>
      </div>

      {/* Screen only helper */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
