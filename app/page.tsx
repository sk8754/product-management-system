import TopPage from "@/components/view/TopPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const storedData = await prisma.stored.findMany();

  return (
    <>
      <TopPage storedData={storedData} />
    </>
  );
}
