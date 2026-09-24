import { useEffect } from 'react'
import { RouterProvider, createBrowserRouter, Outlet, useLocation } from 'react-router'
import Home from './pages/Home'
import PortfolioDemo from './demos/Portfolio'
import EcommerceDemo from './demos/Ecommerce'
import CorporateDemo from './demos/Corporate'
import FormDemo from './demos/Formulario'

const isTouch = () => window.matchMedia('(pointer: coarse)').matches

function GlobalCursor() {
  useEffect(() => {
    if (isTouch()) return
    const dot = document.getElementById('cursor')
    const ring = document.getElementById('cursor-ring')
    if (!dot || !ring) return
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      dot.style.left = mx + 'px'; dot.style.top = my + 'px'
    }
    const animate = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px'
      requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', onMove)
    animate()

    const attachHover = () => {
      document.querySelectorAll('a, button, input, textarea, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(2.2)'; ring.style.borderColor = 'rgba(0,229,255,0.9)' })
        el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(0,229,255,0.5)' })
      })
    }
    attachHover()
    // Re-attach on route changes via MutationObserver
    const obs = new MutationObserver(attachHover)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      obs.disconnect()
    }
  }, [])
  return null
}

function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) return

    window.history.scrollRestoration = 'manual'
    const scrollToTop = () => window.scrollTo(0, 0)
    const frame = requestAnimationFrame(() => {
      scrollToTop()
      requestAnimationFrame(scrollToTop)
    })
    const delayed = window.setTimeout(scrollToTop, 100)
    window.addEventListener('pageshow', scrollToTop)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(delayed)
      window.removeEventListener('pageshow', scrollToTop)
    }
  }, [location.pathname, location.hash])

  return (
    <>
      <div id="cursor" />
      <div id="cursor-ring" />
      <GlobalCursor />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: '/', Component: Home },
      { path: '/demo/portfolio', Component: PortfolioDemo },
      { path: '/demo/ecommerce', Component: EcommerceDemo },
      { path: '/demo/corporativo', Component: CorporateDemo },
      { path: '/demo/formulario', Component: FormDemo },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
