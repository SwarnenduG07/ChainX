"use client"
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { BlackHole } from './black-hole';
import { motion } from 'framer-motion';

export function Hero():JSX.Element {
  const router = useRouter();
  
  return (
    <div className='relative min-h-[90vh] flex flex-col items-center justify-center'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center space-y-10 relative z-10'>
          <div className="absolute inset-x-0 top-40 pointer-events-none">
            <BlackHole />
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-purple-200'
          >
            Make life Easy with <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">ChainX</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-xl md:text-2xl text-white/80 max-w-2xl mx-auto relative z-20 drop-shadow-md font-light'
          >
            Automate your workflows with our powerful AI-driven platform
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='inline-flex flex-col sm:flex-row items-center gap-4 mt-10 relative z-20'
          >
            <Button 
              onClick={() => router.push('/signup')}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-7 text-lg rounded-full shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
            >
              Start free trial
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => router.push('/learn-more')}
              className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10 px-12 py-7 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
            >
              Learn more
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-sm text-white/50 pt-6"
          >
            Trusted by 10,000+ companies worldwide
          </motion.div>
        </div>
      </div>
    </div>
  );
}
