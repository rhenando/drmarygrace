// components/site/clinic-config.ts
export const clinic = {
  // Clinic + Dentist (based on your banner)
  name: "Dr. Mary Grace Diwa Ortho-Dental Clinic",
  doctorName: "Mary Grace R. Diwa, DMD",

  // Banner tagline (keep exact wording)
  tagline: "Committed in Giving you Great Smile",

  // Short line under hero
  subtagline:
    "Gentle ortho-dental care for kids and adults — Cleaning, Pasta (Filling), Bunot (Extraction), and Braces.",

  // Announcement bar
  announcement: "Now accepting appointment inquiries — call or text to book.",

  // Contact (based on banner)
  phone: "0968-8832250",
  phones: ["0968-8832250", "0921-9857788"],

  // Address (based on banner)
  address: "2202 Mindanao Ave. Cor. Cebu St., Sampaloc, Manila.",

  /**
   * ✅ Use ONLY the iframe src value (NOT the whole iframe tag)
   */
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.8494142990876!2d121.00702167457312!3d14.608799126876923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b61f9c7092b7%3A0xe8732f4540ca5268!2sOrtho-Dental%20Clinic%20Dr.Mary%20Grace%20R%20Diwa!5e1!3m2!1sen!2sph!4v1766549299500!5m2!1sen!2sph",

  /**
   * Demo images (online/CDN)
   * NOTE: add the remotePatterns in next.config.ts (I included it below).
   */
  images: {
    hero: "/hero.avif",
    dentist: "/dentist.jpg",
    room: "/hero.avif",
    hygiene: "/hygiene.jpg",
  },

  // Safe “ready to publish” hours (until you confirm exact schedule)
  hours: [
    { day: "Monday – Saturday", time: "By appointment" },
    { day: "Sunday", time: "Closed" },
  ],

  services: [
    {
      title: "Cleaning",
      desc: "Professional cleaning to remove plaque and keep your teeth and gums healthy.",
    },
    {
      title: "Pasta (Dental Filling)",
      desc: "Cavity treatment with durable, natural-looking fillings for protection and comfort.",
    },
    {
      title: "Bunot (Tooth Extraction)",
      desc: "Safe extraction with proper anesthesia, gentle handling, and clear aftercare instructions.",
    },
    {
      title: "Braces / Orthodontics",
      desc: "Orthodontic assessment and braces options to improve alignment, bite, and smile confidence.",
    },
  ],

  pillars: [
    {
      title: "Gentle, patient-first care",
      desc: "We take time to explain your options before any procedure, especially for anxious patients.",
    },
    {
      title: "Clean & safe clinic",
      desc: "Sterilized tools and a hygienic environment to keep every visit safe and comfortable.",
    },
    {
      title: "Easy booking",
      desc: "Call or text anytime, or send an inquiry online — we’ll confirm your schedule promptly.",
    },
  ],

  about: {
    title: "Welcome to our clinic",
    body: [
      "At Dr. Mary Grace Diwa Ortho-Dental Clinic, we focus on gentle care and clear communication so patients feel comfortable and confident during their visit.",
      "Whether you need a cleaning, a filling (pasta), an extraction (bunot), or braces, we guide you through the process and explain what to expect before we begin.",
      "For appointment inquiries, please call or text us. You may also send an online inquiry and we will respond to confirm your schedule.",
    ],
  },

  reviews: [
    {
      name: "Patient Review",
      text: "Very gentle and accommodating. Clear explanation and a comfortable experience.",
    },
    {
      name: "Patient Review",
      text: "Clean clinic and friendly staff. I felt safe and well taken care of.",
    },
    {
      name: "Patient Review",
      text: "Booking was easy — I texted and got scheduled quickly.",
    },
  ],
} as const;
