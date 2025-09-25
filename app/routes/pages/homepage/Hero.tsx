import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'

export default function Hero() {
  return (
    <div className='relative container mx-auto px-4 pt-10 md:pt-14 lg:pt-16 xl:pt-20 pb-12 md:pb-16 lg:pb-20 overflow-hidden'>
      {/* Hiệu ứng đóm bay bay */}
      <div className='absolute inset-0 pointer-events-none'>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className='absolute h-2 w-2 rounded-full bg-blue-500 opacity-50'
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className='flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10'>
        <motion.div
          className='lg:w-1/2'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight text-slate-900'>
            Get the best quality
            <br />
            products at the lowest prices
          </h1>
          <p className='text-slate-600 mb-6 text-base md:text-lg leading-relaxed max-w-2xl'>
            We have prepared special discounts for you on grocery products. Don't miss these opportunities...
          </p>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <Link to={'/'}>
              <Button
                size='lg'
                className='bg-slate-900 hover:bg-slate-800 font-semibold w-full sm:w-auto text-white'
              >
                Shop Now
              </Button>
            </Link>
            <div className='flex items-baseline gap-3'>
              <span className='text-2xl md:text-3xl font-bold text-rose-600'>$27.99</span>
              <span className='text-sm md:text-base line-through text-slate-400'>$66.67</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className='lg:w-1/2 relative'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className='relative w-full max-w-lg mx-auto'>
            <div className='absolute inset-0 bg-gradient-to-r from-slate-200 via-white to-slate-200 rounded-2xl filter blur-3xl opacity-60'></div>
            <img
              src='https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop'
              alt='Grocery products'
              width={500}
              height={350}
              className='rounded-2xl shadow-2xl relative z-10 w-full h-auto object-cover'
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
