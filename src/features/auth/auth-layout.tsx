interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='relative min-h-svh w-full overflow-hidden bg-[#0a0f1e]'>
      {children}
    </div>
  )
}
