'use client'

import { useEffect, useRef } from 'react'
import { Progress } from '@/components/ui/progress'
import { ProfileData } from '@/lib/types/custom'
import confetti from 'canvas-confetti'

interface ProfileCompletionProps {
  profile: ProfileData
}

const fieldsToCheck: (keyof ProfileData)[] = [
  'given_name', 
  'surname', 
  'phone', 
  'birthday', 
  'bio', 
  'avatar', 
  'experience_level'
]

const labelForField = (field: keyof ProfileData): string => {
  const labelMap: Partial<Record<keyof ProfileData, string>> = {
    given_name: 'Given Name',
    surname: 'Surname',
    phone: 'Phone',
    birthday: 'Birthday',
    bio: 'Bio',
    avatar: 'Avatar',
    experience_level: 'Experience Level',
  }

  return labelMap[field] ?? field
}

const STORAGE_KEY = 'profileCompletionCelebrated'

export function ProfileCompletion({ profile }: ProfileCompletionProps) {
    
  const filledFields = fieldsToCheck.filter((field) => {
    const value = profile[field]
    return value !== null && value !== undefined && value !== ''
  })

  const progressPercent = Math.round((filledFields.length / fieldsToCheck.length) * 100)

  const hasCelebratedRef = useRef(false)
  const prevPercentRef = useRef(progressPercent)

  // Initialize from localStorage once
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        hasCelebratedRef.current = window.localStorage.getItem(STORAGE_KEY) === 'true'
      }
    } catch {
      // ignore storage errors (e.g., Safari private mode)
    }
  }, [])

  useEffect(() => {
    const prev = prevPercentRef.current
    const reachedNow = progressPercent === 100
    const wasBelow = prev < 100

    // Respect reduced motion preferences
    const prefersReduced = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reachedNow && wasBelow && !hasCelebratedRef.current && !prefersReduced) {
      hasCelebratedRef.current = true
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, 'true')
        }
      } catch {
        // ignore storage errors
      }

      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        scalar: 1.0,
      })
    }

    // update previous after handling logic
    prevPercentRef.current = progressPercent
  }, [progressPercent])

  const missingFields = fieldsToCheck.filter((field) => !filledFields.includes(field))

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">Profile Completion</span>
        <span className="text-sm font-semibold">{progressPercent}%</span>
      </div>
      <Progress 
        value={progressPercent} 
        className="h-2 transition-all duration-500" 
        aria-label="Profile Completion Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
      />
      {progressPercent < 100 && (
        <ul className="mt-2 text-xs text-muted-foreground list-disc pl-5 space-y-1">
          {missingFields.map((field) => (
            <li key={field}>{labelForField(field)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
