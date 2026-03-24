import { onMounted, onUnmounted } from 'vue'

/**
 * Observa elementos con la clase .reveal, .reveal-left, .reveal-right
 * y les añade la clase .visible cuando entran al viewport.
 */
export function useRevealAnimation() {
  let observer = null

  const refresh = () => {
    if (!observer) return
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    targets.forEach((el) => {
      // Evitamos observar elementos que ya fueron revelados (tienen .visible)
      if (!el.classList.contains('visible')) {
        observer.observe(el)
      }
    })
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target) // Ya no necesitamos observarlo
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )

    refresh()
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { refresh }
}
