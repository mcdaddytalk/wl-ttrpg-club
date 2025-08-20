import * as React from 'react';
import { Html, Head, Body, Container, Preview, Tailwind } from '@react-email/components';

type EmailLayoutProps = {
  preview: string;     // preheader text
  children: React.ReactNode;
};

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      {/* Tailwind-in-email is limited, but fine for basic utility classes */}
      <Tailwind>
        <Body className="bg-slate-900 m-0 p-6">
          <Container className="max-w-[560px] mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}