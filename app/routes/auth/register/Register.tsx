import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'

export default function RegisterPage() {
	const inputCls = 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2'
	return (
		<div className='container mx-auto px-4 py-10'>
			<div className='mx-auto w-full max-w-md'>
				{/* Tabs */}
				<div className='flex items-center justify-center gap-6 mb-4'>
					<Link to='/login' className='text-2xl font-semibold text-slate-400 hover:text-slate-600'>Login</Link>
					<h1 className='text-2xl font-extrabold text-slate-900'>Register</h1>
				</div>

				<p className='text-center text-xs text-slate-600 mb-6'>There are many advantages to creating an account: the payment process is faster, shipment tracking is possible and much more.</p>

				<form className='space-y-4'>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Username *</label>
						<input className={inputCls} placeholder='' />
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Email address *</label>
						<input type='email' className={inputCls} placeholder='' />
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Password *</label>
						<input type='password' className={inputCls} placeholder='' />
					</div>

					<div className='space-y-2'>
						<label className='flex items-center gap-2 text-xs text-slate-700'>
							<input type='radio' name='role' defaultChecked />
							<span>I am a customer</span>
						</label>
						<label className='flex items-center gap-2 text-xs text-slate-700'>
							<input type='radio' name='role' />
							<span>I am a vendor</span>
						</label>
					</div>

					<p className='text-xs text-slate-600'>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a className='underline' href='#'>privacy policy</a>.</p>

					<Button className='w-full h-10 bg-purple-600 hover:bg-purple-700 text-white mt-1'>Register</Button>
				</form>
			</div>
		</div>
	)
}
