import { PageSections } from "@/components/site/sections";
import { SiteHeader } from "@/components/site/site-header";

export default function HomePage() {
  return (
    <main className='mx-auto w-full max-w-7xl px-4 py-10'>
      <SiteHeader />
      <PageSections />
    </main>
  );
}
