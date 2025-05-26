import { ReactNode } from 'react'
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'

const testimonials = [
  {
    quote: "The trading platform has revolutionized how I manage my portfolio. The real-time analytics and intuitive interface make complex trading decisions feel effortless.",
    name: "Sarah Chen",
    designation: "Professional Trader",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    quote: "Security and reliability are paramount in trading. This platform delivers both with cutting-edge technology and robust infrastructure that I can trust with my investments.",
    name: "Michael Rodriguez",
    designation: "Investment Manager",
    src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    quote: "The advanced charting tools and market insights have given me a competitive edge. It's like having a team of analysts working around the clock.",
    name: "Emily Johnson",
    designation: "Quantitative Analyst",
    src: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left side - Testimonials */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center bg-muted/30">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
        
        {/* Right side - Auth Forms */}
        <div className="flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
