export default function AdminDashboard() {
	return (
		<div className='space-y-4'>
			<h1 className='text-xl font-semibold text-slate-900'>Dashboard</h1>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='rounded-lg border p-4'>
					<p className='text-xs text-slate-500'>Total Sales</p>
					<p className='mt-2 text-2xl font-bold text-slate-900'>$350K</p>
				</div>
				<div className='rounded-lg border p-4'>
					<p className='text-xs text-slate-500'>Total Orders</p>
					<p className='mt-2 text-2xl font-bold text-slate-900'>10.7K</p>
				</div>
				<div className='rounded-lg border p-4'>
					<p className='text-xs text-slate-500'>Pending & Canceled</p>
					<p className='mt-2 text-2xl font-bold text-slate-900'>509 / 94</p>
				</div>
			</div>
			<div className='rounded-lg border p-4 h-64 grid place-items-center text-slate-400'>
				Charts placeholder
			</div>
		</div>
	)
}