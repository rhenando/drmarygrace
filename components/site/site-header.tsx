import Link from "next/link";
import { PhoneCall, Menu, MapPin, CalendarCheck2 } from "lucide-react";
import { clinic } from "@/components/site/clinic-config";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

const navItems = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const callHref = telHref(clinic.phone);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur'>
      {/* Announcement Bar */}
      {clinic.announcement ? (
        <div className='bg-sky-900 text-white'>
          <div className='mx-auto flex max-w-6xl items-center justify-center px-4 py-2 text-xs sm:text-sm'>
            <span className='opacity-95'>{clinic.announcement}</span>
          </div>
        </div>
      ) : null}

      {/* Main Header */}
      <div className='mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3'>
        {/* Brand */}
        <div className='flex min-w-0 items-center gap-3'>
          {/* Simple logo mark (clinic-style) */}
          <div className='grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-900 text-white'>
            <span className='text-sm font-semibold'>MG</span>
          </div>

          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-slate-900 sm:text-base'>
              {clinic.name}
            </p>
            <p className='truncate text-xs text-slate-600'>
              Ortho • General Dentistry • Family-friendly care
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className='hidden items-center gap-6 lg:flex'>
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className='text-sm font-medium text-slate-700 hover:text-slate-900'
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className='flex items-center gap-2'>
          {/* Desktop phone */}
          <a
            href={callHref}
            className='hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 lg:inline-flex'
          >
            <PhoneCall className='h-4 w-4 text-sky-900' />
            {clinic.phone}
          </a>

          {/* Primary CTA */}
          <Button
            asChild
            className='hidden sm:inline-flex bg-emerald-600 text-white hover:bg-emerald-700'
          >
            <Link href='#appointment'>
              <CalendarCheck2 className='mr-2 h-4 w-4' />
              Request Appointment
            </Link>
          </Button>

          {/* Mobile: menu */}
          <div className='lg:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant='secondary'
                  className='h-10 w-10 p-0'
                  aria-label='Open menu'
                >
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>

              <SheetContent side='right' className='w-[320px]'>
                <SheetHeader>
                  <SheetTitle className='text-left'>{clinic.name}</SheetTitle>
                </SheetHeader>

                <div className='mt-4 space-y-4'>
                  <a
                    href={callHref}
                    className='flex items-center gap-3 rounded-2xl border p-4'
                  >
                    <div className='grid h-10 w-10 place-items-center rounded-2xl bg-sky-900 text-white'>
                      <PhoneCall className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-slate-900'>
                        Call / Text
                      </p>
                      <p className='truncate text-sm text-slate-600'>
                        {clinic.phone}
                      </p>
                    </div>
                  </a>

                  <div className='rounded-2xl border p-4'>
                    <p className='text-sm font-semibold text-slate-900'>
                      Address
                    </p>
                    <p className='mt-1 text-sm text-slate-600'>
                      {clinic.address}
                    </p>

                    <Button asChild variant='secondary' className='mt-3 w-full'>
                      <Link href='#contact'>
                        <MapPin className='mr-2 h-4 w-4' />
                        View Map
                      </Link>
                    </Button>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    {navItems.map((n) => (
                      <Button
                        key={n.href}
                        asChild
                        variant='secondary'
                        className='w-full justify-start'
                      >
                        <Link href={n.href}>{n.label}</Link>
                      </Button>
                    ))}
                  </div>

                  <Button
                    asChild
                    className='w-full bg-emerald-600 text-white hover:bg-emerald-700'
                  >
                    <Link href='#appointment'>
                      <CalendarCheck2 className='mr-2 h-4 w-4' />
                      Appointment Inquiry
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile quick actions row (clinic-style) */}
      <div className='border-t bg-white sm:hidden'>
        <div className='mx-auto flex max-w-6xl gap-2 px-4 py-2'>
          <Button
            asChild
            className='flex-1 bg-sky-900 text-white hover:bg-sky-950'
          >
            <a href={callHref}>
              <PhoneCall className='mr-2 h-4 w-4' />
              Call
            </a>
          </Button>

          <Button
            asChild
            className='flex-1 bg-emerald-600 text-white hover:bg-emerald-700'
          >
            <Link href='#appointment'>
              <CalendarCheck2 className='mr-2 h-4 w-4' />
              Book
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
