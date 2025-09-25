import { CreditCard, PackageSearch, ShieldCheck, Truck } from 'lucide-react'
import { Button } from '../../../components/ui/button'

export default function FeaturesSection() {
	return (
		<section className='container mx-auto px-4 py-8 md:py-12 lg:py-16'>
			{/* Top features */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
				<FeatureItem
					icon={<CreditCard className='h-5 w-5 text-indigo-600' />}
					title='Payment only online'
					description='Tasġlörsmat betenødesiġn. Mobile checkout. Ylig kärtörpa.'
				/>
				<FeatureItem
					icon={<PackageSearch className='h-5 w-5 text-violet-600' />}
					title='New stocks and sales'
					description='Tasġlörsmat betenødesiġn. Mobile checkout. Ylig kärtörpa.'
				/>
				<FeatureItem
					icon={<ShieldCheck className='h-5 w-5 text-emerald-600' />}
					title='Quality assurance'
					description='Tasġlörsmat betenødesiġn. Mobile checkout. Ylig kärtörpa.'
				/>
				<FeatureItem
					icon={<Truck className='h-5 w-5 text-amber-600' />}
					title='Delivery from 1 hour'
					description='Tasġlörsmat betenødesiġn. Mobile checkout. Ylig kärtörpa.'
				/>
			</div>

			{/* Bottom promos */}
			<div className='mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
				<PromoCard
					badge='Only This Week'
					title='Quality eggs at an affordable price'
					description='Eat one every day'
					image='https://images.unsplash.com/photo-1517959105821-eaf2591984ad?q=80&w=1200&auto=format&fit=crop'
				/>
				<PromoCard
					badge='Only This Week'
					title='Snacks that nourishes our mind and body'
					description='Shine the morning…'
					image='https://images.unsplash.com/photo-1591209627719-76661d4d8a78?q=80&w=1200&auto=format&fit=crop'
				/>
				<PromoCard
					badge='Only This Week'
					title='Unbeatable quality, unbeatable prices.'
					description="Only this week. Don't miss…"
					image='https://images.unsplash.com/photo-1614102073836-030967418971?q=80&w=1200&auto=format&fit=crop'
				/>
			</div>
		</section>
	)
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
	return (
		<div className='flex items-start gap-3 rounded-xl bg-white p-3 md:p-4 shadow-sm/50 ring-1 ring-slate-100'>
			<div className='shrink-0 rounded-lg bg-slate-50 p-2'>{icon}</div>
			<div className='leading-tight'>
				<div className='text-sm font-semibold text-slate-900'>{title}</div>
				<p className='mt-1 text-xs text-slate-500'>{description}</p>
			</div>
		</div>
	)
}

function PromoCard({ badge, title, description, image }: { badge: string; title: string; description: string; image: string }) {
	return (
		<div className='rounded-xl bg-white ring-1 ring-slate-100 p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center'>
			<div>
				<span className='inline-block text-[11px] font-semibold text-rose-600'>
					{badge}
				</span>
				<h3 className='mt-2 text-lg md:text-xl font-semibold text-slate-900'>{title}</h3>
				<p className='mt-1 text-xs text-slate-500'>{description}</p>
				<div className='mt-3'>
					<Button variant='outline' className='gap-1 text-slate-900'>
						<span>Shop Now</span>
						<span aria-hidden>→</span>
					</Button>
				</div>
			</div>
			<div className='relative aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden bg-slate-50'>
				<img src={image} alt='' className='absolute inset-0 h-full w-full object-cover' />
			</div>
		</div>
	)
}
