"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, RefreshCw } from "lucide-react"
import { useChartOfAccounts, useAccountBalances } from "@/features/accounts/hooks"
import { useAppContext } from "@/contexts/AppContext"
import { formatCurrency } from "@/utils/FormatMoney"

export function AccountsPage() {
  const { selectedEntity, selectedLedger } = useAppContext()
  const {
    chartOfAccounts,
    loading: chartLoading,
    loadChartOfAccounts,
  } = useChartOfAccounts(selectedEntity, selectedLedger)
  const {
    accountBalances,
    loading: balancesLoading,
    loadAccountBalances,
  } = useAccountBalances(selectedEntity, selectedLedger)

  const handleRefresh = () => {
    loadChartOfAccounts()
    loadAccountBalances()
  }

  if (!selectedEntity || !selectedLedger) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No entity or ledger selected</h3>
          <p className="text-muted-foreground text-center">
            Please select an entity and ledger first to manage accounts
          </p>
        </CardContent>
      </Card>
    )
  }

  if (chartLoading || balancesLoading) {
    return <div className="flex items-center justify-center h-64">Loading accounts...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
          <p className="text-muted-foreground">View and manage accounts for the selected ledger</p>
        </div>
        <Button onClick={handleRefresh} disabled={chartLoading || balancesLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${chartLoading || balancesLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Account Balances Summary */}
      {accountBalances && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assets</CardTitle>
              <CardDescription>{accountBalances.assets.length} accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accountBalances.assets.slice(0, 3).map((account) => (
                  <div key={account.uuid} className="flex justify-between text-sm">
                    <span>{account.name}</span>
                    <span className="font-medium">{formatCurrency(account.balance)}</span>
                  </div>
                ))}
                {accountBalances.assets.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{accountBalances.assets.length - 3} more accounts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Liabilities</CardTitle>
              <CardDescription>{accountBalances.liabilities.length} accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accountBalances.liabilities.slice(0, 3).map((account) => (
                  <div key={account.uuid} className="flex justify-between text-sm">
                    <span>{account.name}</span>
                    <span className="font-medium">{formatCurrency(account.balance)}</span>
                  </div>
                ))}
                {accountBalances.liabilities.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{accountBalances.liabilities.length - 3} more accounts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equity</CardTitle>
              <CardDescription>{accountBalances.equity.length} accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accountBalances.equity.slice(0, 3).map((account) => (
                  <div key={account.uuid} className="flex justify-between text-sm">
                    <span>{account.name}</span>
                    <span className="font-medium">{formatCurrency(account.balance)}</span>
                  </div>
                ))}
                {accountBalances.equity.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{accountBalances.equity.length - 3} more accounts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart of Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Chart of Accounts</CardTitle>
          <CardDescription>Complete list of accounts in the ledger</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartOfAccounts.map((account) => (
              <div key={account.uuid} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{account.account_code}</Badge>
                  <div>
                    <h4 className="font-medium">{account.account_name}</h4>
                    <p className="text-sm text-muted-foreground">{account.account_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(account.current_balance)}</div>
                  <div className="text-sm text-muted-foreground">Current Balance</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {chartOfAccounts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No accounts found</h3>
            <p className="text-muted-foreground text-center">
              Create a chart of accounts for this ledger to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
