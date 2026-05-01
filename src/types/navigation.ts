export type RoutePath = '/' | '/about' | '/event' | '/blogs' | '/blog' | '/impact' | '/contact' | '/dashboard' | '/admin' | '/signin' | '/signup' | '/password-reset'

export type NavigationProps = {
  currentRoute: RoutePath
  navigateTo: (path: RoutePath, url?: string) => void
}

export type NavigateTo = NavigationProps['navigateTo']
