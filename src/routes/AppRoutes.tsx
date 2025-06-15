import { Routes, Route } from "react-router-dom"
import { SidebarLayout } from "@/layouts/SideBarLayout"
import { Dashboard } from "@/pages/Dashboard"
import { EntitiesPage } from "@/pages/EntitiesPage"
import { LedgersPage } from "@/pages/LedgersPage"
import { AccountsPage } from "@/pages/AccountPage"
import { TransactionsPage } from "@/pages/TransanctionsPage"
import { StatementsPage } from "@/pages/StatementsPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SidebarLayout />}>
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
