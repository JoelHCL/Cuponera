export type CouponStatus = "disponible" | "solicitado" | "cobrado";

export interface MemberPublic {
  id: string;
  displayName: string;
}

export interface CouponDTO {
  id: string;
  title: string;
  description: string | null;
  status: CouponStatus;
  creatorId: string;
  recipientId: string;
  creatorName: string;
  recipientName: string;
  requestNote: string | null;
  requestedAt: string | null;
  redeemedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export const STATUS_LABEL: Record<CouponStatus, string> = {
  disponible: "Disponible",
  solicitado: "Solicitado",
  cobrado: "Cobrado",
};
