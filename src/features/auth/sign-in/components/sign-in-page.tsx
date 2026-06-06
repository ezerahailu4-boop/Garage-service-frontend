import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconShieldCheck,
  IconChevronDown,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react'
import { useAuthStore } from '@/stores/authStore'

// ── Role configuration ───────────────────────────────────────
const ROLES = [
  {
    id: 'garage_manager',
    label: 'Garage Manager',
    description: 'Full access to operations & reports',
    color: '#3b82f6',
    demo: { email: 'manager@birhan.et', password: 'manager123' },
  },
  {
    id: 'receptionist',
    label: 'Receptionist',
    description: 'Customer intake & vehicle registration',
    color: '#10b981',
    demo: { email: 'reception@birhan.et', password: 'reception123' },
  },
  {
    id: 'inspector',
    label: 'Inspector',
    description: 'Vehicle inspection & diagnostics',
    color: '#f59e0b',
    demo: { email: 'inspector@birhan.et', password: 'inspector123' },
  },
  {
    id: 'technician',
    label: 'Technician',
    description: 'Repair tasks & work orders',
    color: '#8b5cf6',
    demo: { email: 'tech@birhan.et', password: 'tech123' },
  },
  {
    id: 'accountant',
    label: 'Accountant',
    description: 'Finance, invoices & payments',
    color: '#ef4444',
    demo: { email: 'finance@birhan.et', password: 'finance123' },
  },
  {
    id: 'super_admin',
    label: 'Super Admin',
    description: 'Unrestricted system access',
    color: '#ec4899',
    demo: { email: 'admin@birhan.et', password: 'admin123' },
  },
] as const

