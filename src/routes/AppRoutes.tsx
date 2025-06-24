import { Routes, Route } from "react-router-dom"
import { SidebarLayout } from "@/layouts/SideBarLayout"
import { Dashboard } from "@/pages/Dashboard/Dashboard"
import { EntitiesPage } from "@/pages/Entities/EntitiesPage"
import { LedgersPage } from "@/pages/Ledger/LedgersPage"
import { AccountsPage } from "@/pages/Account/AccountPage"
import { TransactionsPage } from "@/pages/Transanctions/TransanctionsPage"
import { StatementsPage } from "@/pages/Statements/StatementsPage"
import { AuthPage } from "@/features/Auth/components/AuthPage"
import { ProtectedRoute } from "@/features/Auth/components/ProtectedRoute"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="entities" element={<EntitiesPage />} />
        <Route path="ledgers" element={<LedgersPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="statements" element={<StatementsPage />} />
      </Route>
    </Routes>
  )
}
