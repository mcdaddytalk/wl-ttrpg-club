"use client"

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPage() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
         <section className="flex flex-col bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-200 opacity-50 mt-4">
          <div>
            <h1 className="text-2xl font-bold mb-4">Privacy Statement</h1>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>Your privacy is important to us. This Privacy Statement explains how we collect, use, and protect your personal information when you use our website.</p>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p>We may collect the following information:</p>
            <ul>
              <li>Personal Information:  We collection your name, email address, phone number, and other necessary information when you register with our website.</li>
              <li>Usage Information: We collect information about how you use our website, such as the pages you visit, the features you use, and the actions you take.</li>
            </ul>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you promotional emails and updates</li>
            </ul>
            <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your information from unauthorized access, use, or disclosure.</p>
            <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
            <p>Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third-party sites.</p>
            <h2 className="text-xl font-semibold mb-2">6. Changes to this Privacy Statement</h2>
            <p>We may update this Privacy Statement from time to time. Any changes will be posted on this page.</p>
            <h2 className="text-xl font-semibold mb-2">7. Sharing Your Information</h2>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>
            <h2 className="text-xl font-semibold mb-2">8. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You can also withdraw your consent at any time.</p>
            <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Statement, please contact us <Link className="underline" href="/contact-us">here</Link>.</p>
          </div>
        </section>
      </motion.div>
    );
  }