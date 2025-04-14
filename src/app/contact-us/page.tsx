
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactUsForm } from './_components/ContactUsForm';

export default function ContactUsPage() {
  return (
    <section className="py-12 px-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Use this form to ask questions, report issues, or share feedback.
          </p>
          <ContactUsForm />
        </CardContent>
      </Card>
    </section>
  );
}
