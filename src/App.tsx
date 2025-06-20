import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AppProvider } from "./contexts/AppContext"
import { AuthProvider } from "./features/Auth/hooks/useAuth"
import { AppRoutes } from "./routes/AppRoutes"
import { Toaster } from "@/components/ui/toaster"

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <AppRoutes />
            <Toaster />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
