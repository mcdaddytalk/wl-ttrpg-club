'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  category: z.enum(['support', 'feedback', 'question', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().max(0).optional() // Must be empty
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

export function ContactUsForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const res = await fetch('/api/messaging/contact-us', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success('Message sent!');
      form.reset();
    } else {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register('name')} />
        <p className="text-sm text-red-600">{form.formState.errors.name?.message}</p>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register('email')} />
        <p className="text-sm text-red-600">{form.formState.errors.email?.message}</p>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select id="category" {...form.register('category')} className="w-full border rounded p-2">
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
            <option value="question">General Question</option>
            <option value="other">Other</option>
        </select>
        <p className="text-sm text-red-600">{form.formState.errors.category?.message}</p>
        </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={6} {...form.register('message')} />
        <p className="text-sm text-red-600">{form.formState.errors.message?.message}</p>
      </div>
      <input type="text" className="hidden" {...form.register('website')} />
      <Button type="submit">Send Message</Button>
    </form>
  );
}
