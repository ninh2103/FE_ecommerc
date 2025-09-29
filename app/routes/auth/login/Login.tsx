import { Link, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '~/store'
import { LoginBodySchema, type LoginBodyType } from '~/validateSchema/auth.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchLogin } from '~/features/authSlice'
import type { LoginResponseType } from '~/validateSchema/auth.schema'
import { setAccessTokenToLS, setRefreshTokenToLS, setUserToLS } from '~/share/store'
import { handleErrorApi } from '~/lib/utils'
import { toast } from 'sonner'
import { PATH } from '~/constant/path'
import { LoadingSpinner } from '~/components/ui/loading-spinner'



export default function LoginPage() {
	const dispatch = useDispatch<AppDispatch>()
const navigate = useNavigate()


  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (body:LoginBodyType)=>{
    try {
      const res: LoginResponseType = await dispatch(fetchLogin(body)).unwrap()
      const {accessToken,refreshToken,user} = res
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
    } catch (err: unknown) {
      handleErrorApi<LoginBodyType>({
        error: err as any,
        setError: setError
      })
    }
  }
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

				<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Username or email address *</label>
						<input className={inputCls} placeholder='' {...register('email')} />
            {errors.email && <p className='text-xs text-red-600 mt-1'>{errors.email.message}</p>}
					</div>
					<div>
						<label className='block text-xs text-slate-700 mb-1'>Password *</label>
						<input type='password' className={inputCls} placeholder='' {...register('password')} />
            {errors.password && <p className='text-xs text-red-600 mt-1'>{errors.password.message}</p>}
					</div>

					<div className='flex items-center justify-between'>
						<label className='inline-flex items-center gap-2 text-xs text-slate-600'>
							<input type='checkbox' />
							<span>Remember me</span>
						</label>
						<Link to='/auth/forgot' className='text-xs text-slate-500 hover:text-slate-700'>Lost your password?</Link>
					</div>

					<Button className='w-full h-10 bg-purple-600 hover:bg-purple-700 text-white' disabled={isSubmitting}>{isSubmitting ? <LoadingSpinner /> : 'Log in'}</Button>
				</form>
			</div>
		</div>
	)
}
