import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function Footer() {
  return (
    <footer className='bg-white border-t border-slate-200'>
      {/* Newsletter Section */}

      {/* Main Footer Content */}
      <div className='container mx-auto px-4 py-8 md:py-12 border-t border-slate-200'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
          {/* Help Column */}
          <div>
            <h4 className='font-semibold text-slate-900 mb-4'>Do You Need Help?</h4>
            <p className='text-sm text-slate-600 mb-4'>Actoseligen sy. Nokkena Nor antipol kynada Pr</p>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Phone className='h-4 w-4 text-slate-500' />
                <div>
                  <p className='text-sm text-slate-600'>Monday-Friday: 08am-8pm</p>
                  <p className='font-medium text-slate-900'>0 800 300-353</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <Mail className='h-4 w-4 text-slate-500' />
                <div>
                  <p className='text-sm text-slate-600'>Need help with your order?</p>
                  <p className='font-medium text-slate-900'>info@example.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Make Money Column */}
          <div>
            <h4 className='font-semibold text-slate-900 mb-4'>Make Money with Us</h4>
            <ul className='space-y-2 text-sm'>
              {[
                'Sell on Grogin',
                'Sell Your Services on Grogin',
                'Sell on Grogin Business',
                'Sell Your Apps on Grogin',
                'Become an Affiliate',
                'Advertise Your Products',
                'Sell-Publish with Us',
                'Become a Browse Vendor'
              ].map((link) => (
                <li key={link}>
                  <a href='#' className='text-slate-600 hover:text-slate-900 transition-colors'>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help You Column */}
          <div>
            <h4 className='font-semibold text-slate-900 mb-4'>Let Us Help You</h4>
            <ul className='space-y-2 text-sm'>
              {[
                'Accessibility Statement',
                'Your Orders',
                'Returns & Replacements',
                'Shipping Rates & Policies',
                'Refund and Return Policy',
                'Privacy Policy',
                'Terms and Conditions',
                'Cookie Settings',
                'Help Center'
              ].map((link) => (
                <li key={link}>
                  <a href='#' className='text-slate-600 hover:text-slate-900 transition-colors'>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get to Know Us Column */}
          <div>
            <h4 className='font-semibold text-slate-900 mb-4'>Get to Know Us</h4>
            <ul className='space-y-2 text-sm'>
              {[
                'Careers for Grogin',
                'About Grogin',
                'Investor Relations',
                'Grogin Devices',
                'Customer reviews',
                'Social Responsibility',
                'Store Locations'
              ].map((link) => (
                <li key={link}>
                  <a href='#' className='text-slate-600 hover:text-slate-900 transition-colors'>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* App Download Column */}
          <div>
            <h4 className='font-semibold text-slate-900 mb-4'>Download our app</h4>
            <div className='space-y-4'>
              <button className='flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full'>
                <div className='w-8 h-8 bg-slate-100 rounded flex items-center justify-center'>
                  <span className='text-xs font-bold text-slate-700'>GP</span>
                </div>
                <div className='text-left'>
                  <p className='text-xs text-slate-500'>GET IT ON</p>
                  <p className='text-sm font-medium text-slate-900'>Google Play</p>
                </div>
              </button>
              <p className='text-sm text-slate-600'>Download App Get -10% Discount</p>
              <div>
                <p className='text-sm font-medium text-slate-900 mb-3'>Follow us on social media</p>
                <div className='flex gap-3'>
                  <a href='#' className='p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors'>
                    <Facebook className='h-4 w-4' />
                  </a>
                  <a href='#' className='p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors'>
                    <Twitter className='h-4 w-4' />
                  </a>
                  <a
                    href='#'
                    className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity'
                  >
                    <Instagram className='h-4 w-4' />
                  </a>
                  <a href='#' className='p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors'>
                    <Linkedin className='h-4 w-4' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='border-t border-slate-200 bg-slate-50'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex flex-col md:flex-row items-center gap-4'>
              <p className='text-sm text-slate-600 text-center md:text-left'>
                Copyright 2023 © Shopstore WooCommerce WordPress Theme. All right reserved. Powered by BlackAffise
                Themes.
              </p>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-semibold text-slate-700'>VISA</span>
                  <span className='text-xs font-semibold text-blue-600'>PayPal</span>
                  <span className='text-xs font-semibold text-blue-500'>Skrill</span>
                  <span className='text-xs font-semibold text-pink-600'>Klarna</span>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-4 text-sm'>
              <a href='#' className='text-slate-600 hover:text-slate-900 transition-colors'>
                Terms and Conditions
              </a>
              <a href='#' className='text-slate-600 hover:text-slate-900 transition-colors'>
                Privacy Policy
              </a>
              <a href='#' className='text-slate-600 hover:text-slate-900 transition-colors'>
                Order Tracking
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
