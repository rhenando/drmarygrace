#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function writeFileSafely(filePath, content) {
  const abs = path.join(root, filePath);
  ensureDir(path.dirname(abs));

  if (fs.existsSync(abs)) {
    const bak = `${abs}.bak-${timestamp()}`;
    fs.copyFileSync(abs, bak);
    console.log(`• Backed up: ${filePath} -> ${path.relative(root, bak)}`);
  }

  fs.writeFileSync(abs, content, "utf8");
  console.log(`✓ Wrote: ${filePath}`);
}

const files = [
  {
    file: "components/site/clinic-config.ts",
    content: `export const clinic = {
  name: process.env.NEXT_PUBLIC_CLINIC_NAME ?? "SmileCare Dental Clinic",
  phone: process.env.NEXT_PUBLIC_CLINIC_PHONE ?? "+639171234567",
  address:
    process.env.NEXT_PUBLIC_CLINIC_ADDRESS ?? "123 Example St, Quezon City",
  mapEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? "",
  hours: [
    { day: "Mon–Fri", time: "9:00 AM – 6:00 PM" },
    { day: "Saturday", time: "9:00 AM – 3:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  services: [
    { title: "Cleaning", desc: "Professional cleaning for healthier teeth and gums." },
    { title: "Pasta (Dental Filling)", desc: "Fast relief for cavities with durable fillings." },
    { title: "Bunot (Tooth Extraction)", desc: "Safe, gentle extraction with proper aftercare." },
    { title: "Braces", desc: "Orthodontic treatment for a straighter smile." },
  ],
};
`,
  },

  {
    file: "app/actions/submit-inquiry.ts",
    content: `"use server";

import { z } from "zod";

const InquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email.").optional().or(z.literal("")),
  service: z.string().min(2, "Please select a service."),
  preferredDate: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
  clinicName: z.string().optional().or(z.literal("")),
});

export type InquiryState =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function submitInquiry(
  _: InquiryState | null,
  formData: FormData
): Promise<InquiryState> {
  const raw = {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    service: String(formData.get("service") ?? ""),
    preferredDate: String(formData.get("preferredDate") ?? ""),
    message: String(formData.get("message") ?? ""),
    clinicName: String(formData.get("clinicName") ?? ""),
  };

  const parsed = InquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please check the form and try again.", fieldErrors };
  }

  // Optional: save to Supabase if env is present
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, serviceKey);

    const { error } = await supabase.from("appointment_inquiries").insert({
      clinic_name: parsed.data.clinicName || null,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      service: parsed.data.service,
      preferred_date: parsed.data.preferredDate || null,
      message: parsed.data.message || null,
    });

    if (error) {
      return { ok: false, message: "Submission failed. Please try again in a bit." };
    }
  } else {
    // If no DB, you can later replace this with email sending (Resend, SMTP, etc.)
    console.log("Inquiry received (no DB):", parsed.data);
  }

  return { ok: true, message: "✅ Thanks! We received your inquiry. We’ll contact you shortly." };
}
`,
  },

  {
    file: "components/site/appointment-form.tsx",
    content: `"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { submitInquiry, type InquiryState } from "@/app/actions/submit-inquiry";
import { clinic } from "@/components/site/clinic-config";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialState: InquiryState | null = null;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-sm text-red-500">{msg}</p>;
}

export function AppointmentForm() {
  const [state, action] = useFormState(submitInquiry, initialState);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl">Appointment Inquiry</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="clinicName" value={clinic.name} />

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" placeholder="Juan Dela Cruz" />
            <FieldError msg={state && !state.ok ? state.fieldErrors?.fullName : undefined} />
          </div>

          <div>
            <Label htmlFor="phone">Mobile Number</Label>
            <Input id="phone" name="phone" placeholder="09xxxxxxxxx" inputMode="tel" />
            <FieldError msg={state && !state.ok ? state.fieldErrors?.phone : undefined} />
          </div>

          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" name="email" placeholder="you@email.com" inputMode="email" />
            <FieldError msg={state && !state.ok ? state.fieldErrors?.email : undefined} />
          </div>

          <div>
            <Label htmlFor="service">Service</Label>
            <Input id="service" name="service" placeholder="Cleaning / Pasta / Bunot / Braces" />
            <FieldError msg={state && !state.ok ? state.fieldErrors?.service : undefined} />
          </div>

          <div>
            <Label htmlFor="preferredDate">Preferred Date/Time (optional)</Label>
            <Input id="preferredDate" name="preferredDate" placeholder="e.g., Jan 10, 3PM" />
          </div>

          <div>
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea id="message" name="message" placeholder="Tell us your concern..." rows={4} />
          </div>

          <Button type="submit" className="w-full">
            Send Inquiry
          </Button>

          {state?.message ? (
            <p className={\`text-sm \${state.ok ? "text-emerald-600" : "text-red-500"}\`}>
              {state.message}
            </p>
          ) : null}

          <p className="text-xs text-muted-foreground">
            By submitting, you agree that the clinic may contact you via call/SMS.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
`,
  },

  {
    file: "components/site/sections.tsx",
    content: `import Link from "next/link";
import { PhoneCall, CalendarCheck2, MapPin, Clock, BadgeCheck } from "lucide-react";
import { clinic } from "@/components/site/clinic-config";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AppointmentForm } from "./appointment-form";

function telHref(phone: string) {
  const cleaned = phone.replace(/[^\\d+]/g, "");
  return \`tel:\\\${cleaned}\`;
}

export function PageSections() {
  const callHref = telHref(clinic.phone);

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="space-y-6">
        <Badge className="w-fit">
          <BadgeCheck className="mr-2 h-4 w-4" />
          Gentle care. Clear pricing. Easy booking.
        </Badge>

        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {clinic.name}
          </h1>
          <p className="max-w-xl text-muted-foreground">
            A clean, modern dental clinic page that helps patients call and book faster—mobile-first.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <a href={callHref}>
              <PhoneCall className="mr-2 h-4 w-4" />
              Tap to Call
            </a>
          </Button>

          <Button asChild className="w-full sm:w-auto">
            <Link href="#appointment">
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Book Appointment
            </Link>
          </Button>

          <Button asChild className="w-full sm:w-auto">
            <Link href="#contact">
              <MapPin className="mr-2 h-4 w-4" />
              Get Directions
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
            <div className="text-sm">
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">{clinic.address}</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Phone</p>
              <a className="text-muted-foreground underline" href={callHref}>
                {clinic.phone}
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* SERVICES */}
      <section id="services" className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Services</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {clinic.services.map((s) => (
            <Card key={s.title}>
              <CardContent className="p-5">
                <p className="font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Want to add more (e.g., Whitening, Root Canal, Dentures)? Easy—just update the config.
        </p>
      </section>

      <Separator />

      {/* ABOUT + HOURS */}
      <section id="about" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">About the Clinic</h2>
        <p className="max-w-3xl text-muted-foreground">
          Share your clinic story here: your dentists’ experience, sterilization process, modern equipment,
          and patient-first approach. This builds trust fast—especially for new patients from Google Maps.
        </p>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5" />
              <div className="w-full">
                <p className="font-medium">Clinic Hours</p>
                <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                  {clinic.hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between gap-4">
                      <span>{h.day}</span>
                      <span className="font-medium text-foreground">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* CONTACT + MAP + FORM */}
      <section id="contact" className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <CardContent className="space-y-2 p-5">
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{clinic.address}</p>

                <p className="pt-3 text-sm font-medium">Phone</p>
                <a className="text-sm text-muted-foreground underline" href={callHref}>
                  {clinic.phone}
                </a>

                <div className="pt-4 flex gap-3">
                  <Button asChild className="flex-1">
                    <a href={callHref}>
                      <PhoneCall className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="#appointment">
                      <CalendarCheck2 className="mr-2 h-4 w-4" />
                      Inquiry
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {clinic.mapEmbedUrl ? (
              <Card className="overflow-hidden">
                <iframe
                  title="Google Map"
                  src={clinic.mapEmbedUrl}
                  className="h-70 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Card>
            ) : (
              <Card>
                <CardContent className="p-5 text-sm text-muted-foreground">
                  Add your Google Maps embed URL in <code>.env.local</code> to show the map.
                </CardContent>
              </Card>
            )}
          </div>

          <div id="appointment" className="scroll-mt-24">
            <AppointmentForm />
          </div>
        </div>
      </section>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-6xl gap-3 px-1">
          <Button asChild className="flex-1">
            <a href={callHref}>
              <PhoneCall className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
          <Button asChild className="flex-1">
            <Link href="#appointment">
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Book
            </Link>
          </Button>
        </div>
      </div>

      <div className="h-16 sm:hidden" />
    </div>
  );
}
`,
  },

  {
    file: "app/page.tsx",
    content: `import { PageSections } from "@/components/site/sections";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <PageSections />
    </main>
  );
}
`,
  },
];

console.log("Generating dental starter files...\n");
ensureDir(path.join(root, "scripts"));

for (const f of files) {
  writeFileSafely(f.file, f.content);
}

console.log("\nDone ✅");
console.log("\nNext steps:");
console.log(
  "1) Ensure you have these deps installed: lucide-react zod @supabase/supabase-js"
);
console.log(
  "2) Add shadcn components if missing: button card input textarea label separator badge"
);
console.log("3) Create .env.local (clinic details + optional Supabase keys)");
console.log("4) Run: npm run dev");
