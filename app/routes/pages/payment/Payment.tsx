import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'

export default function PaymentPage() {
	const items = [
		{ id: '1', title: 'Marketside Fresh Organic Bananas, Bunch × 1', price: 0.89 },
	]
	const shippingMethods = [
		{ id: 'flat', label: 'Flat rate', price: 15.5 },
		{ id: 'pickup', label: 'Local pickup', price: 0 },
	]
	const [shipping, setShipping] = useState('flat')
	const subTotal = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items])
	const shippingPrice = useMemo(() => shippingMethods.find((m) => m.id === shipping)?.price ?? 0, [shipping])
	const total = subTotal + shippingPrice

	const inputCls = 'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2'
	const checkLbl = 'flex items-center gap-2 text-xs text-slate-700'

	return (
		<div className='container mx-auto px-4 py-6 md:py-8'>
			<nav className='text-xs text-slate-500 mb-4'>
				<Link to='/'>Home</Link>
				<span className='mx-1'>›</span>
				<span className='text-slate-700'>Checkout</span>
			</nav>

			<div className='rounded-md border text-sm text-slate-700 bg-slate-50 px-3 py-2 mb-3'>
				Have a coupon? Click here to enter your code
			</div>
			<div className='rounded-md border text-xs text-rose-600 bg-rose-50 px-3 py-2 mb-6'>
				Add <span className='font-semibold'>$299.11</span> to cart and get free shipping!
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6'>
				<section className='rounded-xl ring-1 ring-slate-200 bg-white order-1 lg:order-none'>
					<div className='px-4 py-3 border-b text-sm font-semibold text-slate-800'>Billing details</div>
					<div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
						<Field label='First name *'>
							<input className={inputCls} placeholder='' />
						</Field>
						<Field label='Last name *'>
							<input className={inputCls} placeholder='' />
						</Field>
						<Field label='Company name (optional)' className='md:col-span-2'>
							<input className={inputCls} placeholder='' />
						</Field>
						<Field label='Country / Region *' className='md:col-span-2'>
							<select className={inputCls}>
								<option>United States (US)</option>
							</select>
						</Field>
						<Field label='Street address *' className='md:col-span-2'>
							<input className={inputCls} placeholder='House number and street name' />
						</Field>
						<Field label='Apartment, suite, unit, etc. (optional)' className='md:col-span-2'>
							<input className={inputCls} placeholder='' />
						</Field>
						<Field label='Town / City *' className='md:col-span-2'>
							<input className={inputCls} placeholder='' />
						</Field>
						<Field label='State *'>
							<select className={inputCls}>
								<option>California</option>
							</select>
						</Field>
						<Field label='ZIP Code *'>
							<input className={inputCls} placeholder='' />
						</Field>
						<Field label='Phone *' className='md:col-span-2'>
							<input className={inputCls} placeholder='' />
						</Field>
						<Field label='Email address *' className='md:col-span-2'>
							<input className={inputCls} placeholder='' />
						</Field>

						<div className='md:col-span-2 space-y-2'>
							<label className={checkLbl}>
								<input type='checkbox' />
								<span>Create an account?</span>
							</label>
							<label className={checkLbl}>
								<input type='checkbox' />
								<span>Ship to a different address?</span>
							</label>
						</div>

						<Field label='Order notes (optional)' className='md:col-span-2'>
							<textarea className={inputCls} placeholder='Notes about your order, e.g. special notes for delivery.' rows={3} />
						</Field>
					</div>
				</section>

				<aside className='rounded-xl ring-1 ring-slate-200 bg-white h-max order-2 lg:order-none lg:sticky lg:top-28'>
					<div className='px-4 py-3 border-b text-sm font-semibold text-slate-800'>Your order</div>
					<div className='p-4 space-y-3 text-sm'>
						<div className='border rounded'>
							<div className='flex items-center justify-between px-3 py-2 text-xs text-slate-500 border-b'>
								<span>Product</span>
								<span>Subtotal</span>
							</div>
							{items.map((i) => (
								<div key={i.id} className='flex items-center justify-between px-3 py-2'>
									<span className='text-slate-700'>{i.title}</span>
									<span className='font-medium text-slate-900'>${i.price.toFixed(2)}</span>
								</div>
							))}
							<div className='flex items-center justify-between px-3 py-2'>
								<span className='text-slate-600'>Subtotal</span>
								<span className='font-medium text-slate-900'>${subTotal.toFixed(2)}</span>
							</div>
							<div className='px-3 py-2 space-y-1'>
								<div className='text-slate-600'>Shipping:</div>
								<div className='space-y-1'>
									{shippingMethods.map((m) => (
										<label key={m.id} className='flex items-center justify-between gap-2'>
											<span className='inline-flex items-center gap-2'>
												<input type='radio' name='shipping' checked={shipping===m.id} onChange={() => setShipping(m.id)} />
												<span className='text-sm'>{m.label}</span>
											</span>
											<span className='text-sm text-slate-600'>{m.price ? `$${m.price.toFixed(2)}` : '—'}</span>
										</label>
									))}
								</div>
							</div>
							<div className='flex items-center justify-between px-3 py-2 border-t'>
								<span className='text-slate-900 font-semibold'>Total</span>
								<span className='text-lg font-bold text-slate-900'>${total.toFixed(2)}</span>
							</div>
						</div>

						<div className='mt-4 space-y-2'>
							<label className={checkLbl}>
								<input type='radio' name='pay' defaultChecked />
								<span>Direct Bank Transfer</span>
							</label>
							<p className='text-xs text-slate-500'>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>

							<label className={checkLbl}>
								<input type='radio' name='pay' />
								<span>Check Payments</span>
							</label>
							<label className={checkLbl}>
								<input type='radio' name='pay' />
								<span>Cash On Delivery</span>
							</label>

							<p className='text-xs text-slate-500'>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a className='underline' href='#'>privacy policy</a>.</p>

							<label className={checkLbl}>
								<input type='checkbox' />
								<span>I have read and agree to the website <a className='underline' href='#'>terms and conditions</a> *</span>
							</label>

							<Button className='w-full bg-slate-900 hover:bg-slate-800 text-white mt-2'>Place order</Button>
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
	return (
		<div className={className}>
			<label className='block text-xs text-slate-700 mb-1'>{label}</label>
			{children}
		</div>
	)
}
