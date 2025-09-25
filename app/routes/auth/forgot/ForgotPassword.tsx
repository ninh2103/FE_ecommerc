import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'

export default function ForgotPasswordPage() {
	const inputCls = 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2'
	return (
		<div className='container mx-auto px-4 py-10'>
			<div className='mx-auto w-full max-w-md'>
				<div className='text-center mb-6'>
					<h1 className='text-2xl font-extrabold text-slate-900'>Forgot Password</h1>
					<p className='mt-1 text-xs text-slate-600'>Enter your email to receive an OTP code, then set a new password.</p>
				</div>

				<form className='space-y-4'>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Email address *</label>
						<input type='email' className={inputCls} placeholder='you@example.com' />
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>OTP Code *</label>
						<input className={inputCls} placeholder='6-digit code' />
						<div className='mt-1'>
							<Button variant='outline' type='button' className='w-full text-slate-900'>Send/Resend OTP</Button>
						</div>
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>New password *</label>
						<input type='password' className={inputCls} placeholder='' />
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Confirm password *</label>
						<input type='password' className={inputCls} placeholder='' />
					</div>

					<Button className='w-full h-10 bg-purple-600 hover:bg-purple-700 text-white'>Reset password</Button>
				</form>

				<div className='mt-6 text-center text-xs text-slate-600'>
					Remembered your password? <Link to='/login' className='underline'>Back to Login</Link>
				</div>
			</div>
		</div>
	)
}
