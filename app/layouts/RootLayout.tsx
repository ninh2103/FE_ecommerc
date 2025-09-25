import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '~/components/Footer';

export default function RootLayout() {
	return (
		<div className='min-h-screen bg-white'>
			<Header />
			{/* Spacer to offset fixed header height */}
			<div className='h-20 md:h-28' />
			<main className='pt-0'>
				<Outlet />
			</main>
      <Footer/>
		</div>
	);
} 