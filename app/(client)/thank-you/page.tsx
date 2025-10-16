'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Handshake } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="relative min-h-screen bg-white flex justify-center items-center px-4 overflow-hidden">

      {/* Floating Background Orbs */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-green-100/20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      />

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 md:p-16 flex flex-col items-center text-center max-w-xl"
      >
        {/* Handshake Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 12 }}
          className="mb-6"
        >
          <Handshake className="text-green-500 w-28 h-28 drop-shadow-lg" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Thank You for Your Submission!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg md:text-xl mb-8"
        >
          Your franchise enquiry has been successfully received.  
          <br />
          Our Motozoop team will contact you shortly to discuss the next steps.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-shop_dark_green text-white font-medium rounded-xl shadow-lg hover:bg-green-600 transition-all"
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-gray-500 text-sm space-y-1"
        >
          <p>📞 +91 98765 43210</p>
          <p>📧 support@motozoop.com</p>
          <p>📍 Coimbatore, Tamil Nadu, India</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
