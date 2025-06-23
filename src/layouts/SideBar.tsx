import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Building, BookOpen, CreditCard, ArrowRightLeft, FileText, Menu } from "lucide-react"

const navigation = [
	{ name: "Dashboard", icon: LayoutDashboard, path: "/" },
	{ name: "Entities", icon: Building, path: "/entities" },
	{ name: "Ledgers", icon: BookOpen, path: "/ledgers" },
	{ name: "Accounts", icon: CreditCard, path: "/accounts" },
	{ name: "Transactions", icon: ArrowRightLeft, path: "/transactions" },
	{ name: "Financial Statements", icon: FileText, path: "/statements" },
]

export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean, onClose?: () => void }) {
	return (
		<div
			className={`fixed z-40 top-0 left-0 h-full w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-200 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}
		>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2 flex justify-between items-center lg:hidden">
					<span className="font-bold">Menu</span>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<Menu className="h-6 w-6" />
					</Button>
				</div>
				<div className="px-3 py-2">
					<div className="space-y-1">
						{navigation.map((item) => (
							<NavLink key={item.name} to={item.path} onClick={onClose}>
								{({ isActive }) => (
									<Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
										<item.icon
											className={`mr-2 h-4 w-4 ${isActive ? "text-blue-600" : "text-gray-400"}`}
										/>
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
