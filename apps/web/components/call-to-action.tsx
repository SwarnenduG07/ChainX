"use client";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CallToAction() {
  const router = useRouter();
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative py-16 px-8 md:px-16 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md"
            >
              Ready to Transform Your Workflow?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/90 mb-10 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
            >
              Join thousands of teams who have already automated their work and saved countless hours. Start your free trial today and see the difference.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                onClick={() => router.push('/signup')}
                size="lg"
                className="px-8 py-7 text-lg bg-white text-purple-600 hover:bg-white/90 rounded-full shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                onClick={() => router.push('/demo')}
                variant="outline"
                size="lg"
                className="px-8 py-7 text-lg text-white border-white/40 hover:bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6 text-white/70 text-sm"
            >
              No credit card required • 14-day free trial • Cancel anytime
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
