"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download } from "lucide-react"
import { useBalanceSheet, useIncomeStatement, useCashFlowStatement } from "@/features/statements/hooks"
import { useAppContext } from "@/contexts/AppContext"
import { formatCurrency } from "@/utils/FormatMoney"
import { useToast } from "@/hooks/use-toast"
import { BalanceSheetTable, IncomeStatementTable } from "@/features/statements/components/FinancialStatementTable"

export function StatementsPage() {
  const { selectedEntity, selectedLedger } = useAppContext()
  const { balanceSheet, loading: bsLoading, loadBalanceSheet } = useBalanceSheet()
  const { incomeStatement, loading: isLoading, loadIncomeStatement } = useIncomeStatement()
  const { cashFlowStatement, loading: cfLoading, loadCashFlowStatement } = useCashFlowStatement()
  const { toast } = useToast()

  const handleLoadStatements = async () => {
    if (!selectedEntity || !selectedLedger) return

    try {
      await Promise.all([
        loadBalanceSheet(selectedEntity, selectedLedger),
        loadIncomeStatement(selectedEntity, selectedLedger),
        loadCashFlowStatement(selectedEntity, selectedLedger),
      ])
      toast({
        title: "Success",
        description: "Financial statements loaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load financial statements",
        variant: "destructive",
      })
    }
  }

  if (!selectedEntity || !selectedLedger) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No entity or ledger selected</h3>
          <p className="text-muted-foreground text-center">
            Please select an entity and ledger first to view financial statements
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Financial Statements</h1>
          <p className="text-muted-foreground text-sm md:text-base">View and download your financial statements</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleLoadStatements}
            disabled={bsLoading === "loading" || isLoading === "loading" || cfLoading === "loading"}
          >
            {bsLoading === "loading" || isLoading === "loading" || cfLoading === "loading" ? "Loading..." : "Load Statements"}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="balance-sheet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="balance-sheet">
          {balanceSheet ? (
            <BalanceSheetTable balanceSheet={balanceSheet} loading={bsLoading === "loading"} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No balance sheet data</h3>
                <p className="text-muted-foreground text-center">
                  Click "Load Statements" to view the balance sheet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="income-statement">
          {incomeStatement ? (
            <IncomeStatementTable incomeStatement={incomeStatement} loading={isLoading === "loading"} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No income statement data</h3>
                <p className="text-muted-foreground text-center">
                  Click "Load Statements" to view the income statement
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cash-flow">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
              <CardDescription>Operating, Investing, and Financing Activities</CardDescription>
            </CardHeader>
            <CardContent>
              {cashFlowStatement ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <h3 className="font-semibold">Operating Activities</h3>
                      <div className="text-2xl font-bold">
                        {formatCurrency(cashFlowStatement.cash_from_operating_activities)}
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">Investing Activities</h3>
                      <div className="text-2xl font-bold">
                        {formatCurrency(cashFlowStatement.cash_from_investing_activities)}
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">Financing Activities</h3>
                      <div className="text-2xl font-bold">
                        {formatCurrency(cashFlowStatement.cash_from_financing_activities)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between font-bold">
                      <span>Net Increase in Cash</span>
                      <span>{formatCurrency(cashFlowStatement.net_increase_in_cash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beginning Cash Balance</span>
                      <span>{formatCurrency(cashFlowStatement.beginning_cash_balance)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Ending Cash Balance</span>
                      <span>{formatCurrency(cashFlowStatement.ending_cash_balance)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Click "Load Statements" to view the cash flow statement</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
