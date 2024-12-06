"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

// Regular expression for password validation
const passwordValidation = new RegExp(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
);
// Validation Schema
const signupSchema = z.object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    email: z.string().email("Enter a valid email, or for no contact 'no-contact@email.com'"),
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

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      birthday: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    try {
        const { email, password, firstName, surname, birthday } = data;
        
        const signUpResponse = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                firstName,
                surname,
                birthday
            })
        });

        const signUpData = await signUpResponse.json();

        if (!signUpResponse.ok) {
            if (signUpResponse.status === 409) {
                toast.error('Email Already In Use.  Please use a different email address.')
                form.setError("email", { message: "An account with this email already exists." });
                setLoading(false);
                return;
            } else {
                const { error } = signUpData;
                toast.error(error.message);
                console.error(error.message);
                setLoading(false);
                return;
            }
        } else {
            router.push('/verify-email?email=' + email);
        }

    //   const { error } = await supabase.auth.signUp({
    //     email,
    //     password,
    //     options: {
    //       data: {
    //         firstName,
    //         surname,
    //         birthday,
    //         isMinor, // Pass calculated field
    //       },
    //     },
    //   });

    } catch (error) {
      console.error(error);
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
      console.error(error);
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-6">
      <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input 
                            autoComplete="email" 
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
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="First Name" 
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
                        <FormControl>
                            <Input 
                                type="date"
                                autoComplete="bday" 
                                {...field}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </FormControl>
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
                            type="password" 
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
                            type="password" 
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
