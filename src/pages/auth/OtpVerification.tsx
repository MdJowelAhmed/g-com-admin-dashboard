import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import AuthCard from '../../components/auth/AuthCard'
import AuthIllustration from '../../components/auth/AuthIllustration'
import PrimaryButton from '../../components/auth/PrimaryButton'
import BackToLoginLink from '../../components/auth/BackToLoginLink'

type LocationState = { email?: string } | null

const OTP_LENGTH = 6

function isDigit(char: string) {
  return /^[0-9]$/.test(char)
}

export default function OtpVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  const email = state?.email ?? ''

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [digits, setDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ''))
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const otp = useMemo(() => digits.join(''), [digits])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const setDigitAt = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleChange = (index: number, raw: string) => {
    setError('')

    if (!raw) {
      setDigitAt(index, '')
      return
    }

    const cleaned = raw.replace(/\s/g, '')

    // If user pasted multiple digits into a single box.
    if (cleaned.length > 1) {
      const onlyDigits = cleaned.split('').filter((c) => isDigit(c)).slice(0, OTP_LENGTH)
      if (onlyDigits.length === 0) return

      setDigits(() => {
        const next = Array.from({ length: OTP_LENGTH }, () => '')
        for (let i = 0; i < onlyDigits.length; i++) next[i] = onlyDigits[i]
        return next
      })

      const nextIndex = Math.min(onlyDigits.length, OTP_LENGTH - 1)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    if (!isDigit(cleaned)) return
    setDigitAt(index, cleaned)

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        setDigitAt(index, '')
        return
      }
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        setDigitAt(index - 1, '')
      }
      return
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
      return
    }

    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
      return
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text') ?? ''
    const onlyDigits = text.replace(/\s/g, '').split('').filter((c) => isDigit(c)).slice(0, OTP_LENGTH)
    if (onlyDigits.length === 0) return

    e.preventDefault()
    setDigits(() => {
      const next = Array.from({ length: OTP_LENGTH }, () => '')
      for (let i = 0; i < onlyDigits.length; i++) next[i] = onlyDigits[i]
      return next
    })

    const nextIndex = Math.min(onlyDigits.length, OTP_LENGTH - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.length !== OTP_LENGTH || digits.some((d) => !d || !isDigit(d))) {
      setError('Please enter the 6-digit code.')
      return
    }

    try {
      setIsSubmitting(true)
      // TODO: Call your API to verify OTP here.
      await new Promise((r) => setTimeout(r, 400))
      navigate('/reset-password', { replace: true, state: { email, otp } })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout illustration={<AuthIllustration src="/assets/check.png" alt="OTP illustration" />}>
      <AuthCard
        title="Verify OTP"
        description={
          email
            ? `Enter the 6-digit code sent to ${email}`
            : 'Enter the 6-digit code you received'
        }
        bordered
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex items-center justify-center gap-2">
            {digits.map((value, index) => (
              <input
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                value={value}
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-12 w-11 rounded-lg border border-white/10 bg-black/20 text-center text-lg font-semibold text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-ring"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </PrimaryButton>

          <p className="text-center text-sm text-gray-400">
            Didn&apos;t receive the code?{' '}
            <button type="button" className="font-medium text-accent-amber hover:underline">
              Resend OTP
            </button>
          </p>
        </form>

        <BackToLoginLink />
      </AuthCard>
    </AuthLayout>
  )
}

