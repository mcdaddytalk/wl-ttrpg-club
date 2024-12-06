"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { motion } from 'framer-motion'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from '@/components/ui/select'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import RulesList from "../RulesList/page"
import { formSchema } from "./schema"
// import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from 'next/navigation';

type FormValues = z.infer<typeof formSchema>;

const steps = [
    { 
        id: 'Step 1',
        name: 'Personal Information',
        fields: [
            'firstName', 'surname', 'email',
            'phoneNumber', 'birthday', 'isMinor',
            'parentFirstName', 'parentSurname',
            'parentPhone', 'parentEmail'
        ]
    },
    { 
        id: 'Step 2', 
        name: 'Experience and Interest',
        fields: ['experienceLevel', 'gamemasterInterest', 'preferredSystem', 'availability']
    },
    { 
        id: 'Step 3', 
        name: 'Rules and Responsibilities',
        fields: ['agreeToRules']
    },
    {
        id: 'Step 4',
        name: 'Account Security',
        fields: ['password', 'confirmPassword']
    },
    {
        id: 'Step 5',
        name: 'Sign Up'
    }
];

export const SignupForm = () => {
    const [previousStep, setPreviousStep] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const delta = currentStep - previousStep
    const [minor, setMinor] = useState(false);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            surname: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthday: new Date().toISOString().split('T')[0],
            phoneNumber: "+1 000-000-0000",
            isMinor: false,
            parentFirstName: '',
            parentSurname: '',
            parentPhone: '',
            parentEmail: '',
            experienceLevel: 'new',
            gamemasterInterest: 'no',
            preferredSystem: 'dd5e',
            availability: '',
            agreeToRules: false
        }
    });

    const processForm: SubmitHandler<FormValues> = async (data) => {
        console.log('Data received')
        console.log(data)
        console.log('Sending to server...')

        const signUpResponse = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const signUpData = await signUpResponse.json();

        if (!signUpResponse.ok) {
            if (signUpResponse.status === 409) {
                toast.error('Email Already In Use.  Please use a different email address.')
            } else {
                const { error } = signUpData;
                throw new Error(error.message);
            }
        } else {
            router.push('/login');
        }
        
        // form.reset()
    }

    type FieldName = keyof FormValues;

    const next = async () => {
        const fields = steps[currentStep].fields;
        const output = await form.trigger(fields as FieldName[], { shouldFocus: true })

        if (!output) return;

        if ( currentStep < steps.length - 1) {
            setPreviousStep(currentStep)
            setCurrentStep((step) => step + 1)
        }
    }

    const prev = () => {
        if ( currentStep > 0) {
            setPreviousStep(currentStep)
            setCurrentStep((step) => step - 1)
        }
    }

    return (
        <section className='inset-0 flex flex-col justify-between'>
            {/* steps */}
            <nav aria-label='Progress'>
                <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                {steps.map((step, index) => (
                    <li key={step.name} className='md:flex-1'>
                    {currentStep > index ? (
                        <div className='group flex w-full flex-col border-l-4 border-sky-400 dark:border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                        <span className='text-sm font-medium text-sky-400 dark:text-sky-600 transition-colors '>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium text-white'>{step.name}</span>
                        </div>
                    ) : currentStep === index ? (
                        <div
                        className='flex w-full flex-col border-l-4 border-sky-400 dark:border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                        aria-current='step'
                        >
                        <span className='text-sm font-medium text-sky-400 dark:text-sky-600'>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium text-white'>{step.name}</span>
                        </div>
                    ) : (
                        <div className='group flex w-full flex-col border-l-4 border-slate-200 dark:border-slate-300 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                        <span className='text-sm font-medium text-slate-300 dark:text-slate-400 transition-colors'>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium text-slate-200 dark:text-slate-300'>{step.name}</span>
                        </div>
                    )}
                    </li>
                ))}
                </ol>
            </nav>
            <Form {...form} >
                <form className="mt-10 py-10" onSubmit={form.handleSubmit(processForm)}>
                {currentStep === 0 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <h2 className='text-base font-semibold leading-7 text-slate-800 dark:text-slate-400'>
                            {steps[currentStep].id}: {steps[currentStep].name}
                        </h2>
                        <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input autoComplete="cc-given-name" placeholder="New" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                    <Input type="text" autoComplete="cc-family-name" placeholder="Contact" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" autoComplete="email" placeholder="no-contact@email.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your email.  If you prefer to not be contacted by email, please use <i>no-contact@email.com</i>.  You <strong>MUST</strong> provide either email or phone to be contacted
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" autoComplete="tel" placeholder="+1 (000) 000-0000" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your phone number.  If you prefer to not be contacted by phone, please use <i>+1 000-000-0000</i>.  You <strong>MUST</strong> provide either email or phone to be contacted
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                        
                        <FormField
                            control={form.control}
                            name="isMinor"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Are You A Minor? *Parent Information will be required </FormLabel>
                                    <Checkbox
                                        checked={minor || field.value}
                                        onCheckedChange={(value) => {
                                            setMinor(!!value); // Update local state
                                            field.onChange(value); // Update form's internal state
                                        }}
                                    />
                                </FormItem>
                            )}
                        />

                        {minor && (
                            <>
                            <div>
                                <h2 className='text-base font-semibold leading-7 text-slate-600 dark:text-slate-400'>
                                    Parent Information
                                </h2>
                            </div>
                            <FormField
                                control={form.control}
                                name="parentFirstName"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="cc-given-name" placeholder="New" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                    
                            />
                            <FormField
                                control={form.control}
                                name="parentSurname"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                        <Input type="text" autoComplete="cc-family-name" placeholder="Contact" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} 
                            />
        
                            <FormField
                                control={form.control}
                                name="parentEmail"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Parent Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" autoComplete="email" placeholder="me@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} 
                            />
        
                            <FormField
                                control={form.control}
                                name="parentPhone"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Parent Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" autoComplete="tel" placeholder="+1 (000) 000-0000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} 
                            />
                            </>
                        )}
                    </motion.div>
                )}
            
                {currentStep === 1 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
        
                        <h2 className='text-base font-semibold leading-7 text-slate-800 dark:text-slate-400'>
                            {steps[currentStep].id}: {steps[currentStep].name}
                        </h2>

                        <FormField
                            control={form.control}
                            name="experienceLevel"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                <FormLabel>Experience Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue {...field} placeholder="Experience Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New Player</SelectItem>
                                        <SelectItem value="novice">Novice Player</SelectItem>
                                        <SelectItem value="seasoned">Seasoned Player</SelectItem>
                                        <SelectItem value="player-gm">Player and Gamemaster</SelectItem>
                                        <SelectItem value="forever-gm">Forever Gamemaster</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gamemasterInterest"
                            render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Gamemaster Interest</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue {...field} placeholder="Interested in Gamemastering?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                    <SelectItem value="maybe">Maybe</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        {/* Preferred System Field */}
                        <FormField
                            control={form.control}
                            name="preferredSystem"
                            render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Preferred System</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue {...field} placeholder="Preferred System" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pf2e">Pathfinder 2e</SelectItem>
                                    <SelectItem value="dd5e">D&D 5e</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        {/* Availability Field */}
                        <FormField
                            control={form.control}
                            name="availability"
                            render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Availability</FormLabel>
                                <Input {...field} placeholder="Your availability (e.g., Every Weekend, Sundays, Saturdays?)" />
                                <FormMessage />
                            </FormItem>
                            )}
                        />                        
                    </motion.div>
                )}
            
                {currentStep === 2 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
        
                        <h2 className='text-base font-semibold leading-7 text-slate-800 dark:text-slate-400'>
                            {steps[currentStep].id}: {steps[currentStep].name}
                        </h2>
                        <div className="max-w-3xl mx-auto p-6">
                            <RulesList />
                            <FormField
                                control={form.control}
                                name="agreeToRules"
                                render={({ field }) => (
                                    <FormItem className="mt-6 space-y-2">
                                        <FormLabel>Do you agree to abide by the rules and responsibilities?</FormLabel>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>                    
                                )}
                            />
                            {form.formState.errors.agreeToRules && <span>{form.formState.errors.agreeToRules.message}</span>}
                        </div>
                    </motion.div>
                )}

                {currentStep === 3 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <h2 className='text-base font-semibold leading-7 text-slate-800 dark:text-slate-400'>
                            {steps[currentStep].id}: {steps[currentStep].name}
                        </h2>
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (                                
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirm Password" {...field}  />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                )}

                {currentStep === 4 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <h2 className='text-base font-semibold leading-7 text-slate-800 dark:text-slate-400'>
                            {steps[currentStep].id}: {steps[currentStep].name}
                        </h2>
                        <h3>Review your information:</h3>
                        <Separator />
                        <p><strong>First Name:</strong> {form.getValues().firstName}</p>
                        <p><strong>Surname:</strong> {form.getValues().surname}</p>
                        <p><strong>Email:</strong> {form.getValues().email}</p>
                        <p><strong>Phone Number:</strong> {form.getValues().phoneNumber}</p>
                        <p><strong>Birthday:</strong> {form.getValues().birthday}</p>
                        <p><strong>Experience Level:</strong> {form.getValues().experienceLevel}</p>
                        <p><strong>Game Master Interest:</strong> {form.getValues().gamemasterInterest}</p>
                        <p><strong>Preferred System:</strong> {form.getValues().preferredSystem}</p>
                        <p><strong>Availability:</strong> {form.getValues().availability}</p>
                        
                        <Button type='submit' className='w-full' disabled={!form.formState.isValid}>Sign Up!</Button>
                    </motion.div>
                )}
                </form>
            </Form>
            {/* Navigation */}
            <div className='mt-5 pt-5'>
                <div className='flex justify-between'>
                    <Button
                        type='button'
                        onClick={prev}
                        disabled={currentStep === 0}
                        className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='h-6 w-6'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15.75 19.5L8.25 12l7.5-7.5'
                            />
                        </svg>
                    </Button>
                    <Button
                        type='button'
                        onClick={next}
                        disabled={currentStep === steps.length - 1}
                        className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='h-6 w-6'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M8.25 4.5l7.5 7.5-7.5 7.5'
                            />
                        </svg>
                    </Button>
                </div>
            </div>
        </section>
      );
};