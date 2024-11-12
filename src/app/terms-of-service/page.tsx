// app/(public)/terms/page.tsx

import Link from "next/link"

export default function TermsPage() {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>Welcome to <strong>Western Loudoun Table Top Roleplaying Game Club</strong>. By using our website, you agree to these Terms of Service.</p>
          <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
          <p>You must be at least 14 years old to use our website. If you are under the age of 18 years old, parental or guardian consent is required to use our website. By using our website, you represent that you are of legal age in your jurisdiction.</p>
          <h2 className="text-xl font-semibold mb-2">3. Use of the Website</h2>
          <p>You may use our website for lawful purposes only. You may not use our website for any unlawful or unauthorized purpose.</p>
          <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, images, and software, is protected by intellectual property laws. You may not reproduce, distribute, or modify any content without our prior written consent.</p>
          <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p>We will not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of our website.</p>
          <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
          <p>This Terms of Service is governed by the laws of the jurisdiction in which you are located. Any disputes will be resolved in that jurisdiction.</p>
          <h2 className="text-xl font-semibold mb-2">7. Modifications</h2>
          <p>We reserve the right to modify these Terms of Service at any time. By continuing to use our website after any modifications, you agree to be bound by the modified Terms of Service.</p>
          <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
          <p>If you have any questions or concerns about these Terms of Service, please contact us at <Link href="/contact-us">contact-us</Link>.</p>
        </section>
      </main>
    );
  }
  