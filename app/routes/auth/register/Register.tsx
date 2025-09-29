import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'
import { RegisterBodySchema, SendOTPBodySchema, type RegisterBodyType, type SendOTPBodyType } from '~/validateSchema/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { fetchRegister, fetchSendOtpCode } from '~/features/authSlice'
import { toast } from 'sonner'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { handleErrorApi } from '~/lib/utils'

export default function RegisterPage() {
	const dispatch = useDispatch<AppDispatch>()

	const formSendOTP = useForm<SendOTPBodyType>({
		resolver: zodResolver(SendOTPBodySchema),
		defaultValues: {
			email: '',
			type: 'REGISTER',
		},
	})

	const formRegister = useForm<RegisterBodyType>({
		resolver: zodResolver(RegisterBodySchema),
		defaultValues: {
			email: '',
			code: '',
			confirmPassword: '',
			name: '',
			password: '',
			phoneNumber: '',
		},
	})

	const handleSendOtp = async () => {
    try {
      const email = formRegister.getValues('email')
      formSendOTP.setValue('email', email, { shouldValidate: true, shouldDirty: true })

  
      const isValid = await formSendOTP.trigger()
      if (!isValid) return
  
      await dispatch(fetchSendOtpCode(formSendOTP.getValues())).unwrap()
  
      toast.success('OTP đã được gửi đến email của bạn!')
    } catch (err: unknown) {
      handleErrorApi<SendOTPBodyType>({
        error: err as any,
        setError: formSendOTP.setError
      })
      toast.error('Gửi OTP thất bại, vui lòng thử lại!')
    }
  }
  

	const handleRegister = formRegister.handleSubmit(async (data) => {
		await dispatch(fetchRegister(data))
	})

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

				<form className='space-y-4' onSubmit={handleRegister}>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Name *</label>
						<input className={inputCls} placeholder='' {...formRegister.register('name')} />
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Email address *</label>
						<div className='flex gap-2'>
							<input type='email' className={`${inputCls} flex-1`} placeholder='' {...formRegister.register('email')} />
							<Button type='button' onClick={handleSendOtp} className='shrink-0 h-9 px-3 bg-slate-900 hover:bg-slate-700 text-white'>{formSendOTP.formState.isSubmitting ? <LoadingSpinner /> : 'Send'}</Button>
						</div>
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Password *</label>
						<input type='password' className={inputCls} placeholder='' {...formRegister.register('password')} />
					</div>

					<div>
						<label className='block text-xs text-slate-700 mb-1'>Confirm Password *</label>
						<input type='password' className={inputCls} placeholder='' {...formRegister.register('confirmPassword')} />
					</div>

					<div>
						<label className='block text-xs text-slate-700 mb-1'>OTP *</label>
						<input type='text' inputMode='numeric' className={inputCls} placeholder='' {...formRegister.register('code')} />
					</div>

					<div>
						<label className='block text-xs text-slate-700 mb-1'>Phone Number *</label>
						<input className={inputCls} placeholder='' {...formRegister.register('phoneNumber')} />
					</div>

					<p className='text-xs text-slate-600'>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a className='underline' href='#'>privacy policy</a>.</p>

					<Button type='submit' className='w-full h-10 bg-purple-600 hover:bg-purple-700 text-white mt-1'>{formRegister.formState.isSubmitting ? <LoadingSpinner /> : 'Register'}</Button>
				</form>
			</div>
		</div>
	)
}
