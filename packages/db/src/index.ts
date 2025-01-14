import { PrismaClient } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';

export type { JsonObject };

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type GlobalThisWithPrisma = typeof globalThis & {
  prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
};

const globalThisWithPrisma = globalThis as GlobalThisWithPrisma;

const prisma = globalThisWithPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThisWithPrisma.prismaGlobal = prisma;
}

export default prisma;