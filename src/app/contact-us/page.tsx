"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import React from "react"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ContactFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email.",
    }),
    message: z.string().min(10, {
        message: "Message must be at least 10 characters.",
    }),
});

type ContactFormValues = z.infer<typeof ContactFormSchema>;

export default function ContactUs(): React.ReactElement {
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const onSubmit: SubmitHandler<ContactFormValues> = async (values: ContactFormValues): Promise<void> => {
        try {
            // Send the form data to your backend API
            const response = await fetch("/api/email/contact-us", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const { error } = await response.json();
            if (response.ok) {
                toast.success("Message sent successfully!");
                form.reset(); // Reset form on success
            } else {
                toast.error(error);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message. Please try again.");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center min-h-screen p-8"
        >
            <Card className="w-full max-w-md rounded-md shadow-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="your email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="Your Message" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
        
    )
}