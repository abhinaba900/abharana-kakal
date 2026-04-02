'use client';

import { motion } from 'framer-motion';

export default function RefundPolicyPage() {
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
            Refund & Cancellation
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
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Refund Policy Overview</h2>
            <p>
              We believe in conscious communication and fair exchanges. Our Refund & Cancellation policy is designed to be fair to both our participants and our commitment to organizing sacred gatherings in unique locations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Yoga Retreats</h2>
            <p>
              For yoga retreats, cancellations made 30 days or more in advance will receive a full refund, minus a small processing fee. Cancellations between 15-30 days will receive a 50% refund. Cancellations within 14 days of the start date are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Sound Healing Sessions</h2>
            <p>
              Cancellations for private or group sound healing sessions must be made at least 48 hours in advance for a full refund. Cancellations within 48 hours will be subject to a 50% cancellation fee.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">No-Show Policy</h2>
            <p>
              Failure to attend a retreat or session without prior notification will result in forfeiture of the full booking amount. We encourage you to reach out as early as possible if your circumstances change.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-[#bc6746] mb-4">Rescheduling</h2>
            <p>
              You may reschedule a session once, provided the request is made at least 72 hours in advance of the original booking time.
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
