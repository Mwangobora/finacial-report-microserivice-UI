import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Building, BookOpen, CreditCard, ArrowRightLeft, FileText } from "lucide-react"

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Entities", icon: Building, path: "/entities" },
  { name: "Ledgers", icon: BookOpen, path: "/ledgers" },
  { name: "Accounts", icon: CreditCard, path: "/accounts" },
  { name: "Transactions", icon: ArrowRightLeft, path: "/transactions" },
  { name: "Financial Statements", icon: FileText, path: "/statements" },
]

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.path}>
                {({ isActive }) => (
                  <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
