import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './i18n'   // must run before anything renders
import './index.css'
import App from './App.jsx'
import { CLERK_PUBLISHABLE_KEY, clerkConfigured } from './lib/clerk'

// Without a publishable key ClerkProvider throws while rendering, so the app
// mounts without it and every page except the two account pages carries on
// working. See client/src/lib/clerk.js.
const app = <App />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {clerkConfigured ? (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        {app}
      </ClerkProvider>
    ) : (
      app
    )}
  </StrictMode>,
)
