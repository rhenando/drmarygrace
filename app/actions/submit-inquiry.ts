"use server";

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
