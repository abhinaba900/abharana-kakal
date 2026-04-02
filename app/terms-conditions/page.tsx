'use client';

import { motion } from 'framer-motion';

export default function TermsConditionsPage() {
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
            Terms & Conditions
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
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Acceptance of Terms</h2>
            <p>
              By accessing the website at abharanakakal.com or booking our services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Service Bookings</h2>
            <p>
              All bookings for yoga retreats and sound healing sessions are subject to availability and our confirmation. We reserve the right to refuse service to anyone at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Responsibility and Health</h2>
            <p>
              Participants are responsible for their own physical and mental wellbeing during our sessions. You must inform us of any pre-existing medical conditions or injuries that may affect your practice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Intellectual Property</h2>
            <p>
              All content on this website, including images, text, and sound recordings, is the industrial and intellectual property of Abharana Kakal. Reproduction or distribution without prior written consent is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts of Bangalore.
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
