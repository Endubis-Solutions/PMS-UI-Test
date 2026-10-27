import { useState } from 'react'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { DEMO_ACCOUNTS } from '../data/core'
import { useApp } from '../lib/store'
import { navigate, useRoute } from '../lib/router'
import { ActionButton, Card, cx } from '../components/ui'
import { Field, Input } from '../components/form'
import { Callout } from '../components/feedback'

export default function LoginCard() {
  const { signIn } = useApp()
  const { query } = useRoute()
  const preset = query.state ?? 'default'
  const [email, setEmail] = useState(preset === 'error' ? 'staff@madvervet.com' : '')
  const [password, setPassword] = useState(preset === 'error' ? 'reception1' : '')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(preset === 'loading')
  const [error, setError] = useState(
    preset === 'error'
      ? 'That email and password don’t match a staff or admin account. Check the password and try again.'
      : null,
  )
  const [fieldErrors, setFieldErrors] = useState(
    preset === 'empty' ? { email: 'Enter your email address.', password: 'Enter your password.' } : {},
  )

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Enter your email address.'
    if (!password) nextErrors.password = 'Enter your password.'
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setError(null)
      return
    }
    setBusy(true)
    setError(null)
    window.setTimeout(() => {
      const demo = DEMO_ACCOUNTS.find(
        (account) =>
          account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password,
      )
      if (!demo) {
        setBusy(false)
        setError(
          'That email and password don’t match a staff or admin account. Check the password and try again.',
        )
        return
      }
      signIn(demo.role)
      navigate('/dashboard')
    }, 700)
  }

  const quickSignIn = (account) => {
    setBusy(true)
    setError(null)
    window.setTimeout(() => {
      signIn(account.role)
      navigate('/dashboard')
    }, 350)
  }

  return (
    <Card className="mt-6 p-6">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {error ? (
          <Callout tone="danger" title="Sign-in failed">
            {error}
          </Callout>
        ) : null}

        <Field label="Email" htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@madvervet.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            invalid={Boolean(fieldErrors.email)}
            disabled={busy}
          />
        </Field>

        <Field label="Password" htmlFor="password" error={fieldErrors.password}>
          <div className="relative">
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              className="pr-10"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              invalid={Boolean(fieldErrors.password)}
              disabled={busy}
            />
            <button
              type="button"
              aria-label={show ? 'Hide password' : 'Show password'}
              onClick={() => setShow((value) => !value)}
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[6px] text-muted hover:bg-page hover:text-ink"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <label className="flex items-center gap-2 text-[13px] text-muted">
          <input type="checkbox" className="h-4 w-4 accent-primary" defaultChecked />
          Keep me signed in on this desk
        </label>

        <ActionButton type="submit" size="lg" loading={busy} className="w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </ActionButton>
      </form>

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-label uppercase tracking-[0.08em] text-muted">Prototype access</p>
        <div className="mt-2 grid gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.role}
              type="button"
              disabled={busy}
              onClick={() => quickSignIn(account)}
              className={cx(
                'flex items-center justify-between gap-3 rounded-control border border-line px-3 py-2 text-left transition-colors',
                busy ? 'cursor-not-allowed opacity-55' : 'hover:bg-page',
              )}
            >
              <span>
                <span className="block text-[13px] font-medium text-ink">
                  {account.role === 'staff' ? 'Front desk (staff)' : 'Owner (admin)'}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted">{account.label}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
