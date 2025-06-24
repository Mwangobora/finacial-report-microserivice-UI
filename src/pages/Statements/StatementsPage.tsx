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
import { downloadAsFile, printStatementSection, downloadAsPDF } from "./exportUtils"

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

  // Helper to get current tab's statement data and name
  const getCurrentStatement = () => {
    const tab = document.querySelector('[role="tab"][aria-selected="true"]')?.getAttribute('data-state') || 'balance-sheet';
    if (tab === 'income-statement') {
      return {
        data: incomeStatement,
        name: 'Income Statement',
        type: 'income-statement',
        htmlId: 'income-statement-section',
      };
    } else if (tab === 'cash-flow') {
      return {
        data: cashFlowStatement,
        name: 'Cash Flow Statement',
        type: 'cash-flow',
        htmlId: 'cash-flow-section',
      };
    }
    return {
      data: balanceSheet,
      name: 'Balance Sheet',
      type: 'balance-sheet',
      htmlId: 'balance-sheet-section',
    };
  };

  const handleExport = () => {
    const { data, name, type } = getCurrentStatement();
    if (!data) {
      toast({ title: 'Error', description: `No ${name} data to export`, variant: 'destructive' });
      return;
    }
    downloadAsFile(`${name.replace(/\s/g, '_').toLowerCase()}.json`, JSON.stringify(data, null, 2), 'application/json');
  };

  const handlePrint = () => {
    const { data, name, htmlId } = getCurrentStatement();
    if (!data) {
      toast({ title: 'Error', description: `No ${name} data to print`, variant: 'destructive' });
      return;
    }
    printStatementSection(htmlId, name);
  };

  const handleExportPDF = async () => {
    const { data, name, htmlId } = getCurrentStatement();
    if (!data) {
      toast({ title: 'Error', description: `No ${name} data to export`, variant: 'destructive' });
      return;
    }
    await downloadAsPDF(htmlId, `${name.replace(/\s/g, '_').toLowerCase()}.pdf`);
  };

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
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
          <Button
            onClick={handleLoadStatements}
            disabled={bsLoading === "loading" || isLoading === "loading" || cfLoading === "loading"}
            className="w-full sm:w-auto"
          >
            {bsLoading === "loading" || isLoading === "loading" || cfLoading === "loading" ? "Loading..." : "Load Statements"}
          </Button>
         
          <Button variant="outline" className="w-full sm:w-auto" onClick={handlePrint}>
            Print
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="balance-sheet" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
          <TabsTrigger value="balance-sheet" className="text-xs sm:text-sm">Balance Sheet</TabsTrigger>
          <TabsTrigger value="income-statement" className="text-xs sm:text-sm">Income Statement</TabsTrigger>
          <TabsTrigger value="cash-flow" className="text-xs sm:text-sm">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="balance-sheet">
          <div id="balance-sheet-section">
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
          </div>
        </TabsContent>

        <TabsContent value="income-statement">
          <div id="income-statement-section">
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
          </div>
        </TabsContent>

        <TabsContent value="cash-flow">
          <div id="cash-flow-section">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Statement</CardTitle>
                <CardDescription>Operating, Investing, and Financing Activities</CardDescription>
              </CardHeader>
              <CardContent>
                {cashFlowStatement ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm sm:text-base">Operating Activities</h3>
                        <div className="text-xl sm:text-2xl font-bold mt-2">
                          {formatCurrency(cashFlowStatement.cash_from_operating_activities)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm sm:text-base">Investing Activities</h3>
                        <div className="text-xl sm:text-2xl font-bold mt-2">
                          {formatCurrency(cashFlowStatement.cash_from_investing_activities)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-semibold text-sm sm:text-base">Financing Activities</h3>
                        <div className="text-xl sm:text-2xl font-bold mt-2">
                          {formatCurrency(cashFlowStatement.cash_from_financing_activities)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 bg-muted/20 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="font-bold text-sm sm:text-base">Net Increase in Cash</span>
                        <span className="font-bold text-sm sm:text-base">{formatCurrency(cashFlowStatement.net_increase_in_cash)}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-sm sm:text-base">Beginning Cash Balance</span>
                        <span className="text-sm sm:text-base">{formatCurrency(cashFlowStatement.beginning_cash_balance)}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 font-bold text-base sm:text-lg border-t pt-2">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
