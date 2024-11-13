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
            'phoneNumber', 'isMinor',
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
        name: 'Complete'
    }
];

export const ContactForm = () => {
    const [previousStep, setPreviousStep] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const delta = currentStep - previousStep
    const [minor, setMinor] = useState(false);
    const [isComplete, setComplete] = useState(false);
    const router = useRouter();
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            surname: '',
            email: '',
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
    })
    
    const processForm: SubmitHandler<FormValues> = async (data) => {
        console.log('Data received')
        //console.log(data)
        console.log('Sending to server...')

        const contactResponse = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const contactData = await contactResponse.json();

        if (!contactResponse.ok) {
            if (contactResponse.status === 409) {
                setComplete(false)
                toast.error('Email Already In Use.  Please use a different email address.')
            } else {
                const { error } = contactData
                throw new Error(error.message);
            }
        } else {
            await fetch('/api/email/new-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // await emailResponse.json();
            toast.success("Your contact information has been saved.")
            setComplete(true)
        }                    
        // form.reset()
    }

    type FieldName = keyof FormValues;

    const next = async () => {
        const fields = steps[currentStep].fields;
        const output = await form.trigger(fields as FieldName[], { shouldFocus: true })

        if (!output) return;

        if ( currentStep < steps.length - 1) {
            if (currentStep === steps.length - 2) {
                // last step
                //console.log('last step')
                //console.log('Form Errors:  ', form.formState.errors)
                //console.log('Form Values:  ', form.getValues())
                await form.handleSubmit(processForm)()
            }
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

    const complete = () => {        
        router.push('/');
    }

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData({
    //       ...formData,
    //       [name]: type === 'checkbox' ? checked : value,
    //     });
    // };

    return (
        <section className='inset-0 flex flex-col justify-between p-18'>
            {/* steps */}
            <nav aria-label='Progress'>
                <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                {steps.map((step, index) => (
                    <li key={step.name} className='md:flex-1'>
                    {currentStep > index ? (
                        <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                        <span className='text-sm font-medium text-sky-600 transition-colors '>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
                        </div>
                    ) : currentStep === index ? (
                        <div
                        className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                        aria-current='step'
                        >
                        <span className='text-sm font-medium text-sky-600'>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
                        </div>
                    ) : (
                        <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                        <span className='text-sm font-medium text-gray-500 transition-colors'>
                            {step.id}
                        </span>
                        <span className='text-sm font-medium'>{step.name}</span>
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
                        <h2 className='text-base font-semibold leading-7 text-gray-800 dark:text-gray-400'>
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
                                <h2 className='text-base font-semibold leading-7 text-gray-600 dark:text-gray-400'>
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
        
                        <h2 className='text-base font-semibold leading-7 text-gray-800 dark:text-gray-400'>
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
        
                        <h2 className='text-base font-semibold leading-7 text-gray-800 dark:text-gray-400'>
                            {steps[currentStep].id}: {steps[currentStep].name}
                        </h2>
                        <div className="max-w-3xl mx-auto p-6">
                            <p className="mb-4">
                                By completing this form for the TTRPG Group, you agree to abide by the following rules and responsibilities to ensure a safe, respectful, and enjoyable experience for everyone:
                            </p>

                            <h3 className="text-xl font-semibold mt-6 mb-2">General Rules:</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Respect All Participants:</strong> Treat your fellow players and the Game Master (GM) with respect and courtesy, both in and out of character.</li>
                                <li><strong>Zero Tolerance for Discrimination or Harassment:</strong> Discrimination or harassment of any kind will not be tolerated.</li>
                                <li><strong>Consent and Safety:</strong> Respect boundaries and content limits agreed upon by the group.</li>
                                <li><strong>Stay in Character:</strong> Keep your focus on the game, and minimize out-of-character distractions unless necessary.</li>
                                <li><strong>Avoid Metagaming:</strong> Use only the knowledge your character would reasonably have. Don’t let out-of-game information influence your decisions.</li>
                                <li><strong>Share the Spotlight:</strong> Everyone deserves their time to shine. Support your fellow players and avoid monopolizing the game.</li>
                                <li><strong>Follow the GM&apos;s Decisions:</strong> The GM has the final say on all rules and disputes during gameplay. Save any disagreements or questions for after the session.</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-6 mb-2">Player Responsibilities:</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Be Prepared:</strong> Bring your character sheet, dice, and other materials. Familiarize yourself with your character’s abilities and the basic rules of they system you are playing in.</li>
                                <li><strong>Arrive on Time:</strong> Respect the group’s time by arriving promptly. If you expect to be late or absent, notify the GM as soon as possible.</li>
                                <li><strong>Stay Focused and Engaged:</strong> Avoid using your phone or engaging in unrelated side conversations during the game.</li>
                                <li><strong>Work as a Team:</strong> D&D and other RPGs are collaborative games. Cooperate with the party and contribute to the group’s goals, even if your character has personal motivations.</li>
                                <li><strong>Respect the Game World and NPCs:</strong> The DM works hard to create an immersive world. Engage with the story respectfully, and treat NPCs as part of that world.</li>
                                <li><strong>Resolve Conflicts Maturely:</strong> Address any disagreements or issues calmly and respectfully, preferably outside of game time.</li>
                            </ul>
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
                        <h2 className='text-base font-semibold leading-7 text-gray-800 dark:text-gray-400'>
                            {steps[currentStep].id}: {steps[currentStep].name}
                        </h2>
                        <p>Thank you for signing up! Review your information:</p>
                        <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
                        <Button type="reset" disabled={!isComplete} onClick={complete}>Complete</Button>
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
                        disabled={isComplete || currentStep === 0}
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
                        disabled={isComplete || currentStep === steps.length - 1}
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