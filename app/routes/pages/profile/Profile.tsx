import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'

export default function ProfilePage() {
	const inputCls = 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2'
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
							<p className='text-xs text-slate-500'>Welcome back,</p>
							<p className='text-sm font-medium text-slate-900'>name@gmail.com</p>
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
						<h2 className='text-sm md:text-base font-semibold text-slate-900'>Update account to Vendor</h2>
					</div>
					<div className='p-4 grid grid-cols-1 gap-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<Field label='First Name *'>
								<input className={inputCls} />
							</Field>
							<Field label='Last Name *'>
								<input className={inputCls} />
							</Field>
						</div>

						<Field label='Last Name *'>
							<input className={inputCls} />
						</Field>

						<Field label='Shop Name *'>
							<input className={inputCls} />
						</Field>

						<Field label='Shop URL *'>
							<input className={inputCls} defaultValue='shawonetcc42fdgqf@gmail.com' />
							<p className='mt-1 text-[11px] text-slate-400'>https://klbtheme.com/grogin/store/</p>
						</Field>

						<Field label='Phone Number*'>
							<input className={inputCls} />
						</Field>

						<label className='flex items-center gap-2 text-xs text-slate-600'>
							<input type='checkbox' />
							<span>I have read and agree to the <a href='#' className='underline'>Terms & Conditions</a>.</span>
						</label>

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
