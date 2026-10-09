import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  animation?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'default'
  stagger?: boolean
  threshold?: number
  delay?: number
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'up',
  stagger = false,
  threshold = 0.15,
  delay = 0
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      element.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay if specified
          if (delay > 0) {
            setTimeout(() => {
              element.classList.add('visible')
            }, delay)
          } else {
            element.classList.add('visible')
          }
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin: '0px' }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, delay])

  const animationClass = stagger
    ? 'scroll-reveal-stagger'
    : `scroll-reveal-${animation === 'default' ? '' : animation}`

  return (
    <div ref={ref} className={`${animationClass} ${className}`}>
      {children}
    </div>
  )
}
