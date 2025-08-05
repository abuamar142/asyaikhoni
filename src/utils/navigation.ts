/**
 * Utility functions untuk handle navigasi
 */

import type { Router } from 'vue-router'

/**
 * Smooth scroll ke section dengan offset header
 * @param sectionId - ID dari section target
 * @param offset - Offset dari top (default: 64px untuk header)
 */
export const scrollToSection = (sectionId: string, offset: number = 64): void => {
  const element = document.getElementById(sectionId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

/**
 * Scroll ke top halaman
 */
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

/**
 * Check if current route is home page
 * @param currentPath - Current route path
 * @returns boolean
 */
export const isHomePage = (currentPath: string): boolean => {
  return currentPath === '/'
}

/**
 * Smart navigation handler for cross-route navigation
 * @param router - Vue Router instance
 * @param item - Navigation item with href and id
 */
export const handleCrossRouteNavigation = (
  router: Router,
  item: { name: string; href: string; id: string },
): void => {
  const currentPath = router.currentRoute.value.path

  if (isHomePage(currentPath)) {
    // If on home page, scroll to section
    scrollToSection(item.id)
  } else {
    // If on other route, navigate to home with hash
    router.push('/' + item.href)
  }
}
