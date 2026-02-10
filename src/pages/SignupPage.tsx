import { useEffect, useMemo, useState } from 'react'
import { Button, Card } from 'konsta/react'
import { Link, useNavigate } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { trackEvent } from '../lib/analytics'

type PlanOption = 'starter' | 'growth' | 'scale'

interface SignupData {
  name: string
  email: string
  phone: string
  verificationCode: string
  role: string
  referral: string
  useCase: string
  currentTools: string
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
  plan: PlanOption | ''
}

const steps = [
  { key: 'name', question: 'What is your full name?', type: 'text', placeholder: 'Jane Doe' },
  {
    key: 'email',
    question: 'What is your work email?',
    type: 'email',
    placeholder: 'you@company.com',
  },
  {
    key: 'phone',
    question: 'What is your phone number?',
    type: 'tel',
    placeholder: '+1 (555) 000-0000',
  },
  {
    key: 'verificationCode',
    question: 'Enter your 2FA verification code',
    hint: 'A 6-digit code was sent to your email and phone number.',
    type: 'text',
    placeholder: '123456',
  },
  {
    key: 'role',
    question: 'What best describes your role?',
    type: 'select',
    options: ['CMO', 'Head of Growth', 'Founder', 'Marketing Manager', 'Marketing Ops', 'Other'],
  },
  {
    key: 'referral',
    question: 'How did you hear about Avero?',
    type: 'select',
    options: ['Search', 'Referral', 'Social', 'Event', 'Newsletter', 'Other'],
  },
  {
    key: 'useCase',
    question: 'What will you use Avero for?',
    type: 'textarea',
    placeholder: 'Describe your top marketing goals.',
  },
  {
    key: 'currentTools',
    question: 'Which tools are you currently using?',
    type: 'textarea',
    placeholder: 'List your current stack.',
  },
  { key: 'payment', question: 'Add your payment method', type: 'payment' },
  { key: 'plan', question: 'Choose your plan', type: 'plan' },
] as const

const plans = [
  { id: 'starter', name: 'Starter', detail: 'Core command center access' },
  { id: 'growth', name: 'Growth', detail: 'Advanced workflow and scale controls' },
  { id: 'scale', name: 'Scale', detail: 'Full marketing operating stack' },
] as const

