import { prisma } from "@/lib/prisma";
import type { CouponDTO, CouponStatus } from "@/lib/types";

type CouponWithMembers = Awaited<ReturnType<typeof loadCoupon>>;

export async function loadCoupon(id: string) {
  return prisma.coupon.findUnique({
    where: { id },
    include: { creator: true, recipient: true },
  });
}

export function toDTO(c: NonNullable<CouponWithMembers>): CouponDTO {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    status: c.status as CouponStatus,
    creatorId: c.creatorId,
    recipientId: c.recipientId,
    creatorName: c.creator.displayName,
    recipientName: c.recipient.displayName,
    requestNote: c.requestNote,
    requestedAt: c.requestedAt ? c.requestedAt.toISOString() : null,
    redeemedAt: c.redeemedAt ? c.redeemedAt.toISOString() : null,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
  };
}
