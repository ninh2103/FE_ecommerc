import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'

type CartItem = {
	id: string
	title: string
	price: number
	qty: number
	image: string
}

const demoCart: CartItem[] = [
	{
		id: '1',
		title: 'Product 1',
		price: 100,
		qty: 1,
		image: 'https://via.placeholder.com/150',
	},
	{
		id: '2',
		title: 'Product 2',
		price: 200,
		qty: 2,
		image: 'https://via.placeholder.com/150',
	},
	{
		id: '3',
		title: 'Product 3',
		price: 300,
		qty: 3,
		image: 'https://via.placeholder.com/150',
	}
]

export default function CartPage() {
	const [items, setItems] = useState<CartItem[]>(demoCart)

	const subTotal = items.reduce((s, it) => s + it.price * it.qty, 0)
	const shipping = items.length ? 4.99 : 0
	const total = subTotal + shipping

	function updateQty(id: string, delta: number) {
		setItems((prev) =>
			prev
				.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
				.filter(Boolean) as CartItem[]
		)
	}
	function removeItem(id: string) {
		setItems((prev) => prev.filter((it) => it.id !== id))
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<nav className='text-xs text-slate-500 mb-6'>
				<Link to='/'>Home</Link>
				<span className='mx-1'>/</span>
				<span className='text-slate-700'>Cart</span>
			</nav>

			{items.length === 0 ? (
				<EmptyCart />
			) : (
				<div className='grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6'>
					<section className='rounded-xl ring-1 ring-slate-200 bg-white'>
						<div className='px-4 py-3 border-b text-sm font-semibold text-slate-800'>Shopping Cart</div>
						<div className='divide-y'>
							{items.map((it) => (
								<div key={it.id} className='p-4 flex items-center gap-3'>
									<img src={it.image} alt='' className='h-16 w-16 object-contain rounded-md ring-1 ring-slate-200' />
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-medium text-slate-900 truncate'>{it.title}</p>
										<p className='text-xs text-slate-500'>${it.price.toFixed(2)}</p>
									</div>
									<div className='flex items-center gap-3'>
										<div className='inline-flex items-center rounded border overflow-hidden'>
											<button onClick={() => updateQty(it.id, -1)} className='px-2 py-1.5 hover:bg-slate-50'>
												<Minus className='h-4 w-4' />
											</button>
											<span className='w-10 text-center text-sm'>{it.qty}</span>
											<button onClick={() => updateQty(it.id, 1)} className='px-2 py-1.5 hover:bg-slate-50'>
												<Plus className='h-4 w-4' />
											</button>
										</div>
										<div className='w-20 text-right text-sm font-semibold text-slate-900'>${(it.price * it.qty).toFixed(2)}</div>
										<button onClick={() => removeItem(it.id)} className='text-slate-500 hover:text-rose-600 p-1 rounded'>
											<Trash2 className='h-4 w-4' />
										</button>
									</div>
								</div>
							))}
						</div>
						<div className='p-4 flex items-center justify-between border-t'>
							<Link to='/products'>
								<Button variant='outline' className='text-slate-900'>Continue shopping</Button>
							</Link>
							<Button variant='ghost' className='text-rose-600 hover:bg-rose-50'>Clear cart</Button>
						</div>
					</section>

					<aside className='rounded-xl ring-1 ring-slate-200 bg-white h-max'>
						<div className='px-4 py-3 border-b text-sm font-semibold text-slate-800'>Order Summary</div>
						<div className='p-4 space-y-3 text-sm'>
							<div className='flex items-center justify-between'>
								<span className='text-slate-600'>Subtotal</span>
								<span className='font-semibold text-slate-900'>${subTotal.toFixed(2)}</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-slate-600'>Shipping</span>
								<span className='font-semibold text-slate-900'>${shipping.toFixed(2)}</span>
							</div>
							<div className='flex items-center justify-between border-t pt-3'>
								<span className='text-slate-900 font-semibold'>Total</span>
								<span className='text-lg font-bold text-slate-900'>${total.toFixed(2)}</span>
							</div>
							<Button className='w-full bg-slate-900 hover:bg-slate-800 text-white'>Proceed to Checkout</Button>
						</div>
					</aside>
				</div>
			)}
		</div>
	)
}

function EmptyCart() {
	return (
		<div className='flex flex-col items-center justify-center py-16'>
			<img
				src='https://illustrations.popsy.co/amber/empty-box-open.svg'
				alt='Empty cart'
				className='h-40 md:h-56'
			/>
			<div className='mt-4 w-full max-w-md border rounded-md px-4 py-2 text-center text-[12px] font-semibold text-rose-600'>
				YOUR CART IS CURRENTLY EMPTY.
			</div>
			<Link to='/products' className='mt-4'>
				<Button className='bg-slate-900 hover:bg-slate-800 text-white px-6'>Return to shop</Button>
			</Link>
		</div>
	)
}
