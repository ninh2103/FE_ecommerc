import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ForgotPasswordBodySchema, SendOTPBodySchema, type ForgotPasswordBodyType, type SendOTPBodyType } from '~/validateSchema/auth.schema'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'
import { fetchForgotPassword, fetchSendOtpCode } from '~/features/authSlice'
import { handleErrorApi } from '~/lib/utils'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, getValues  } = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBodySchema),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const formSendOTP = useForm<SendOTPBodyType>({
		resolver: zodResolver(SendOTPBodySchema),
		defaultValues: {
			email: '',
			type: 'FORGOT_PASSWORD',
		},
	})


  const onSubmit = async (body: ForgotPasswordBodyType) => {
    try {
      const res = await dispatch(fetchForgotPassword(body)).unwrap()
      console.log(res)
    } catch (error) {
      handleErrorApi<ForgotPasswordBodyType>({
        error: error as any,
        setError,
      })
    }
  }

  const handleSendOtp = async () => {
    try {
      const email = getValues('email')
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

	const inputCls = 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2'
	return (
		<div className='container mx-auto px-4 py-10'>
			<div className='mx-auto w-full max-w-md'>
				<div className='text-center mb-6'>
					<h1 className='text-2xl font-extrabold text-slate-900'>Forgot Password</h1>
					<p className='mt-1 text-xs text-slate-600'>Enter your email to receive an OTP code, then set a new password.</p>
				</div>

				<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div>
						<label className='block text-xs text-slate-700 mb-1'>Email address *</label>
						<div className='flex gap-2'>
							<input type='email' className={`${inputCls} flex-1`} placeholder='' {...register('email')} />
							<Button type='button' onClick={handleSendOtp} className='shrink-0 h-9 px-3 bg-slate-900 hover:bg-slate-700 text-white'>{formSendOTP.formState.isSubmitting ? <LoadingSpinner /> : 'Send'}</Button>
						</div>
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>OTP Code *</label>
						<input className={inputCls} placeholder='6-digit code' {...register('code')} />
						{errors.code && <p className='text-red-500'>{errors.code.message}</p>}
						
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>New password *</label>
						<input type='password' className={inputCls} placeholder='' {...register('newPassword')} />
						{errors.newPassword && <p className='text-red-500'>{errors.newPassword.message}</p>}
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Confirm password *</label>
						<input type='password' className={inputCls} placeholder='' {...register('confirmNewPassword')} />
						{errors.confirmNewPassword && <p className='text-red-500'>{errors.confirmNewPassword.message}</p>}
					</div>

					<Button className='w-full h-10 bg-purple-600 hover:bg-purple-700 text-white' disabled={isSubmitting}>{isSubmitting ? <LoadingSpinner /> : 'Reset password'}</Button>
				</form>

				<div className='mt-6 text-center text-xs text-slate-600'>
					Remembered your password? <Link to='/login' className='underline'>Back to Login</Link>
				</div>
			</div>
		</div>
	)
}
