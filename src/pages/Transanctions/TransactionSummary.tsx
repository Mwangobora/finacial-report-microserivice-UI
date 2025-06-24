import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/utils/FormatMoney"
import type { Transaction } from "@/types"

interface TransactionSummaryProps {
  transactions: Transaction[]
}

export function TransactionSummary({ transactions }: TransactionSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{transactions.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Debits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(
              transactions.filter((t) => t.tx_type === "dr").reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(
              transactions.filter((t) => t.tx_type === "cr").reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
