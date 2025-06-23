import { Building2, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown"

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile menu icon */}
        {onMenuClick && (
          <button
            className="mr-2 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="font-bold">Financial Reporting System</span>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <ThemeToggle />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  )
}
