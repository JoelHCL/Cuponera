import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "sesion";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-inseguro");

export interface Session {
  memberId: string;
  spaceId: string;
}

export async function createSession(session: Session): Promise<void> {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.memberId === "string" && typeof payload.spaceId === "string") {
      return { memberId: payload.memberId, spaceId: payload.spaceId };
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  cookies().delete(COOKIE);
}
