import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './providers/ToastProvider'
import { ToastContainer } from './components/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <div
        className="fixed inset-0 animate-gradient"
        style={{
          background: "linear-gradient(315deg, rgba(102, 3, 95, 1) 3%, rgba(165, 60, 206, 1) 38%, rgba(194, 101, 238, 1) 68%, rgba(255,25,25,1) 98%)",
          backgroundSize: "400% 400%",
        }}
      >
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
          <App />
        </div>
        <ToastContainer />
      </div>
    </ToastProvider>
  </StrictMode>,
)