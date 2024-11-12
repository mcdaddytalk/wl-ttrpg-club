"use client"

import { useEffect } from 'react'
import useToastStore from '@/store/toastStore'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';

const ToastHandler = () => {
    const { showToast, type, toastId, message, resetToast } = useToastStore()

    const searchParams = useSearchParams();
    const isToastOTP = searchParams.get('email-otp');
    
    useEffect(() => {
        // if (showToast && message) toast.success(message)
        if (isToastOTP == 'true') {
            toast.success('OTP sent to your email', {
                id: 'email-otp',
                duration: 5000,
                closeButton: true,
                invert: true,
                onAutoClose: () => resetToast(),
                onDismiss: () => resetToast() // close the toast on dismission
            })
        } else if (showToast && message) {
            if (type === 'error') { 
                toast.error(message, {
                    id: toastId ? toastId : uuidv4(),
                    duration: 5000,
                    closeButton: true,
                    invert: true,
                    onAutoClose: () => resetToast(),
                    onDismiss: () => resetToast() // close the toast on dismission
                })
             }
            else if (type === 'success') { 
                toast.success(message, {
                    id: toastId ? toastId : uuidv4(),
                    duration: 5000,
                    closeButton: true,
                    invert: true,
                    onAutoClose: () => resetToast(),
                    onDismiss: () => resetToast() // close the toast on dismission
                })
            }
            else { 
                toast(message, {
                    id: toastId ? toastId : uuidv4(),
                    duration: 5000,
                    closeButton: true,
                    invert: true,
                    onAutoClose: () => resetToast(),
                    onDismiss: () => resetToast() // close the toast on dismission
                })
            }
        }
    }, [showToast, message, resetToast, toastId, type, isToastOTP])
    return null
}

export default ToastHandler