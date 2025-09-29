import { Link, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { changePassword, fetchProfile, updateProfile } from '~/features/profileSlice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Input } from '~/components/ui/input'
import { Upload } from 'lucide-react'
import { uploadMedia } from '~/features/mediaSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateUserProfileBodySchema, type UpdateUserProfileBodyType } from '~/validateSchema/profile.chema'
import { useForm } from 'react-hook-form'
import { handleErrorApi } from '~/lib/utils'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { toast } from 'sonner'
import { ChangePasswordBodySchema, type ChangePasswordBodyType } from '~/validateSchema/auth.schema'
import { fetchEnable2FA, fetchLogout } from '~/features/authSlice'
import { getRefreshTokenFromLS, removeAccessTokenFromLS, removeRefreshTokenFromLS, removeUserFromLS } from '~/share/store'
import { Switch } from '~/components/ui/switch'
import QRCode from 'qrcode'


export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const profile = useSelector((state: RootState) => state.profile.profile)
  const media = useSelector((state: RootState) => state.media)
  const [activeTab, setActiveTab] = useState<'update' | 'password'|'security'>('update')
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  const handleUploadAvatar = (file: File) => {
      try {
        dispatch(uploadMedia({ file: file }))
    } catch (error) {
      handleErrorApi<any>({
        error: error as any,
        setError: setError
      })
    }
  }

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, setValue, watch } = useForm<UpdateUserProfileBodyType>({
    resolver: zodResolver(UpdateUserProfileBodySchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      avatar: ''
    }
  })

  const { register: registerPwd, handleSubmit: handleSubmitPwd, formState: { errors: errorsPwd, isSubmitting: isSubmittingPwd }, setError: setErrorPwd, reset: resetPwd } = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBodySchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmitPwd = async (body: ChangePasswordBodyType) => {
    try {
      dispatch(changePassword(body))
      toast('Password changed successfully!')
      resetPwd()
    } catch (error) {
      handleErrorApi<ChangePasswordBodyType>({
        error: error as any,
        setError: setErrorPwd
      })
    }
  }

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name ?? '')
      setValue('phoneNumber', profile.phoneNumber ?? '')
      setValue('avatar', profile.avatar ?? '')
    }
  }, [profile, setValue])

  useEffect(() => {
    if (media.url) {
      setValue('avatar', media.url)
    }
  }, [media.url, setValue])

  // Auto-enable 2FA and show QR if profile has totpSecret
  useEffect(() => {
    const setupQrFromProfile = async () => {
      if (profile && profile.totpSecret) {
        try {
          setIs2FAEnabled(true)
          const issuer = 'EcommerceApp'
          const label = `${issuer}:${profile.email}`
          const uri = (profile as any).otpAuthUri ?? `otpauth://totp/${encodeURIComponent(label)}?secret=${profile.totpSecret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
          const dataUrl = await QRCode.toDataURL(uri)
          setQrCodeUrl(dataUrl)
        } catch {
          // If QR generation fails, keep switch on but clear QR image
          setQrCodeUrl('')
        }
      } else {
        setIs2FAEnabled(false)
        setQrCodeUrl('')
      }
    }
    setupQrFromProfile()
  }, [profile])

  const onSubmit = async (body:UpdateUserProfileBodyType)=>{
    try {
      dispatch(updateProfile(body))
      toast('Updated Account Success !')
    } catch (error) {
      handleErrorApi<UpdateUserProfileBodyType>({
        error: error as any,
        setError: setError
      })
    }
  }

  const handleLogout = async () => {
    try {
      dispatch(fetchLogout({ refreshToken: getRefreshTokenFromLS() }))
      removeRefreshTokenFromLS()
      removeAccessTokenFromLS()
      removeUserFromLS()
      toast('Logout successfully!')
      navigate('/login')
    } catch (error) {
      handleErrorApi<any>({
        error: error as any,
        setError: setError
      })
    }
  }

  const handleToggle2FA = async (checked: boolean) => {
    try {
      setIs2FAEnabled(checked)
      if (checked) {
        const resp = await dispatch(fetchEnable2FA({})).unwrap()
        if (resp?.uri) {
          const dataUrl = await QRCode.toDataURL(resp.uri)
          setQrCodeUrl(dataUrl)
          toast('2FA enabled. Scan the QR with your authenticator app.')
        }
      } else {
        setQrCodeUrl('')
      }
    } catch (error) {
      handleErrorApi<any>({
        error: error as any,
        setError: setError
      })
      setIs2FAEnabled(false)
      setQrCodeUrl('')
    }
  }



  

	const inputCls = 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
	return (
		<div className='container mx-auto px-4 py-6 md:py-8'>
			{/* Breadcrumbs */}
			<nav className='text-xs text-slate-500 mb-4'>
				<Link to='/'>Home</Link>
				<span className='mx-1'>›</span>
				<span className='text-slate-700'>My account</span>
			</nav>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Sidebar */}
				<aside className='rounded-xl ring-1 ring-slate-200 bg-white h-max order-2 lg:order-none lg:sticky lg:top-28'>
					<div className='px-4 py-4 flex items-center gap-3 border-b'>
						<div className='h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-slate-600 font-semibold'>
              {profile?.avatar ? <AvatarImage src={profile.avatar} /> : <span>👤</span>}
						</div>
						<div>
							<p className='text-sm font-medium text-slate-900'>{profile?.name ?? 'Guest'}</p>
							{profile?.email && <p className='text-xs text-slate-500'>{profile.email}</p>}
						</div>
					</div>
					<nav className='py-2'>
						<ul className='text-sm'>
							{[
								{ key: 'update', label: 'Update Account' },
								{ key: 'password', label: 'Change Password' },
								{ key: 'security', label: 'Two-Factor Authentication (2FA)' },
							].map((item) => (
								<li key={item.key} className='px-4'>
									<button
										type='button'
										onClick={() => setActiveTab(item.key as 'update' | 'password' | 'security')}
										className={`w-full text-left block px-3 py-2 rounded-md transition-colors ${activeTab === item.key ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
									>
										{item.label}
									</button>
								</li>
							))}
						</ul>
						<div className='px-4 py-2 border-t mt-2'>
							<button className='w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-sm text-rose-600' onClick={handleLogout}>Log out</button>
						</div>
					</nav>
				</aside>

				{/* Main form */}
				{activeTab === 'update' && (
					<section className='rounded-xl ring-1 ring-slate-200 bg-white order-1 lg:order-none'>
						<div className='px-4 py-4 border-b'>
							<h2 className='text-sm md:text-base font-semibold text-slate-900'>Update account</h2>
						</div>
						<div className='p-4 grid grid-cols-1 gap-4'>
							<div className='grid grid-cols-1 gap-4'>
								<Field label='Name *'>
									<input className={inputCls} {...register('name')} />
									{errors.name && <p className='text-xs text-red-600 mt-1'>{errors.name.message}</p>}
								</Field>
							</div>

							<Field label='Phone Number*'>
								<input className={inputCls} {...register('phoneNumber')} />
								{errors.phoneNumber && <p className='text-xs text-red-600 mt-1'>{errors.phoneNumber.message}</p>}
							</Field>

							<div className='flex items-center gap-6'>
								<div className='flex gap-2 items-start justify-start'>
										<Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
											<AvatarImage src={media.url || profile?.avatar || ''} />
											<AvatarFallback className='rounded-none'>{profile?.name || 'Avatar'}</AvatarFallback>
										</Avatar>
										<Input
											type='file'
											accept='image/*'
											onChange={(e) => {
												const file = e.target.files?.[0]
												if (file) {
													handleUploadAvatar(file)
												}
											}}
											className='hidden'
										/>
										<button
											className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
											type='button'
											onClick={() => {
												const input = document.createElement('input')
												input.type = 'file'
												input.accept = 'image/*'
												input.onchange = (e) => {
													const file = (e.target as HTMLInputElement).files?.[0]
													if (file) {
														handleUploadAvatar(file)
													}
												}
												input.click()
											}}
										>
											<Upload className='h-4 w-4 text-muted-foreground' />
											<span className='sr-only'>Tải lên</span>
										</button>
								</div>
							</div>

							<Field label='Avatar URL'>
								<input className={inputCls} value={watch('avatar')} readOnly {...register('avatar')} />
								{errors.avatar && <p className='text-xs text-red-600 mt-1'>{errors.avatar.message}</p>}
							</Field>
							
							<div>
								<Button variant='outline' className='text-slate-900' onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>{isSubmitting ? <LoadingSpinner /> : 'Update'}</Button>
							</div>
						</div>
					</section>
				)}

				{activeTab === 'password' && (
					<section className='rounded-xl ring-1 ring-slate-200 bg-white order-1 lg:order-none'>
						<div className='px-4 py-4 border-b'>
							<h2 className='text-sm md:text-base font-semibold text-slate-900'>Change password</h2>
						</div>
						<div className='p-4 grid grid-cols-1 gap-4'>
							<Field label='Current password *'>
								<input className={inputCls} type='password' {...registerPwd('password', { required: 'Current password is required' })} />
								{errorsPwd.password && <p className='text-xs text-red-600 mt-1'>{errorsPwd.password.message}</p>}
							</Field>

							<Field label='New password *'>
								<input className={inputCls} type='password' {...registerPwd('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
								{errorsPwd.newPassword && <p className='text-xs text-red-600 mt-1'>{errorsPwd.newPassword.message}</p>}
							</Field>

							<Field label='Confirm new password *'>
								<input className={inputCls} type='password' {...registerPwd('confirmPassword', { required: 'Confirm password is required' })} />
								{errorsPwd.confirmPassword && <p className='text-xs text-red-600 mt-1'>{errorsPwd.confirmPassword.message}</p>}
							</Field>

							<div>
								<Button variant='outline' className='text-slate-900' onClick={handleSubmitPwd(onSubmitPwd)} disabled={isSubmittingPwd}>{isSubmittingPwd ? <LoadingSpinner /> : 'Change password'}</Button>
							</div>
						</div>
					</section>
				)}

				{activeTab === 'security' && (
					<section className='rounded-xl ring-1 ring-slate-200 bg-white order-1 lg:order-none'>
						<div className='px-4 py-4 border-b'>
							<h2 className='text-sm md:text-base font-semibold text-slate-900'>Two-Factor Authentication (2FA)</h2>
						</div>
						<div className='p-4 grid grid-cols-1 gap-4'>
							<div className='flex items-center justify-between rounded-md border px-3 py-2'>
								<div>
									<p className='text-sm font-medium text-slate-900'>Enable 2FA</p>
									<p className='text-xs text-slate-500'>Protect your account by requiring a code from an authenticator app.</p>
								</div>
								<Switch checked={is2FAEnabled} onCheckedChange={handleToggle2FA} />
							</div>

							{is2FAEnabled && (
								<div className='rounded-md border p-4'>
									<p className='text-sm text-slate-700 mb-3'>Scan this QR code with Google Authenticator, 1Password, or Authy:</p>
									{qrCodeUrl ? (
										<img src={qrCodeUrl} alt='2FA QR Code' className='w-40 h-40' />
									) : (
										<p className='text-xs text-slate-500'>Generating QR code...</p>
									)}
								</div>
							)}
						</div>
					</section>
				)}
			</div>
		</div>
	)
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<label className='block text-xs text-slate-700 mb-1'>{label}</label>
			{children}
			</div>
	)
}
