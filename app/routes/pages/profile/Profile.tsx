import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'
import { fetchProfile } from '~/features/profileSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Input } from '~/components/ui/input'
import { Upload } from 'lucide-react'
import { uploadMedia } from '~/features/mediaSlice'



export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const profile = useSelector((state: RootState) => state.profile.profile)
  const media = useSelector((state: RootState) => state.media)
  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  const handleUploadAvatar = (file: File) => {
      try {
        dispatch(uploadMedia({ file: file }))
    } catch (error) {
      console.log(error)
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
							<span>👤</span>
						</div>
						<div>
							<p className='text-xs text-slate-500'>Welcome back{profile?.name ? ',' : ''}</p>
							<p className='text-sm font-medium text-slate-900'>{profile?.name ?? 'Guest'}</p>
							{profile?.email && <p className='text-xs text-slate-500'>{profile.email}</p>}
						</div>
					</div>
					<nav className='py-2'>
						<ul className='text-sm'>
							{['Dashboard','Orders','Downloads','Addresses','Account details','Wishlist','Compare'].map((item) => (
								<li key={item} className='px-4'>
									<a href='#' className='block px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700'>
										{item}
									</a>
								</li>
							))}
						</ul>
						<div className='px-4 py-2 border-t mt-2'>
							<button className='w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-sm text-rose-600'>Log out</button>
						</div>
					</nav>
				</aside>

				{/* Main form */}
				<section className='rounded-xl ring-1 ring-slate-200 bg-white order-1 lg:order-none'>
					<div className='px-4 py-4 border-b'>
						<h2 className='text-sm md:text-base font-semibold text-slate-900'>Update account</h2>
					</div>
					<div className='p-4 grid grid-cols-1 gap-4'>
						<div className='grid grid-cols-1 gap-4'>
							<Field label='Name *'>
								<input className={inputCls} value={profile?.name} />
							</Field>
						</div>

						<Field label='Phone Number*'>
							<input className={inputCls} value={profile?.phone} />
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
							<input className={inputCls} value={media.url || profile?.avatar || ''} readOnly />
						</Field>
						
						<div>
							<Button variant='outline' className='text-slate-900'>Become a Vendor</Button>
						</div>
					</div>
				</section>
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
