import { Link } from 'react-router'
import { Search, Bell, Settings, ChevronDown, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TopBarAdmin() {
	const [dark, setDark] = useState<boolean>(() => {
		try {
			return document.documentElement.classList.contains('dark')
		} catch {
			return false
		}
	})

	useEffect(() => {
		try {
			const root = document.documentElement
			if (dark) {
				root.classList.add('dark')
				localStorage.setItem('theme', 'dark')
			} else {
				root.classList.remove('dark')
				localStorage.setItem('theme', 'light')
			}
		} catch {/* ignore */}
	}, [dark])

	useEffect(() => {
		try {
			const saved = localStorage.getItem('theme')
			if (saved === 'dark') setDark(true)
		} catch {/* ignore */}
	}, [])

	return (
		<header className='sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-900'>
			<div className='h-16 px-4 flex items-center gap-4'>
				<Link to='/manage/dashboard' className='flex items-center gap-2 font-semibold text-slate-900 dark:text-white'>
					<span className='inline-flex items-center justify-center h-8 w-8 rounded-md bg-emerald-50 text-emerald-600 font-bold'>D</span>
					<span className='hidden md:inline'>DEALPORT</span>
				</Link>
				<div className='flex-1' />
				<div className='ml-auto flex items-center gap-2 md:gap-4'>
					<label className='relative hidden md:block w-64'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
						<input
							type='text'
							placeholder='Search data, users, or reports'
							className='w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300'
						/>
					</label>
					<button
						className='h-9 w-9 grid place-items-center rounded-md border border-slate-200 hover:bg-slate-50'
						onClick={() => setDark((v) => !v)}
						aria-label='Toggle dark mode'
					>
						{dark ? <Sun className='h-4 w-4 text-slate-700' /> : <Moon className='h-4 w-4 text-slate-700' />}
					</button>
					<button className='h-9 w-9 grid place-items-center rounded-md border border-slate-200 hover:bg-slate-50'>
						<Bell className='h-4 w-4 text-slate-600' />
					</button>
					<button className='h-9 w-9 grid place-items-center rounded-md border border-slate-200 hover:bg-slate-50'>
						<Settings className='h-4 w-4 text-slate-600' />
					</button>
					<button className='h-9 px-2 flex items-center gap-2 rounded-md border border-slate-200 hover:bg-slate-50'>
						<span className='h-6 w-6 grid place-items-center rounded-full bg-slate-100 text-slate-700 text-xs'>👤</span>
						<span className='hidden md:inline text-sm text-slate-700'>Admin</span>
						<ChevronDown className='h-4 w-4 text-slate-500' />
					</button>
				</div>
			</div>
		</header>
	)
}