// ── Form schema ──────────────────────────────────────────────
const schema = z.object({
  email: z.email({ error: () => 'Enter a valid email address' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})
type FormValues = z.infer<typeof schema>

// ── Animated background particles ───────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
  }))

  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden'>
      {particles.map((p) => (
        <div
          key={p.id}
          className='absolute rounded-full bg-blue-400/20'
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

// ── Stats ticker ─────────────────────────────────────────────
const STATS = [
  { label: 'Vehicles Serviced', value: '12,847' },
  { label: 'Happy Customers', value: '3,291' },
  { label: 'Avg Turnaround', value: '2.4 days' },
  { label: 'Satisfaction Rate', value: '98.6%' },
]

// ── Main component ───────────────────────────────────────────
export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<typeof ROLES[number]>(ROLES[0])
  const [roleDropOpen, setRoleDropOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statIdx, setStatIdx] = useState(0)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  // Rotate stat ticker
  useEffect(() => {
    const t = setInterval(() => setStatIdx((i) => (i + 1) % STATS.length), 3000)
    return () => clearInterval(t)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  })

  // Auto-fill demo credentials when role changes
  function handleRoleSelect(role: (typeof ROLES)[number]) {
    setSelectedRole(role)
    setRoleDropOpen(false)
    form.setValue('email', role.demo.email)
    form.setValue('password', role.demo.password)
    setError(null)
  }

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setError(null)

    // Simulate auth — in prod replace with real API call
    await new Promise((r) => setTimeout(r, 1800))

    const matched = ROLES.find(
      (r) => r.demo.email === data.email && r.demo.password === data.password
    )

    if (!matched) {
      setError('Invalid email or password. Use the demo credentials above.')
      setIsLoading(false)
      return
    }

    // Set mock token
    auth.setAccessToken('mock-jwt-token-' + matched.id)
    auth.setUser({
      accountNo: matched.id,
      email: data.email,
      role: [matched.id],
      exp: Date.now() + 86400000,
    })

    navigate({ to: '/' })
  }

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          to   { transform: translateY(-30px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes grid-pan {
          0%   { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
        }
        @keyframes ticker {
          0%   { opacity: 0; transform: translateY(8px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        .slide-up  { animation: slide-up 0.5s ease both; }
        .slide-right { animation: slide-in-right 0.6s ease both; }
        .ticker-item { animation: ticker 3s ease infinite; }
      `}</style>

      <div className='relative flex min-h-svh w-full overflow-hidden bg-[#080d1a]'>
        {/* ── Left panel — branding ── */}
        <div className='relative hidden w-[55%] flex-col overflow-hidden lg:flex'>
          {/* Animated grid background */}
          <div
            className='absolute inset-0'
            style={{
              backgroundImage:
                'linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              animation: 'grid-pan 8s linear infinite',
            }}
          />

          {/* Deep gradient overlays */}
          <div className='absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#0d1528] to-[#060a14]' />
          <div className='absolute bottom-0 left-0 h-[60%] w-[60%] rounded-full bg-blue-600/10 blur-[120px]' />
          <div className='absolute top-0 right-0 h-[50%] w-[50%] rounded-full bg-indigo-600/10 blur-[100px]' />

          <Particles />

          {/* Content */}
          <div className='relative z-10 flex flex-1 flex-col p-12'>
            {/* Logo */}
            <div className='slide-up flex items-center gap-3' style={{ animationDelay: '0.1s' }}>
              <div
                className='flex h-11 w-11 items-center justify-center rounded-xl'
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  animation: 'pulse-ring 3s ease infinite',
                }}
              >
                <svg className='h-6 w-6 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
                  <path d='M3 17h2l1-3h10l1 3h2M5 17v2h2v-2M17 17v2h2v-2' />
                  <path d='M6 14l1-4h10l1 4' />
                  <circle cx='8' cy='10' r='0.5' fill='currentColor' />
                  <circle cx='16' cy='10' r='0.5' fill='currentColor' />
                </svg>
              </div>
              <div>
                <p className='text-sm font-bold tracking-widest text-blue-400/80 uppercase'>Birhan</p>
                <p className='text-[10px] tracking-[0.2em] text-slate-500 uppercase'>Garage Platform</p>
              </div>
            </div>

            {/* Main headline */}
            <div className='mt-auto'>
              <div className='slide-up mb-3' style={{ animationDelay: '0.2s' }}>
                <span className='rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400'>
                  Enterprise Automotive Platform
                </span>
              </div>
              <h1
                className='slide-up text-5xl font-black leading-[1.08] tracking-tight text-white'
                style={{ animationDelay: '0.3s' }}
              >
                Modern Garage
                <br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #818cf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Management
                </span>
              </h1>
              <p
                className='slide-up mt-4 max-w-sm text-base leading-relaxed text-slate-400'
                style={{ animationDelay: '0.4s' }}
              >
                Streamline inspections, quotations, work orders and team management — all in one place.
              </p>

              {/* Feature list */}
              <div className='slide-up mt-8 space-y-3' style={{ animationDelay: '0.5s' }}>
                {[
                  'Vehicle inspection & digital reporting',
                  'Kanban work order management',
                  'Real-time inventory tracking',
                  'Customer approval via Telegram',
                ].map((feature) => (
                  <div key={feature} className='flex items-center gap-3'>
                    <div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20'>
                      <IconCheck className='h-3 w-3 text-blue-400' />
                    </div>
                    <span className='text-sm text-slate-300'>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stats ticker */}
              <div
                className='slide-up mt-10 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm'
                style={{ animationDelay: '0.6s' }}
              >
                <div
                  className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'
                  style={{ background: `${selectedRole.color}22` }}
                >
                  <span className='text-lg font-black' style={{ color: selectedRole.color }}>
                    {STATS[statIdx].value.charAt(0)}
                  </span>
                </div>
                <div className='min-h-[36px] overflow-hidden'>
                  <div key={statIdx} className='ticker-item'>
                    <p className='text-lg font-bold text-white'>{STATS[statIdx].value}</p>
                    <p className='text-xs text-slate-500'>{STATS[statIdx].label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='slide-up mt-10 flex items-center gap-4' style={{ animationDelay: '0.7s' }}>
              <p className='text-xs text-slate-600'>© 2025 Birhan Garage PLC · Addis Ababa</p>
            </div>
          </div>
        </div>

        {/* ── Right panel — login form ── */}
        <div className='flex flex-1 items-center justify-center p-6 lg:p-12'>
          <div className='slide-right w-full max-w-[420px]' style={{ animationDelay: '0.15s' }}>
            {/* Mobile logo */}
            <div className='mb-8 flex items-center gap-3 lg:hidden'>
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600'>
                <svg className='h-5 w-5 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M3 17h2l1-3h10l1 3h2M5 17v2h2v-2M17 17v2h2v-2' />
                  <path d='M6 14l1-4h10l1 4' />
                </svg>
              </div>
              <span className='font-bold text-white'>Birhan Garage</span>
            </div>

            {/* Heading */}
            <div className='mb-8'>
              <h2 className='text-3xl font-black text-white'>Welcome back</h2>
              <p className='mt-1.5 text-sm text-slate-400'>
                Sign in to your workspace below
              </p>
            </div>

            {/* Role selector */}
            <div className='mb-6'>
              <label className='mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500'>
                Sign in as
              </label>
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setRoleDropOpen((v) => !v)}
                  className='flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all hover:border-white/20 hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                >
                  <div
                    className='h-2.5 w-2.5 shrink-0 rounded-full'
                    style={{ backgroundColor: selectedRole.color }}
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-semibold text-white'>{selectedRole.label}</p>
                    <p className='truncate text-xs text-slate-500'>{selectedRole.description}</p>
                  </div>
                  <IconChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${roleDropOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {roleDropOpen && (
                  <div className='absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0f1629] shadow-2xl shadow-black/60'>
                    {ROLES.map((role) => (
                      <button
                        key={role.id}
                        type='button'
                        onClick={() => handleRoleSelect(role)}
                        className='flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5'
                      >
                        <div
                          className='h-2.5 w-2.5 shrink-0 rounded-full'
                          style={{ backgroundColor: role.color }}
                        />
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-white'>{role.label}</p>
                          <p className='text-xs text-slate-500'>{role.description}</p>
                        </div>
                        {role.id === selectedRole.id && (
                          <IconCheck className='h-4 w-4 text-blue-400' />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Demo credentials hint */}
            <div className='mb-5 flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2.5'>
              <IconShieldCheck className='h-4 w-4 shrink-0 text-blue-400' />
              <p className='text-xs text-blue-300'>
                Demo credentials auto-filled for{' '}
                <span className='font-semibold'>{selectedRole.label}</span>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className='mb-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5'>
                <IconAlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-red-400' />
                <p className='text-xs text-red-300'>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Email */}
              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500'>
                  Email
                </label>
                <input
                  {...form.register('email')}
                  type='email'
                  autoComplete='email'
                  placeholder='you@birhan.et'
                  className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/20'
                />
                {form.formState.errors.email && (
                  <p className='mt-1 text-xs text-red-400'>
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className='mb-1.5 flex items-center justify-between'>
                  <label className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
                    Password
                  </label>
                  <Link
                    to='/forgot-password'
                    className='text-xs font-medium text-blue-400 transition-opacity hover:opacity-75'
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className='relative'>
                  <input
                    {...form.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    placeholder='••••••••'
                    className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/60 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/20'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((v) => !v)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300'
                  >
                    {showPassword ? (
                      <IconEyeOff className='h-4.5 w-4.5' />
                    ) : (
                      <IconEye className='h-4.5 w-4.5' />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className='mt-1 text-xs text-red-400'>
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <label className='flex cursor-pointer items-center gap-2.5'>
                <div className='relative'>
                  <input
                    {...form.register('remember')}
                    type='checkbox'
                    className='peer sr-only'
                  />
                  <div className='h-4 w-4 rounded border border-white/20 bg-white/5 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-600' />
                  <IconCheck className='pointer-events-none absolute inset-0 m-auto h-3 w-3 text-white opacity-0 peer-checked:opacity-100' />
                </div>
                <span className='text-sm text-slate-400'>Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <button
                type='submit'
                disabled={isLoading}
                className='relative mt-2 w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60'
                style={{
                  background: isLoading
                    ? '#1d4ed8'
                    : 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #2563eb 100%)',
                }}
              >
                {/* Shimmer effect */}
                {!isLoading && (
                  <span
                    className='absolute inset-0 -translate-x-full skew-x-12 bg-white/10'
                    style={{ animation: 'shimmer 2s 1s ease infinite' }}
                  />
                )}
                <span className='relative flex items-center justify-center gap-2'>
                  {isLoading ? (
                    <>
                      <IconLoader2 className='h-4 w-4 animate-spin' />
                      Authenticating…
                    </>
                  ) : (
                    'Sign in to Dashboard'
                  )}
                </span>
              </button>
            </form>

            {/* Footer */}
            <p className='mt-8 text-center text-xs text-slate-600'>
              Birhan Garage Management Platform · v2.0
              <br />
              <span className='text-slate-700'>
                Secure · Enterprise-grade · Addis Ababa
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }
      `}</style>
    </>
  )
}
