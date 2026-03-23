import { PrismaClient } from "@prisma/client";

const DATABASE_URL = process.env.DATABASE_URL!;
const FALLBACK_URL = process.env.FALLBACK_DATABASE_URL!;

const prismaClientSingleton = (url: string) => {
  return new PrismaClient({
    datasources: { db: { url } }
  });
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

// Primary Client (Atlas)
const primaryPrisma = globalThis.prisma ?? prismaClientSingleton(DATABASE_URL);

if (process.env.NODE_ENV !== "production") globalThis.prisma = primaryPrisma;

/**
 * AURA RESILIENCE WRAPPER (Extension)
 * Intercepts all database operations to provide a seamless fallback to 
 * local MongoDB if Atlas is unreachable or the internet is down.
 */
export const auraPrisma = primaryPrisma.$extends({
  query: {
    async $allOperations({ model, operation, args, query }) {
      try {
        // Step 1: Attempt the query on Atlas (Primary)
        return await query(args);
      } catch (error: any) {
        // Step 2: Detect connection failure (P1001, etc.)
        const isConnectionError = 
          error.code === 'P1001' || 
          error.code === 'P2024' || 
          error.message?.includes('Can\'t reach database');

        if (isConnectionError && FALLBACK_URL) {
          console.warn(`[AURA] Cloud Connectivity Lost. Model: ${model || 'Global'}, Op: ${operation}. Using Local Compass fallback...`);
          
          // Step 3: Initialize a temporary local client for this query
          const localClient = prismaClientSingleton(FALLBACK_URL);
          try {
            // @ts-ignore - Dynamic dispatch to the local model
            return await localClient[model ? model.toLowerCase() : 'query'](args);
          } finally {
            await localClient.$disconnect();
          }
        }
        
        // Re-throw if it wasn't a connection issue (e.g. Prisma logic error)
        throw error;
      }
    },
  },
});

export default auraPrisma;
