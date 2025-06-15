import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AppRoutes } from "./routes/AppRoutes"
import { Toaster } from "@/components/ui/toaster"

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  )
}
