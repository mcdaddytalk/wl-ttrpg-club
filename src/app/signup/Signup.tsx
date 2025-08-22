"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupOAuthButtons } from "@/components/SignupOAuthButtons";
import { signInWithProvider } from "@/server/authActions";
import { toast } from "sonner";
import { Provider } from "@/lib/types/custom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import logger from '@/utils/logger';
import { BirthdayPicker } from "@/components/BirthdayPicker";

// Regular expression for password and phone validation
const passwordValidation = new RegExp(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
);

const phoneValidation = new RegExp(/^\+?[1-9]\d{1,14}$/);

// Validation Schema
const signupSchema = z.object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    email: z.string().email("Enter a valid email, or for no contact 'no-contact@email.com'"),
    phone: z.string()
      .regex(phoneValidation, "Enter a valid phone number")
      .optional()
      .or(z.literal('')),
    preferredContact: z.enum(["email", "phone"], { message: "Select a preferred method of contact" }),
    consent: z.boolean().refine((value) => value === true, "You must agree to be contacted."),  
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(passwordValidation, "Password must contain at least one capital letter, one number, and one special character"),
    confirmPassword: z.string(),
    birthday: z
    .string()
    .min(1, "Birthday is required")
    .refine(
      (date) => !isNaN(new Date(date).getTime()) && new Date(date) <= new Date(),
      {
        message: "Please provide a valid date in the past.",
      }
    )
}).superRefine((data, ctx) => {
    // Convert the email to lowercase
    data.email = data.email.toLowerCase();
  
    // Ensure confirmPassword matches password
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ['confirmPassword'],
        });
    }
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const inviteId = searchParams.get("invite");
  const inviteEmail = searchParams.get("email");

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      birthday: "",
      email: inviteEmail || "",
      phone: "",
      consent: false,
      preferredContact: "email",
      password: "",
      confirmPassword: "",
    },
  });

  // Auto-fill email if from an invite
  useEffect(() => {
    if (inviteEmail) {
      form.setValue("email", inviteEmail);
    }
  }, [inviteEmail, form]);

  useEffect(() => {
    const phone = form.getValues('phone');
    if (!form.getValues('preferredContact')) {
      form.setValue('preferredContact', phone ? 'phone' : 'email', { shouldValidate: true });
    }
  }, [form]);

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    try {
        const { email, phone, preferredContact, consent, password, firstName, surname, birthday } = data;
        
        const signUpResponse = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                phone,
                preferredContact,
                consent,
                password,
                firstName,
                surname,
                birthday,
                inviteId
            })
        });

        const signUpData = await signUpResponse.json();

        if (!signUpResponse.ok) {
            if (signUpResponse.status === 409) {
                toast.error('Email Already In Use.  Please use a different email address.')
                form.setError("email", { message: "An account with this email already exists." });
            } else {
                const { error } = signUpData;
                toast.error(error.message);
                logger.error(error.message);
            }
        } else {
            if (inviteId) {
              localStorage.setItem("pendingInvite", inviteId);
              router.push(`/verify-email?email=${email}&redirect=/accept-invite?invite=${inviteId}`);
            } else {
              router.push(`/verify-email?email=${email}`);
            }
        }
    } catch (error) {
      logger.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: Provider) => {
    setLoading(true);
    try {
      await signInWithProvider(provider);      
    } catch (error) {
      logger.error(error);
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {inviteId ? "Complete Your Signup to Accept Invite" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleSignup)} 
              className="space-y-4"
              autoComplete="on"
              name="signupForm"
            >
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input
                          id="email"
                          inputMode="email"
                          autoCapitalize="off"
                          autoCorrect="off"
                          autoComplete="username" 
                          type="email" 
                          placeholder="johndoe@example.com" 
                          {...field} 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (optional)</FormLabel>
                      <FormControl>
                        <Input
                          id="phone" 
                          type="tel"
                          inputMode="tel" 
                          placeholder="+1234567890" 
                          autoComplete="tel" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="preferredContact"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Method of Contact</FormLabel>
                      <FormControl>
                        <Select 
                          {...field}
                          onValueChange={(fieldValue) => field.onChange(fieldValue)}
                          defaultValue={field.value || ""}
                        >
                          <SelectTrigger 
                            className="w-full"
                            aria-label="Preferred contact"
                          >
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                          
                          >                            
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="consent"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div
                        className="flex items-center space-x-2"
                      >
                        <Checkbox 
                          checked={field.value}
                          id="consent" 
                          onCheckedChange={field.onChange}
                        />
                        <FormLabel 
                          htmlFor="consent" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to receive communications via my preferred contact method.
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input
                                id="given-name"
                                autoCapitalize="words"
                                placeholder="Given Name" 
                                autoComplete="given-name" 
                                {...field}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    name="surname"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input 
                                id="family-name"
                                autoCapitalize="words"
                                placeholder="Surname" 
                                autoComplete="family-name" 
                                {...field} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  name="birthday"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <BirthdayPicker
                        value={field.value || null}            // "YYYY-MM-DD" | null
                        onChange={(v) => field.onChange(v ?? "")}
                        startMonth={new Date(1900, 0)}              // Jan 1900
                        endMonth={new Date(new Date().getFullYear(), 11)} // Dec current year
                        emptyDefaultYear={new Date().getFullYear()}                    // optional: where the calendar opens initially
                        className="w-full"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />              
                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input
                            id="new-password"
                            type="password" 
                            autoComplete="new-password"
                            placeholder="*********" 
                            {...field} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                        <Input 
                            id="new-password-confirm"
                            type="password" 
                            autoComplete="new-password"
                            placeholder="*********" 
                            {...field} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              <Button type="submit" className="w-full bg-green-500 text-white rounded hover:bg-green-600" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">Or</div>
          <SignupOAuthButtons handleOAuthSignup={handleOAuthSignup} />
        </CardContent>
      </Card>
    </div>
  );
}
