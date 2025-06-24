"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/FormatMoney"
import type { BalanceSheet, IncomeStatement, CashFlowStatement } from "@/types"

// Reusable component for financial statement sections
interface FinancialSectionProps {
  title: string
  titleColor: string
  items: Array<{ uuid: string; code: string; name: string; balance: string }>
  totalLabel: string
  totalAmount: string
  extraRows?: Array<{ label: string; amount: string; isHighlighted?: boolean }>
}

function FinancialSection({ title, titleColor, items, totalLabel, totalAmount, extraRows }: FinancialSectionProps) {
  return (
    <div>
      <h3 className={`text-lg font-semibold mb-3 ${titleColor}`}>{title}</h3>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.uuid}>
                <TableCell>
                  <Badge variant="outline">{item.code}</Badge>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(parseFloat(item.balance))}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2">
              <TableCell colSpan={2} className="font-bold">{totalLabel}</TableCell>
              <TableCell className="text-right font-bold font-mono">
                {formatCurrency(parseFloat(totalAmount))}
              </TableCell>
            </TableRow>
            {extraRows?.map((row, index) => (
              <TableRow key={index} className={row.isHighlighted ? "bg-muted/50" : ""}>
                <TableCell colSpan={2} className="font-bold">{row.label}</TableCell>
                <TableCell className="text-right font-bold font-mono">
                  {formatCurrency(parseFloat(row.amount))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {items.map((item) => (
          <Card key={item.uuid} className="p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{item.code}</Badge>
                </div>
                <div className="font-medium text-sm">{item.name}</div>
              </div>
              <div className="font-mono font-bold text-sm">
                {formatCurrency(parseFloat(item.balance))}
              </div>
            </div>
          </Card>
        ))}
        <Card className="p-3 bg-muted/50">
          <div className="flex justify-between items-center">
            <span className="font-bold">{totalLabel}</span>
            <span className="font-bold font-mono">
              {formatCurrency(parseFloat(totalAmount))}
            </span>
          </div>
        </Card>
        {extraRows?.map((row, index) => (
          <Card key={index} className={`p-3 ${row.isHighlighted ? 'bg-primary/10' : 'bg-muted/30'}`}>
            <div className="flex justify-between items-center">
              <span className="font-bold">{row.label}</span>
              <span className="font-bold font-mono">
                {formatCurrency(parseFloat(row.amount))}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface BalanceSheetTableProps {
  balanceSheet: BalanceSheet
  loading?: boolean
}

export function BalanceSheetTable({ balanceSheet, loading }: BalanceSheetTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Sheet</CardTitle>
        <CardDescription>Assets, Liabilities, and Equity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FinancialSection
            title="Assets"
            titleColor="text-green-700"
            items={balanceSheet.assets}
            totalLabel="Total Assets"
            totalAmount={balanceSheet.total_assets}
          />

          <FinancialSection
            title="Liabilities"
            titleColor="text-red-700"
            items={balanceSheet.liabilities}
            totalLabel="Total Liabilities"
            totalAmount={balanceSheet.total_liabilities}
          />

          <FinancialSection
            title="Equity"
            titleColor="text-blue-700"
            items={balanceSheet.equity}
            totalLabel="Total Equity"
            totalAmount={balanceSheet.total_equity}
          />

          {/* Total Check */}
          <div className="border-t-2 pt-4">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableBody>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total Liabilities and Equity</TableCell>
                    <TableCell className="text-right font-bold font-mono">
                      {formatCurrency(parseFloat(balanceSheet.total_liabilities_and_equity))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card */}
            <div className="md:hidden">
              <Card className="p-4 bg-primary/10">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="font-bold text-base">Total Liabilities and Equity</span>
                  <span className="font-bold font-mono text-base">
                    {formatCurrency(parseFloat(balanceSheet.total_liabilities_and_equity))}
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface IncomeStatementTableProps {
  incomeStatement: IncomeStatement
  loading?: boolean
}

export function IncomeStatementTable({ incomeStatement, loading }: IncomeStatementTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Statement</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Statement</CardTitle>
        <CardDescription>Revenue, Expenses, and Net Income</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FinancialSection
            title="Revenue"
            titleColor="text-green-700"
            items={incomeStatement.revenues}
            totalLabel="Total Revenue"
            totalAmount={incomeStatement.total_revenues}
          />

          <FinancialSection
            title="Cost of Goods Sold"
            titleColor="text-yellow-700"
            items={incomeStatement.cogs}
            totalLabel="Total COGS"
            totalAmount={incomeStatement.total_cogs}
            extraRows={[
              { label: "Gross Profit", amount: incomeStatement.gross_profit, isHighlighted: true }
            ]}
          />

          <FinancialSection
            title="Expenses"
            titleColor="text-red-700"
            items={incomeStatement.expenses}
            totalLabel="Total Expenses"
            totalAmount={incomeStatement.total_expenses}
          />

          {/* Net Income */}
          <div className="border-t-2 pt-4">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableBody>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold text-lg">Net Income</TableCell>
                    <TableCell className="text-right font-bold font-mono text-lg">
                      {formatCurrency(parseFloat(incomeStatement.net_income))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card */}
            <div className="md:hidden">
              <Card className="p-4 bg-primary/10">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="font-bold text-lg">Net Income</span>
                  <span className="font-bold font-mono text-lg">
                    {formatCurrency(parseFloat(incomeStatement.net_income))}
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
