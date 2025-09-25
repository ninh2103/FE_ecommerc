import { Menu, Search, SlidersHorizontal, User, ShoppingCart, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Header() {
	return (
    <div className='fixed top-0 left-0 right-0 z-50'>
		<header className='w-full shadow-sm'>
			{/* Main header bar */}
			<div className='bg-white'>
				<div className='max-w-screen-2xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-3 flex items-center gap-3 sm:gap-4'>
					<Button variant='outline' size='icon' className='shrink-0'>
						<Menu className='h-5 w-5' />
					</Button>

					<div className='flex items-center gap-2 min-w-[100px] sm:min-w-[120px]'>
						<div className='w-7 h-7 rounded-md bg-blue-100 grid place-items-center'>
							<ShoppingBag className='h-4 w-4 text-blue-600' />
						</div>
						<div className='text-xl sm:text-2xl font-bold text-blue-600'>MegaMart</div>
					</div>

					{/* Search: icon on mobile, input on md+ */}
					<div className='md:hidden ml-auto'>
						<Button variant='outline' size='icon' className='rounded-full'>
							<Search className='h-4 w-4' />
						</Button>
					</div>
					<div className='hidden md:flex flex-1 items-center justify-center'>
						<div className='relative w-full max-w-[680px]'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
							<Input
								type='text'
								placeholder='Search essentials, groceries and more...'
								className='pl-10 pr-24 rounded-full bg-slate-50'
							/>
							<div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1.5'>
								<Button variant='outline' size='icon' className='rounded-full'>
									<SlidersHorizontal className='h-4 w-4' />
								</Button>
							</div>
						</div>
					</div>

					<div className='ml-auto flex items-center gap-2 sm:gap-4 '>
						<Button variant='ghost' className='gap-2'>
							<User className='h-5 w-5' />
							<span className='hidden sm:inline text-sm'>Sign Up/Sign In</span>
						</Button>
						<Button variant='ghost' className='gap-2'>
							<ShoppingCart className='h-5 w-5' />
							<span className='hidden sm:inline text-sm'>Cart</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Categories bar */}
			
		</header>
    </div>
	);
}

