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

export function ProfileCompletion({ profile }: ProfileCompletionProps) {
    
  const filledFields = fieldsToCheck.filter((field) => {
    const value = profile[field]
    return value !== null && value !== undefined && value !== ''
  })

  const progressPercent = Math.round((filledFields.length / fieldsToCheck.length) * 100)

  const hasCelebratedRef = useRef(false)

  useEffect(() => {
    if (progressPercent === 100 && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
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
