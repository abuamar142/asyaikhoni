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
  return currentPath === '/' || currentPath === ''
}

/**
 * Smart navigation handler for cross-route navigation
 * Handles hash links (/#about), absolute paths (/amalan) and plain anchors
 * @param router - Vue Router instance
 * @param item - Navigation item with href and id
 */
export const handleCrossRouteNavigation = (
  router: Router,
  item: { name: string; href: string; id: string },
): void => {
  const currentPath = router.currentRoute.value.path

  if (item.href.startsWith('/#')) {
    // hash like /#about, /#contact
    if (isHomePage(currentPath)) {
      scrollToSection(item.id)
    } else {
      router.push({ path: '/', hash: item.href.slice(1) })
    }
  } else if (item.href.startsWith('/')) {
    // absolute like /amalan, /amalan/koleksi, /
    // handle '/' specially: scroll to top when already home
    if (item.href === '/' && isHomePage(currentPath)) {
      scrollToTop()
      // ensure hash cleared if any
      if (router.currentRoute.value.hash) {
        router.push({ path: '/', hash: '' })
      }
      return
    }
    router.push(item.href)
  } else if (item.href.startsWith('#')) {
    // plain hash like #contact (used by CTA buttons)
    if (isHomePage(currentPath)) {
      scrollToSection(item.id)
    } else {
      router.push({ path: '/', hash: item.href })
    }
  } else {
    scrollToSection(item.id)
  }
}