export default function SignupPage() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [data, setData] = useState<SignupData>({
    name: '',
    email: '',
    phone: '',
    verificationCode: '',
    role: '',
    referral: '',
    useCase: '',
    currentTools: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    plan: '',
  })

  const currentStep = steps[stepIndex]
  const progress = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex])

  const currentAutoComplete = useMemo(() => {
    switch (currentStep.key) {
      case 'name':
        return 'name'
      case 'email':
        return 'email'
      case 'phone':
        return 'tel'
      case 'verificationCode':
        return 'one-time-code'
      default:
        return 'off'
    }
  }, [currentStep.key])

  const currentInputMode = useMemo(() => {
    if (currentStep.key === 'phone') return 'tel'
    if (currentStep.key === 'verificationCode') return 'numeric'
    return undefined
  }, [currentStep.key])

  useEffect(() => {
    trackEvent('signup_step_view', {
      step_key: currentStep.key,
      step_index: stepIndex + 1,
      total_steps: steps.length,
    })
  }, [currentStep.key, stepIndex])

  const updateField = (field: keyof SignupData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    if (currentStep.key === 'payment') {
      return (
        data.cardName.trim().length > 0 &&
        data.cardNumber.trim().length >= 12 &&
        data.expiry.trim().length >= 4 &&
        data.cvc.trim().length >= 3
      )
    }

    if (currentStep.key === 'plan') {
      return data.plan !== ''
    }

    if (currentStep.key === 'verificationCode') {
      return data.verificationCode.trim().length >= 6
    }

    const value = data[currentStep.key as keyof SignupData]
    return typeof value === 'string' && value.trim().length > 0
  }

  const goNext = () => {
    if (!isStepValid()) {
      trackEvent('signup_step_blocked', {
        step_key: currentStep.key,
        step_index: stepIndex + 1,
      })
      return
    }
    trackEvent('signup_step_continue', {
      step_key: currentStep.key,
      step_index: stepIndex + 1,
    })
    if (stepIndex === steps.length - 1) {
      trackEvent('signup_complete', {
        selected_plan: data.plan || 'none',
        role: data.role || 'unknown',
      })
      navigate('/dashboard')
      return
    }
    setStepIndex((prev) => prev + 1)
  }

  const goBack = () => {
    trackEvent('signup_step_back', {
      step_key: currentStep.key,
      step_index: stepIndex + 1,
    })
    setStepIndex((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="auth-shell">
      <SectionHeading
        eyebrow="Get Access"
        title="Create your Avero account"
        subtitle="One step at a time. Clean, fast, and focused."
        center
      />

      <Card className="auth-card auth-card-wide">
        <div className="progress-wrap">
          <div className="progress-meta">
            <span>
              Step {stepIndex + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="signup-step">
          <h3>{currentStep.question}</h3>
          {'hint' in currentStep && currentStep.hint ? <p>{currentStep.hint}</p> : null}

          {currentStep.type === 'textarea' ? (
            <textarea
              value={data[currentStep.key as keyof SignupData] as string}
              onChange={(event) =>
                updateField(currentStep.key as keyof SignupData, event.target.value)
              }
              placeholder={currentStep.placeholder}
              rows={4}
            />
          ) : null}

          {currentStep.type === 'select' ? (
            <select
              value={data[currentStep.key as keyof SignupData] as string}
              onChange={(event) =>
                updateField(currentStep.key as keyof SignupData, event.target.value)
              }
            >
              <option value="">Select one</option>
              {currentStep.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : null}

          {currentStep.type === 'payment' ? (
            <div className="payment-grid">
              <label>
                Cardholder Name
                <input
                  type="text"
                  value={data.cardName}
                  onChange={(event) => updateField('cardName', event.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="cc-name"
                />
              </label>
              <label>
                Card Number
                <input
                  type="text"
                  value={data.cardNumber}
                  onChange={(event) => updateField('cardNumber', event.target.value)}
                  placeholder="4242 4242 4242 4242"
                  autoComplete="cc-number"
                  inputMode="numeric"
                />
              </label>
              <div className="payment-row">
                <label>
                  Expiry
                  <input
                    type="text"
                    value={data.expiry}
                    onChange={(event) => updateField('expiry', event.target.value)}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    inputMode="numeric"
                  />
                </label>
                <label>
                  CVC
                  <input
                    type="text"
                    value={data.cvc}
                    onChange={(event) => updateField('cvc', event.target.value)}
                    placeholder="123"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {currentStep.type === 'plan' ? (
            <div className="plan-grid">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className={data.plan === plan.id ? 'plan-choice active' : 'plan-choice'}
                  onClick={() => setData((prev) => ({ ...prev, plan: plan.id }))}
                >
                  <strong>{plan.name}</strong>
                  <span>{plan.detail}</span>
                </button>
              ))}
            </div>
          ) : null}

          {!['textarea', 'select', 'payment', 'plan'].includes(currentStep.type) ? (
            <input
              type={currentStep.type}
              value={data[currentStep.key as keyof SignupData] as string}
              onChange={(event) =>
                updateField(currentStep.key as keyof SignupData, event.target.value)
              }
              placeholder={'placeholder' in currentStep ? currentStep.placeholder : ''}
              autoComplete={currentAutoComplete}
              inputMode={currentInputMode}
            />
          ) : null}
        </div>

        <div className="auth-actions">
          <Button rounded tonal className="cta-secondary" onClick={goBack} disabled={stepIndex === 0}>
            Back
          </Button>
          <Button rounded className="cta-primary" onClick={goNext} disabled={!isStepValid()}>
            {stepIndex === steps.length - 1 ? 'Finish & Continue' : 'Continue'}
          </Button>
        </div>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </Card>
    </div>
  )
}
