'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fffdf8] pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto prose prose-neutral prose-[#a55a3d]">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-light text-[#bc6746] tracking-tight">
            Privacy Policy
          </h1>
        </motion.div>

        {/* CONTENT */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#a55a3d]/80 font-light leading-relaxed space-y-8"
        >
          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Introduction</h2>
            <p>
              Your privacy is fundamental to the trust you place in Abharana Kakal. This policy outlines how we collect, use, and protect your information when you engage with our yoga retreats, sound healing sessions, and digital platforms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you book a session, sign up for our journal, or contact us through the website. This may include your name, email address, phone number, and physical health considerations relevant to your practice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">How We Use Your Data</h2>
            <p>
              The information collected is used solely to facilitate your experience with Abharana Kakal. This includes managing bookings, providing personalized sound healing consultations, and sending you occasional reflections and updates via our journal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Third-Party Services</h2>
            <p>
              We do not sell or trade your personal information. We may use trusted third-party services for payments (e.g., Stripe) and data management (e.g., Supabase), which adhere to strict security standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time. Simply contact us at hello@abharanakakal.com to make a request.
            </p>
          </section>

          <section>
            <p className="pt-12 text-[11px] tracking-widest uppercase opacity-40">
              Last updated: April 2026
            </p>
          </section>
        </motion.div>
      </div>
    </main>
  );
}
