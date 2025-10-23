import { type RouteConfig } from '@react-router/dev/routes'

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
      { path: 'profile', file: 'routes/pages/profile/Profile.tsx' },
      { path: 'login', file: 'routes/auth/login/Login.tsx' },
      { path: 'register', file: 'routes/auth/register/Register.tsx' },
      { path: 'forgot-password', file: 'routes/auth/forgot/ForgotPassword.tsx' },
      { path: 'checkout', file: 'routes/pages/checkout/Checkout.tsx' },
      { path: 'orders', file: 'routes/pages/orders/Orders.tsx' },
      { path: 'orders/:orderId', file: 'routes/pages/orders/OrderDetail.tsx' }
    ]
  },
  {
    path: '/manage',
    file: 'routes/manage/layout.tsx',
    children: [
      { path: 'dashboard', file: 'routes/manage/dashboard/dashboard.tsx' },
      { path: 'product', file: 'routes/manage/product/Product.tsx' },
      { path: 'category', file: 'routes/manage/category/Category.tsx' },
      { path: 'order', file: 'routes/manage/order/index.tsx' },
      { path: 'payment', file: 'routes/manage/payment/index.tsx' },
      { path: 'brand', file: 'routes/manage/brand/Brand.tsx' },
      { path: 'account', file: 'routes/manage/account/Account.tsx' },
      { path: 'role', file: 'routes/manage/role/Role.tsx' },
      { path: 'permission', file: 'routes/manage/permission/Permission.tsx' }
    ]
  }
] satisfies RouteConfig
