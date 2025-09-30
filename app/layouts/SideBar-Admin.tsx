import { Link, useLocation } from 'react-router'
import { useMemo, useState, useEffect } from 'react'
import type React from 'react'
import { Grid2X2, Users, CreditCard, Package, Layers, UserCog, ShoppingCart, Shield, Tags, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export default function SideBarAdmin() {
	const location = useLocation()
	const [collapsed, setCollapsed] = useState<boolean>(() => {
		try {
			return localStorage.getItem('adminSidebarCollapsed') === '1'
		} catch {
			return false
		}
	})

	useEffect(() => {
		try {
			localStorage.setItem('adminSidebarCollapsed', collapsed ? '1' : '0')
		} catch {/* ignore */}
	}, [collapsed])

	const items = useMemo(() => {
		const map: Record<string, { label: string; icon: React.ReactNode; path: string }> = {
			dashboard: { label: 'Dashboard', icon: <Grid2X2 className='h-4 w-4' />, path: '/manage/dashboard' },
			product: { label: 'Products', icon: <Package className='h-4 w-4' />, path: '/manage/product' },
			category: { label: 'Categories', icon: <Layers className='h-4 w-4' />, path: '/manage/category' },
			order: { label: 'Orders', icon: <ShoppingCart className='h-4 w-4' />, path: '/manage/order' },
			payment: { label: 'Payments', icon: <CreditCard className='h-4 w-4' />, path: '/manage/payment' },
			brand: { label: 'Brands', icon: <Tags className='h-4 w-4' />, path: '/manage/brand' },
			account: { label: 'Accounts', icon: <Users className='h-4 w-4' />, path: '/manage/account' },
			role: { label: 'Roles', icon: <UserCog className='h-4 w-4' />, path: '/manage/role' },
			permission: { label: 'Permissions', icon: <Shield className='h-4 w-4' />, path: '/manage/permission' },
			// removed: setting, profile
		}
		return Object.values(map)
	}, [])

	return (
		<aside className={`hidden md:block ${collapsed ? 'w-16' : 'w-60'} shrink-0 border-r bg-white transition-all`}>
			<div className='p-2 border-b flex items-center justify-between'>
				<span className={`text-xs uppercase tracking-wider text-slate-500 ${collapsed ? 'sr-only' : ''}`}>Main menu</span>
				<button
					type='button'
					onClick={() => setCollapsed((v) => !v)}
					className='h-8 w-8 grid place-items-center rounded-md border border-slate-200 hover:bg-slate-50'
					aria-label='Toggle sidebar'
				>
					{collapsed ? <PanelLeftOpen className='h-4 w-4 text-slate-600' /> : <PanelLeftClose className='h-4 w-4 text-slate-600' />}
				</button>
			</div>
			<nav className='p-2'>
				<ul className='space-y-1'>
					{items.map((item) => {
						const active = location.pathname.startsWith(item.path)
						return (
							<li key={item.path}>
								<Link
									to={item.path}
									className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
									title={collapsed ? item.label : undefined}
								>
									<span className='text-slate-600'>{item.icon}</span>
									{!collapsed && <span>{item.label}</span>}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</aside>
	)
}
