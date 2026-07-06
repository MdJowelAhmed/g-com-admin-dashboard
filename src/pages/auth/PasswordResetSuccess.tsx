import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RESET_PASSWORD_TOKEN_KEY } from '../../redux/api/authApi'
import AuthLayout from '../../layouts/AuthLayout'
import AuthCard from '../../components/auth/AuthCard'
import AuthIllustration from '../../components/auth/AuthIllustration'
import PrimaryButton from '../../components/auth/PrimaryButton'

export default function PasswordResetSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(RESET_PASSWORD_TOKEN_KEY)
    }
  }, [])

  return (
    <AuthLayout
      illustration={<AuthIllustration src="/assets/check.png" alt="Password reset success illustration" />}
    >
      <AuthCard
        title="Password reset"
        description="Your password has been successfully reset. Click below to log in magically."
        
      >
        <PrimaryButton type="button" onClick={() => navigate('/login')}>
          Continue
        </PrimaryButton>
      </AuthCard>
    </AuthLayout>
  )
}
