import { Prisma } from "@/app/generated/prisma/client";

export const orderInclude = {
  Product: true,
  user: true,
} satisfies Prisma.OrderInclude;

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;
