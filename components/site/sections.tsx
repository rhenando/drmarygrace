// components/site/page-sections.tsx
import Image from "next/image";
import Link from "next/link";
import {
  PhoneCall,
  CalendarCheck2,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Smile,
  Braces,
} from "lucide-react";

import { clinic } from "@/components/site/clinic-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppointmentForm } from "./appointment-form";

function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

function mapsSearchHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

// Simple icon mapping for services (fallback by index)
function serviceIcon(i: number) {
  const icons = [
    <Sparkles key='cleaning' className='h-5 w-5 text-sky-700' />,
    <ShieldCheck key='filling' className='h-5 w-5 text-sky-700' />,
    <Smile key='extraction' className='h-5 w-5 text-sky-700' />,
    <Braces key='braces' className='h-5 w-5 text-sky-700' />,
  ];
  return icons[i] ?? <Sparkles className='h-5 w-5 text-sky-700' />;
}

export function PageSections() {
  const primaryPhone = clinic.phones?.[0] ?? clinic.phone;
  const callHref = telHref(primaryPhone);

  const directionsHref =
    (clinic as any).directionsUrl?.trim?.() || mapsSearchHref(clinic.address);

  // Use a clean photo for the hero (avoid using the banner image with text)
  const heroImage = clinic.images.room || clinic.images.hero;

  return (
    <div className='bg-sky-50'>
      {/* HERO */}
      <section className='mx-auto max-w-6xl px-4 pt-6 sm:pt-10'>
        <div className='relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sky-100'>
          <div className='grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center'>
            {/* Copy */}
            <div className='space-y-5'>
              <div className='inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800'>
                <ShieldCheck className='h-4 w-4' />
                {clinic.tagline}
              </div>

              <div className='space-y-2'>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl'>
                  {clinic.name}
                </h1>
                <p className='max-w-xl text-slate-600'>{clinic.subtagline}</p>
              </div>

              {/* Quick info chips */}
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='flex items-start gap-3 rounded-2xl bg-sky-50 p-4'>
                  <MapPin className='mt-0.5 h-5 w-5 text-sky-700' />
                  <div className='text-sm'>
                    <p className='font-semibold text-slate-900'>
                      Clinic Address
                    </p>
                    <p className='text-slate-600'>{clinic.address}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3 rounded-2xl bg-sky-50 p-4'>
                  <Clock className='mt-0.5 h-5 w-5 text-sky-700' />
                  <div className='text-sm'>
                    <p className='font-semibold text-slate-900'>Clinic Hours</p>
                    <p className='text-slate-600'>
                      {clinic.hours?.[0]?.day}: {clinic.hours?.[0]?.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button
                  asChild
                  className='w-full bg-sky-700 text-white hover:bg-sky-800 sm:w-auto'
                >
                  <a href={callHref}>
                    <PhoneCall className='mr-2 h-4 w-4' />
                    Tap to Call
                  </a>
                </Button>

                <Button
                  asChild
                  className='w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto'
                >
                  <Link href='#appointment'>
                    <CalendarCheck2 className='mr-2 h-4 w-4' />
                    Appointment Inquiry
                  </Link>
                </Button>

                <Button
                  asChild
                  className='w-full bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 sm:w-auto'
                >
                  <a href={directionsHref} target='_blank' rel='noreferrer'>
                    <MapPin className='mr-2 h-4 w-4' />
                    Get Directions
                  </a>
                </Button>
              </div>

              {/* Phones */}
              <div className='text-sm text-slate-600'>
                <span className='font-semibold text-slate-900'>
                  Call/Text:{" "}
                </span>
                <span className='flex flex-wrap gap-x-3 gap-y-1'>
                  {(clinic.phones?.length ? clinic.phones : [clinic.phone]).map(
                    (p) => (
                      <a
                        key={p}
                        className='font-semibold text-sky-800 underline'
                        href={telHref(p)}
                      >
                        {p}
                      </a>
                    )
                  )}
                </span>
              </div>

              {/* Announcement */}
              {clinic.announcement ? (
                <p className='text-sm text-slate-600'>{clinic.announcement}</p>
              ) : null}
            </div>

            {/* Hero image */}
            <div className='relative min-h-65 overflow-hidden rounded-2xl bg-sky-100 lg:min-h-105'>
              <Image
                src={heroImage}
                alt='Dental clinic'
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 50vw'
                priority
              />
              <div className='absolute inset-0 bg-linear-to-t from-white/30 via-transparent to-transparent' />
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 py-10 sm:py-14'>
        <Separator className='bg-sky-100' />

        {/* SERVICES */}
        <div id='services' className='mt-10 space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight text-slate-900'>
              Services
            </h2>
            <p className='mt-1 text-slate-600'>
              Common services patients ask for — cleaning, fillings (pasta),
              extraction (bunot), and braces.
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            {clinic.services.map((s, i) => (
              <ServiceCard
                key={s.title}
                icon={serviceIcon(i)}
                title={s.title}
                desc={s.desc}
              />
            ))}
          </div>

          <div className='grid gap-6 lg:grid-cols-3'>
            <Card className='overflow-hidden border-sky-100'>
              <div className='relative h-44 bg-sky-100'>
                <Image
                  src={clinic.images.dentist}
                  alt='Dentist with patient'
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 33vw'
                />
              </div>
              <CardContent className='p-5'>
                <p className='font-semibold text-slate-900'>
                  {clinic.pillars?.[0]?.title ?? "Patient-first care"}
                </p>
                <p className='mt-1 text-sm text-slate-600'>
                  {clinic.pillars?.[0]?.desc ??
                    "Friendly guidance and clear explanations for every visit."}
                </p>
              </CardContent>
            </Card>

            <Card className='overflow-hidden border-sky-100'>
              <div className='relative h-44 bg-sky-100'>
                <Image
                  src={clinic.images.room}
                  alt='Clean dental treatment room'
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 33vw'
                />
              </div>
              <CardContent className='p-5'>
                <p className='font-semibold text-slate-900'>
                  {clinic.pillars?.[1]?.title ?? "Clean & safe clinic"}
                </p>
                <p className='mt-1 text-sm text-slate-600'>
                  {clinic.pillars?.[1]?.desc ??
                    "Sterilized tools and proper hygiene practices for safety."}
                </p>
              </CardContent>
            </Card>

            <Card className='overflow-hidden border-sky-100'>
              <div className='relative h-44 bg-sky-100'>
                <Image
                  src={clinic.images.hygiene}
                  alt='Dental hygiene'
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 33vw'
                />
              </div>
              <CardContent className='p-5'>
                <p className='font-semibold text-slate-900'>
                  {clinic.pillars?.[2]?.title ?? "Easy booking"}
                </p>
                <p className='mt-1 text-sm text-slate-600'>
                  {clinic.pillars?.[2]?.desc ??
                    "Tap to call or send an inquiry — we’ll confirm your schedule."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className='mt-12 bg-sky-100' />

        {/* ABOUT + HOURS */}
        <div
          id='about'
          className='mt-10 grid gap-8 lg:grid-cols-2 lg:items-start'
        >
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold tracking-tight text-slate-900'>
              {clinic.about?.title ?? "About the Clinic"}
            </h2>

            <div className='space-y-3 text-slate-600'>
              {(clinic.about?.body ?? []).map((p: string) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <Card className='border-sky-100'>
              <CardContent className='p-5'>
                <p className='font-semibold text-slate-900'>Clinic Hours</p>
                <div className='mt-3 space-y-2 text-sm'>
                  {clinic.hours.map((h) => (
                    <div
                      key={h.day}
                      className='flex items-center justify-between gap-4'
                    >
                      <span className='text-slate-600'>{h.day}</span>
                      <span className='font-semibold text-slate-900'>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sky-100'>
            <div className='relative h-64 sm:h-80'>
              <Image
                src={clinic.images.dentist || clinic.images.hero}
                alt='Dental care'
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
              <div className='absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-transparent' />
            </div>
            <div className='p-5'>
              <p className='font-semibold text-slate-900'>
                Comfortable, guided visits
              </p>
              <p className='mt-1 text-sm text-slate-600'>
                We explain clearly before any procedure and guide you through
                the next steps after your visit.
              </p>
            </div>
          </div>
        </div>

        <Separator className='mt-12 bg-sky-100' />

        {/* CONTACT + MAP + FORM */}
        <div id='contact' className='mt-10 space-y-6'>
          <h2 className='text-2xl font-semibold tracking-tight text-slate-900'>
            Contact & Location
          </h2>

          <div className='grid gap-6 lg:grid-cols-2'>
            <div className='space-y-4'>
              <Card className='border-sky-100'>
                <CardContent className='space-y-4 p-5'>
                  <div>
                    <p className='text-sm font-semibold text-slate-900'>
                      Address
                    </p>
                    <p className='text-sm text-slate-600'>{clinic.address}</p>

                    <div className='mt-3'>
                      <Button
                        asChild
                        className='w-full bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50'
                      >
                        <a
                          href={directionsHref}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <MapPin className='mr-2 h-4 w-4' />
                          Open in Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className='text-sm font-semibold text-slate-900'>
                      Phone
                    </p>
                    <div className='mt-1 flex flex-col gap-1'>
                      {(clinic.phones?.length
                        ? clinic.phones
                        : [clinic.phone]
                      ).map((p) => (
                        <a
                          key={p}
                          className='text-sm font-semibold text-sky-800 underline'
                          href={telHref(p)}
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-3 pt-1'>
                    <Button
                      asChild
                      className='bg-sky-700 text-white hover:bg-sky-800'
                    >
                      <a href={callHref}>
                        <PhoneCall className='mr-2 h-4 w-4' />
                        Call Now
                      </a>
                    </Button>
                    <Button
                      asChild
                      className='bg-emerald-600 text-white hover:bg-emerald-700'
                    >
                      <Link href='#appointment'>
                        <CalendarCheck2 className='mr-2 h-4 w-4' />
                        Inquiry
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {clinic.mapEmbedUrl ? (
                <Card className='overflow-hidden border-sky-100'>
                  <iframe
                    title='Google Map'
                    src={clinic.mapEmbedUrl}
                    className='h-80 w-full'
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                  />
                </Card>
              ) : (
                <Card className='border-sky-100'>
                  <CardContent className='p-5 text-sm text-slate-600'>
                    Map is currently unavailable. Please use{" "}
                    <a
                      className='font-semibold text-sky-800 underline'
                      href={directionsHref}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Open in Google Maps
                    </a>{" "}
                    for directions.
                  </CardContent>
                </Card>
              )}
            </div>

            <div id='appointment' className='scroll-mt-24'>
              <Card className='border-sky-100'>
                <CardContent className='p-5'>
                  <div className='mt-5'>
                    <AppointmentForm />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky bottom bar */}
      <div className='fixed inset-x-0 bottom-0 z-50 border-t border-sky-100 bg-white/95 p-3 backdrop-blur sm:hidden'>
        <div className='mx-auto flex max-w-6xl gap-3 px-1'>
          <Button
            asChild
            className='flex-1 bg-sky-700 text-white hover:bg-sky-800'
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
      <div className='h-16 sm:hidden' />
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className='border-sky-100 bg-white'>
      <CardContent className='flex gap-4 p-5'>
        <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50'>
          {icon}
        </div>
        <div>
          <p className='font-semibold text-slate-900'>{title}</p>
          <p className='mt-1 text-sm text-slate-600'>{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
