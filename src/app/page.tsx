import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();
  if (!session) {
    const space = await prisma.space.findFirst();
    redirect(space ? "/login" : "/setup");
  }
  return <Dashboard />;
}
