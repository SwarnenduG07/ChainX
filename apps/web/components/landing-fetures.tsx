"use client"
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion';

export function LandingFetures():JSX.Element {
  const router = useRouter();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'
    > 
        <div className='text-center'>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl'
            >
                Build powerful workflows incredibly fast
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='mt-8 text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed'
            >
                Whether you are a team of one or a thousand, ChainX puts the power of automation in your hands—no coding required. Take your workflows to the next level with our suite of automation tools.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='mt-12 flex justify-center gap-x-6'
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                        className='px-8 py-6 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 text-white hover:opacity-90 transition-all shadow-xl hover:shadow-purple-500/20'
                        onClick={() => router.push("/signup")}
                    >
                        Get Started
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                        className='px-8 py-6 rounded-full bg-purple-950/30 backdrop-blur-sm border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all'
                        onClick={() => router.push("/signup")}
                    >
                        Learn More
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    </motion.div>
  )
}
