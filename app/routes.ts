import { type RouteConfig } from "@react-router/dev/routes";

export default [
	{
		path: '/',
		file: 'layouts/RootLayout.tsx',
		children: [
			{ index: true, file: 'routes/pages/home.tsx' },
			{ path: 'products', file: 'routes/pages/products/Product-List.tsx' },
			{ path: 'product/:id', file: 'routes/pages/productdetail/Product-Detail.tsx' },
			{ path: 'cart', file: 'routes/pages/cart/Cart.tsx' },
			{ path: 'payment', file: 'routes/pages/payment/Payment.tsx' },
		],
	},
] satisfies RouteConfig;
