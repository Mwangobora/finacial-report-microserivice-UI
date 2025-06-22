"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/FormatMoney"
import type { BalanceSheet, IncomeStatement, CashFlowStatement } from "@/types"

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
          {/* Assets */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-700">Assets</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanceSheet.assets.map((asset) => (
                  <TableRow key={asset.uuid}>
                    <TableCell>
                      <Badge variant="outline">{asset.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(parseFloat(asset.balance))}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={2} className="font-bold">Total Assets</TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    {formatCurrency(parseFloat(balanceSheet.total_assets))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Liabilities */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-700">Liabilities</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanceSheet.liabilities.map((liability) => (
                  <TableRow key={liability.uuid}>
                    <TableCell>
                      <Badge variant="outline">{liability.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{liability.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(parseFloat(liability.balance))}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={2} className="font-bold">Total Liabilities</TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    {formatCurrency(parseFloat(balanceSheet.total_liabilities))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Equity */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Equity</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanceSheet.equity.map((equity) => (
                  <TableRow key={equity.uuid}>
                    <TableCell>
                      <Badge variant="outline">{equity.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{equity.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(parseFloat(equity.balance))}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={2} className="font-bold">Total Equity</TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    {formatCurrency(parseFloat(balanceSheet.total_equity))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Total Check */}
          <div className="border-t-2 pt-4">
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
          {/* Revenue */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-700">Revenue</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeStatement.revenues.map((revenue) => (
                  <TableRow key={revenue.uuid}>
                    <TableCell>
                      <Badge variant="outline">{revenue.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{revenue.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(parseFloat(revenue.balance))}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={2} className="font-bold">Total Revenue</TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    {formatCurrency(parseFloat(incomeStatement.total_revenues))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* COGS */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-yellow-700">Cost of Goods Sold</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeStatement.cogs.map((cog) => (
                  <TableRow key={cog.uuid}>
                    <TableCell>
                      <Badge variant="outline">{cog.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{cog.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(parseFloat(cog.balance))}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={2} className="font-bold">Total COGS</TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    {formatCurrency(parseFloat(incomeStatement.total_cogs))}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-bold">Gross Profit</TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    {formatCurrency(parseFloat(incomeStatement.gross_profit))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Expenses */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-700">Expenses</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeStatement.expenses.map((expense) => (
                  <TableRow key={expense.uuid}>
                    <TableCell>
                      <Badge variant="outline">{expense.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{expense.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(parseFloat(expense.balance))}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={2} className="font-bold">Total Expenses</TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    {formatCurrency(parseFloat(incomeStatement.total_expenses))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Net Income */}
          <div className="border-t-2 pt-4">
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
        </div>
      </CardContent>
    </Card>
  )
}
