import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '../../../components/ui/button'

type Product = {
	id: string
	name: string
	price: number
	originalPrice?: number
	rating: number
	reviews: number
	image: string
	badge?: string
}

const products: Product[] = [
	{
		id: '1',
		name: 'Fresh Organic Bananas',
		price: 2.99,
		originalPrice: 4.99,
		rating: 4.5,
		reviews: 128,
		image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=800&auto=format&fit=crop',
		badge: 'Sale'
	},
	{
		id: '2',
		name: 'Premium Ground Coffee',
		price: 12.99,
		rating: 4.8,
		reviews: 89,
		image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: '3',
		name: 'Organic Honey',
		price: 8.49,
		originalPrice: 10.99,
		rating: 4.6,
		reviews: 203,
		image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop',
		badge: '20% Off'
	},
	{
		id: '4',
		name: 'Fresh Milk 1L',
		price: 3.29,
		rating: 4.4,
		reviews: 156,
		image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: '5',
		name: 'Whole Grain Bread',
		price: 4.99,
		rating: 4.3,
		reviews: 92,
		image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: '6',
		name: 'Greek Yogurt',
		price: 5.49,
		originalPrice: 6.99,
		rating: 4.7,
		reviews: 167,
		image: 'https://images.unsplash.com/photo-1571212515410-1e2d4ea1b83e?q=80&w=800&auto=format&fit=crop',
		badge: 'New'
	},
	{
		id: '7',
		name: 'Fresh Strawberries',
		price: 6.99,
		rating: 4.5,
		reviews: 134,
		image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800&auto=format&fit=crop'
	},
	{
		id: '8',
		name: 'Extra Virgin Olive Oil',
		price: 15.99,
		originalPrice: 19.99,
		rating: 4.9,
		reviews: 78,
		image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop',
		badge: 'Best Deal'
	}
]

export default function ProductSection() {
	return (
		<section className='container mx-auto px-4 py-8 md:py-10 lg:py-12'>
			<div className='flex items-center justify-between gap-3 mb-6 md:mb-8'>
				<div className='flex items-baseline gap-3'>
					<h2 className='text-lg md:text-xl font-semibold text-slate-900'>Featured Products</h2>
				</div>
				<Button variant='outline' className='gap-1 text-slate-900'>
					<span>View All</span>
					<span aria-hidden>→</span>
				</Button>
			</div>

			{/* Grid: 4 columns on lg+ -> 2 rows for 8 items */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	)
}

function ProductCard({ product }: { product: Product }) {
	return (
		<div className='group relative bg-white rounded-xl ring-1 ring-slate-100 hover:ring-slate-200 transition-all duration-200 hover:shadow-lg'>
			{/* Badge */}
			{product.badge && (
				<div className='absolute top-3 left-3 z-10'>
					<span className='inline-block px-2 py-1 text-xs font-semibold rounded-md bg-rose-100 text-rose-700'>
						{product.badge}
					</span>
				</div>
			)}

			{/* Wishlist button */}
			<button className='absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm ring-1 ring-slate-200 hover:bg-rose-50 hover:ring-rose-200 transition-colors'>
				<Heart className='h-4 w-4 text-slate-600 hover:text-rose-600' />
			</button>

			{/* Product image */}
			<div className='aspect-square p-4'>
				<img
					src={product.image}
					alt={product.name}
					className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-200'
				/>
			</div>

			{/* Product info */}
			<div className='p-4 pt-0'>
				<h3 className='font-medium text-slate-900 text-sm md:text-base line-clamp-2 mb-2'>
					{product.name}
				</h3>

				{/* Rating */}
				<div className='flex items-center gap-1 mb-3'>
					<div className='flex items-center'>
						{Array.from({ length: 5 }).map((_, i) => (
							<Star
								key={i}
								className={`h-3 w-3 ${
									i < Math.floor(product.rating)
										? 'text-amber-400 fill-amber-400'
										: 'text-slate-300'
								}`}
							/>
						))}
					</div>
					<span className='text-xs text-slate-500'>({product.reviews})</span>
				</div>

				{/* Price */}
				<div className='flex items-center justify-between mb-3'>
					<div className='flex items-baseline gap-2'>
						<span className='text-lg font-semibold text-slate-900'>${product.price}</span>
						{product.originalPrice && (
							<span className='text-sm text-slate-400 line-through'>${product.originalPrice}</span>
						)}
					</div>
				</div>

				{/* Add to cart button */}
				<Button className='w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white'>
					<ShoppingCart className='h-4 w-4' />
					<span>Add to Cart</span>
				</Button>
			</div>
		</div>
	)
}
