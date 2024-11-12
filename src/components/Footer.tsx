import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        <Link href="/privacy" className="mr-4">Privacy Statement</Link>
        <Link href="/terms-of-service" className="mr-4">Terms of Service</Link>
      </div>
    </footer>
  )
}
