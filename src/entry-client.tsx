import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'

hydrateRoot(
  document,
  <StrictMode>
    <App />
  </StrictMode>,
)

// const root = document.getElementById('root')
// createRoot(root!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
