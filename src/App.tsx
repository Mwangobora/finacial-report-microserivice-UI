import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AppProvider } from "./contexts/AppContext"
import { AppRoutes } from "./routes/AppRoutes"
import { Toaster } from "@/components/ui/toaster"

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <AppRoutes />
          <Toaster />
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
