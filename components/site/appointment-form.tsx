"use client";

import * as React from "react";
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
  return <p className='mt-1 text-sm text-red-600'>{msg}</p>;
}

function FormNotice({
  ok,
  message,
}: {
  ok?: boolean;
  message?: string | null;
}) {
  if (!message) return null;
  return (
    <div
      className={[
        "rounded-2xl border p-3 text-sm",
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700",
      ].join(" ")}
    >
      {message}
    </div>
  );
}

export function AppointmentForm() {
  // React 19 / Next 16: useActionState replaces useFormState
  const [state, action, isPending] = React.useActionState(
    submitInquiry,
    initialState
  );

  return (
    <Card className='overflow-hidden border-sky-100 bg-white'>
      <CardHeader className='border-b border-sky-100 bg-linear-to-b from-sky-50 to-white'>
        <CardTitle className='text-xl text-slate-900'>
          Appointment Inquiry
        </CardTitle>
        <p className='mt-1 text-sm text-slate-600'>
          Fill out the form and we’ll reply to confirm your schedule.
        </p>
      </CardHeader>

      <CardContent className='p-5'>
        <form action={action} className='space-y-4'>
          <input type='hidden' name='clinicName' value={clinic.name} />

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label htmlFor='fullName' className='text-slate-900'>
                Full Name <span className='text-red-600'>*</span>
              </Label>
              <Input
                id='fullName'
                name='fullName'
                placeholder='Juan Dela Cruz'
                className='mt-1 rounded-2xl border-slate-200 bg-white focus-visible:ring-sky-200'
                autoComplete='name'
                disabled={isPending}
              />
              <FieldError
                msg={
                  state && !state.ok ? state.fieldErrors?.fullName : undefined
                }
              />
            </div>

            <div>
              <Label htmlFor='phone' className='text-slate-900'>
                Mobile Number <span className='text-red-600'>*</span>
              </Label>
              <Input
                id='phone'
                name='phone'
                placeholder='09xxxxxxxxx'
                inputMode='tel'
                className='mt-1 rounded-2xl border-slate-200 bg-white focus-visible:ring-sky-200'
                autoComplete='tel'
                disabled={isPending}
              />
              <FieldError
                msg={state && !state.ok ? state.fieldErrors?.phone : undefined}
              />
            </div>
          </div>

          <div>
            <Label htmlFor='email' className='text-slate-900'>
              Email <span className='text-slate-500'>(optional)</span>
            </Label>
            <Input
              id='email'
              name='email'
              placeholder='you@email.com'
              inputMode='email'
              className='mt-1 rounded-2xl border-slate-200 bg-white focus-visible:ring-sky-200'
              autoComplete='email'
              disabled={isPending}
            />
            <FieldError
              msg={state && !state.ok ? state.fieldErrors?.email : undefined}
            />
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Label htmlFor='service' className='text-slate-900'>
                Service <span className='text-red-600'>*</span>
              </Label>

              <Input
                id='service'
                name='service'
                placeholder='Select or type…'
                list='clinic-services'
                className='mt-1 rounded-2xl border-slate-200 bg-white focus-visible:ring-sky-200'
                disabled={isPending}
              />
              <datalist id='clinic-services'>
                {clinic.services?.map((s) => (
                  <option key={s.title} value={s.title} />
                ))}
                <option value='Braces / Orthodontics' />
                <option value='Cleaning' />
                <option value='Pasta (Dental Filling)' />
                <option value='Bunot (Tooth Extraction)' />
              </datalist>

              <FieldError
                msg={
                  state && !state.ok ? state.fieldErrors?.service : undefined
                }
              />
            </div>

            <div>
              <Label htmlFor='preferredDate' className='text-slate-900'>
                Preferred Date/Time{" "}
                <span className='text-slate-500'>(optional)</span>
              </Label>
              <Input
                id='preferredDate'
                name='preferredDate'
                placeholder='e.g., Jan 10, 3:00 PM'
                className='mt-1 rounded-2xl border-slate-200 bg-white focus-visible:ring-sky-200'
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <Label htmlFor='message' className='text-slate-900'>
              Message <span className='text-slate-500'>(optional)</span>
            </Label>
            <Textarea
              id='message'
              name='message'
              placeholder='Tell us your concern (e.g., toothache, braces consult, cleaning)…'
              rows={4}
              className='mt-1 rounded-2xl border-slate-200 bg-white focus-visible:ring-sky-200'
              disabled={isPending}
            />
          </div>

          <Button
            type='submit'
            className='w-full rounded-md bg-emerald-600 text-white hover:bg-emerald-700'
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Inquiry"}
          </Button>

          <FormNotice ok={state?.ok} message={state?.message} />

          <p className='text-xs text-slate-500'>
            By submitting this form, you agree that the clinic may contact you
            via call or SMS to confirm your appointment.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
