import { Link, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'
import { LoginBodySchema, SendOTPBodySchema, type LoginBodyType } from '~/validateSchema/auth.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchLogin, fetchSendOtpCode } from '~/features/authSlice'
import type { LoginResponseType, SendOTPBodyType } from '~/validateSchema/auth.schema'
import { setAccessTokenToLS, setRefreshTokenToLS, setUserToLS } from '~/share/store'
import { handleErrorApi } from '~/lib/utils'
import { toast } from 'sonner'
import { PATH } from '~/constant/path'
import { LoadingSpinner } from '~/components/ui/loading-spinner'

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const formSendOTP = useForm<SendOTPBodyType>({
    resolver: zodResolver(SendOTPBodySchema),
    defaultValues: {
      email: '',
      type: 'LOGIN'
    }
  })

  const onSubmit = async (body: LoginBodyType) => {
    try {
      const res: LoginResponseType = await dispatch(fetchLogin(body)).unwrap()
      const { accessToken, refreshToken, user } = res
      setAccessTokenToLS(accessToken)
      setRefreshTokenToLS(refreshToken)
      setUserToLS({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleId
      })
      toast('Đăng Nhập Thành Công!')
      navigate(PATH.HOME)
    } catch (err) {
      handleErrorApi<LoginBodyType>({
        error: err,
        setError,
        duration: 4000,
        showToastForFieldError: true
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
  const inputCls =
    'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2'
  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='mx-auto w-full max-w-md'>
        {/* Tabs */}
        <div className='flex items-center justify-center gap-6 mb-6'>
          <h1 className='text-2xl font-extrabold text-slate-900'>Login</h1>
          <Link to='/register' className='text-2xl font-semibold text-slate-400 hover:text-slate-600'>
            Register
          </Link>
        </div>

        <p className='text-center text-xs text-slate-600 mb-6'>
          If you have an account, sign in with your username or email address.
        </p>

        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className='block text-xs text-slate-700 mb-1'>Email address *</label>
            <div className='flex gap-2'>
              <input type='email' className={`${inputCls} flex-1`} placeholder='' {...register('email')} />
              <Button
                type='button'
                onClick={handleSendOtp}
                className='shrink-0 h-9 px-3 bg-slate-900 hover:bg-slate-700 text-white'
              >
                {formSendOTP.formState.isSubmitting ? <LoadingSpinner /> : 'Send'}
              </Button>
            </div>
          </div>
          {errors.email && <p className='text-xs text-red-600 mt-1'>{errors.email.message}</p>}

          <div>
            <label className='block text-xs text-slate-700 mb-1'>Password *</label>
            <input type='password' className={inputCls} placeholder='' {...register('password')} />
            {errors.password && <p className='text-xs text-red-600 mt-1'>{errors.password.message}</p>}
          </div>

          <div>
            <label className='block text-xs text-slate-700 mb-1'>OTP (if 2FA enabled)</label>
            <input
              inputMode='numeric'
              pattern='[0-9]*'
              maxLength={6}
              className={inputCls}
              placeholder='6-digit code'
              {...register('code')}
            />
            {errors.code && <p className='text-xs text-red-600 mt-1'>{errors.code.message}</p>}
          </div>

          <div className='flex items-center justify-between'>
            <label className='inline-flex items-center gap-2 text-xs text-slate-600'>
              <input type='checkbox' />
              <span>Remember me</span>
            </label>
            <Link to='/auth/forgot' className='text-xs text-slate-500 hover:text-slate-700'>
              Lost your password?
            </Link>
          </div>

          <Button className='w-full h-10 bg-purple-600 hover:bg-purple-700 text-white' disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner /> : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
