"use client"

import { useRef, useLayoutEffect } from "react"
import gsap from "gsap"

interface AnimateOptions {
  selector?: string
  y?: number
  x?: number
  opacity?: number
  scale?: number
  duration?: number
  stagger?: number
  delay?: number
  ease?: string
}

export function useGsap(
  fn: (el: HTMLElement) => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => fn(ref.current!), ref.current)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

function normalizeSelector(sel: string): string {
  if (sel.startsWith("> ")) return `:scope ${sel}`
  return sel
}

export function useGsapFadeIn(options: AnimateOptions = {}) {
  const {
    selector = ":scope > *",
    y = 24,
    x = 0,
    opacity = 0,
    scale = 1,
    duration = 0.45,
    stagger = 0.08,
    delay = 0,
    ease = "back.out(1.4)",
  } = options

  return useGsap((el) => {
    const children = el.querySelectorAll(normalizeSelector(selector))
    gsap.set(children, { opacity, y, x, scale })
    gsap.to(children, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      stagger,
      delay,
      ease,
    })
  })
}

export function useGsapSlideDown(options: AnimateOptions = {}) {
  const {
    selector = ":scope > *",
    y = -20,
    opacity = 0,
    duration = 0.4,
    stagger = 0.06,
    delay = 0,
    ease = "back.out(1.4)",
  } = options

  return useGsap((el) => {
    const children = el.querySelectorAll(normalizeSelector(selector))
    gsap.set(children, { opacity, y })
    gsap.to(children, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease,
    })
  })
}

export function useGsapPop(options: AnimateOptions = {}) {
  const {
    selector = ":scope > *",
    scale = 0.85,
    opacity = 0,
    duration = 0.4,
    stagger = 0.08,
    delay = 0,
    ease = "back.out(2)",
  } = options

  return useGsap((el) => {
    const children = el.querySelectorAll(normalizeSelector(selector))
    gsap.set(children, { scale, opacity })
    gsap.to(children, {
      scale: 1,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease,
    })
  })
}
