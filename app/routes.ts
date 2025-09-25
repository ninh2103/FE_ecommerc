import { type RouteConfig } from "@react-router/dev/routes";

export default [
	{
		path: '/',
		file: 'layouts/RootLayout.tsx',
		children: [
			{ index: true, file: 'routes/pages/home.tsx' },
			{ path: 'products', file: 'routes/pages/products/Product-List.tsx' },
		],
    
	},
] satisfies RouteConfig;
