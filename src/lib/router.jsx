import { useEffect, useState } from 'react'

function readHash() {
  const raw = window.location.hash.replace(/^#/, '')
  return raw || '/login'
}

export function useRoute() {
  const [hash, setHash] = useState(readHash)

  useEffect(() => {
    const onChange = () => {
      setHash(readHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const [pathname, search = ''] = hash.split('?')
  const query = Object.fromEntries(new URLSearchParams(search))

  return { pathname: pathname || '/login', query, hash }
}

export function navigate(to) {
  const next = to.startsWith('#') ? to.slice(1) : to
  if (readHash() === next) return
  window.location.hash = next
}

export function Link({ to, children, className, onClick, ...rest }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(event) => {
        onClick?.(event)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

export function withQuery(path, query) {
  const params = new URLSearchParams(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
  const search = params.toString()
  return search ? `${path}?${search}` : path
}
