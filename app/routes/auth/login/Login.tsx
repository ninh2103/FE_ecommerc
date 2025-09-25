import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'

export default function LoginPage() {
	const inputCls = 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2'
	return (
		<div className='container mx-auto px-4 py-10'>
			<div className='mx-auto w-full max-w-md'>
				{/* Tabs */}
				<div className='flex items-center justify-center gap-6 mb-6'>
					<h1 className='text-2xl font-extrabold text-slate-900'>Login</h1>
					<Link to='/register' className='text-2xl font-semibold text-slate-400 hover:text-slate-600'>Register</Link>
				</div>

				<p className='text-center text-xs text-slate-600 mb-6'>If you have an account, sign in with your username or email address.</p>

				<form className='space-y-4'>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Username or email address *</label>
						<input className={inputCls} placeholder='' />
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Password *</label>
						<input type='password' className={inputCls} placeholder='' />
					</div>

					<div className='flex items-center justify-between'>
						<label className='inline-flex items-center gap-2 text-xs text-slate-600'>
							<input type='checkbox' />
							<span>Remember me</span>
						</label>
						<Link to='/auth/forgot' className='text-xs text-slate-500 hover:text-slate-700'>Lost your password?</Link>
					</div>

					<Button className='w-full h-10 bg-purple-600 hover:bg-purple-700 text-white'>Log in</Button>
				</form>
			</div>
		</div>
	)
}
