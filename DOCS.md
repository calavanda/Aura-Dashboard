# 📖 Aura Public API Documentation

Esta documentación explica cómo integrar cualquier sitio web externo con el **Aura ERP** para mostrar información del hotel, disponibilidad de habitaciones y procesar reservas en tiempo real.

## 🔑 Configuración Base
Todos los endpoints requieren el `hotelId` de la propiedad. La URL base durante el desarrollo es:
`http://localhost:3000/api/public/hotel/[hotelId]`

---

## 🏗️ Endpoints Disponibles

### 1. Obtener Información del Hotel
Retorna los datos básicos de la propiedad (Nombre, Logo, Tipo).
- **URL**: `/api/public/hotel/[hotelId]`
- **Método**: `GET`
- **Respuesta (JSON)**:
```json
{
  "id": "uuid-v4",
  "name": "Nombre del Hotel",
  "type": "Resort / Hostal / Boutique",
  "logoUrl": "https://..."
}
```

### 2. Consultar Inventario Disponible
Retorna una lista de habitaciones con estado "Limpia" listas para ser reservadas.
- **URL**: `/api/public/hotel/[hotelId]/inventory`
- **Método**: `GET`
- **Respuesta (JSON)**:
```json
[
  {
    "id": "room-uuid",
    "number": "101",
    "type": "Suite",
    "status": "Limpia"
  }
]
```

### 3. Crear Reservación (Microservicio de Reservas)
Envía una nueva solicitud de reserva al ERP. Dependiendo del método de pago, el estado inicial será PENDIENTE.
- **URL**: `/api/public/hotel/[hotelId]/reservations`
- **Método**: `POST`
- **Body (JSON)**:
```json
{
  "guestName": "Nombre del Cliente",
  "roomNumber": "101",
  "checkIn": "2026-03-22T16:00:00.000Z",
  "paymentMethod": "EN_LINEA", // "EN_LINEA" o "EFECTIVO"
  "paymentProvider": "STRIPE", // "STRIPE", "PAYPAL", "MERCADOPAGO", "NINGUNO"
  "transactionId": "id-de-la-pasarela", // Opcional al crear
  "amount": 2500.50
}
```

### 4. Procesar Pago (Microservicio de Pagos)
Cambia el estado de pago de una reservación existente (ej. confirmar que el pago en línea fue exitoso).
- **URL**: `/api/public/hotel/[hotelId]/payments`
- **Método**: `POST`
- **Body (JSON)**:
```json
{
  "reservationId": "uuid-de-la-reservacion",
  "action": "CONFIRM_ONLINE_PAYMENT", // "CONFIRM_ONLINE_PAYMENT", "REGISTER_CASH_PAYMENT", "REFUND"
  "transactionId": "pay_1N2M3...", // Opcional: ID de la transacción
  "paymentProvider": "STRIPE" // Opcional: Para actualizar el proveedor
}
```

---

## 🌐 Configuración de CORS
El ERP está configurado para aceptar peticiones desde cualquier origen (`Access-Control-Allow-Origin: *`). Esto permite que aplicaciones de React, Vue, o Vanilla JS consuman los datos directamente.

---

## 🗄️ Estrategia de Base de Datos: MongoDB (Local + Cloud)

Aura ahora utiliza **MongoDB**, lo que te permite trabajar sin conexión (Local) y sincronizar con la nube (Atlas) de forma manual o configurada.

### 🏠 Uso Local (Sin Internet / Dev)
Usa **MongoDB Compass**. La URL en tu `.env.local` debe ser:
`DATABASE_URL="mongodb://localhost:27017/aura"`

### ☁️ Uso en la Nube (Con Internet / Vercel)
Usa **MongoDB Atlas**. La URL en tu `.env.local` o en la configuración de Vercel debe ser:
`DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.mongodb.net/aura?retryWrites=true&w=majority"`

### 🔄 Cómo "Sincronizar"
1. **Manual**: Usa la función de **Exportar/Importar JSON** de Compass para mover datos de tu máquina local a Atlas cuando recuperes la conexión.
2. **Cambio Rápido**: Solo necesitas cambiar la línea `DATABASE_URL` en tu archivo `.env.local` y el sistema comenzará a leer/escribir en la nueva ubicación inmediatamente.

---

## 🛡️ Aura Resilience System (Automatic Failover)

Aura tiene un sistema de **Resiliencia Automática** integrado en el núcleo. El sistema siempre intentará usar **MongoDB Atlas** (Nube) como prioridad.

### 🔄 Cómo funciona el Fallback Automático:
1. El ERP intenta realizar la operación en Atlas.
2. Si el ERP detecta que no hay internet o que Atlas no responde (Error `P1001`), **cambia automáticamente a MongoDB Compass (Local)** para esa operación.
3. No verás errores en pantalla; el sistema simplemente usará tu base de datos local de forma transparente.

### 🧪 Cómo probarlo:
1. Abre el Dashboard de Aura.
2. **Desconecta tu internet** o bloquea el acceso a Atlas.
3. Crea una reserva o habitación.
4. Verás en la consola del servidor un mensaje: `[AURA] Cloud Connectivity Lost... Using Local Compass fallback...`.
5. Abre **MongoDB Compass** y verás que los datos se guardaron localmente.

### ⚠️ Nota sobre la Sincronización:
El sistema te permite seguir operando sin internet, pero recuerda que los datos guardados en local **no se subirán solos** a Atlas cuando vuelva la red. Deberás usar la herramienta de **Importar/Exportar JSON** de MongoDB Compass para sincronizarlos manualmente cuando lo consideres necesario.

> [!IMPORTANT]
> MongoDB en local necesita que tengas instalado el servicio de MongoDB Community Server.
