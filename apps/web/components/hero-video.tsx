"use client";
import HeroVideoDialog from "./ui/hero-video-dialog";
import { motion } from "framer-motion";

export function HeroVideo() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative px-6 sm:px-16 md:px-24 lg:px-36 py-24"
    >
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-md opacity-70"
        ></motion.div>
        
        <HeroVideoDialog
          className="dark:hidden block relative z-10"
          animationStyle="top-in-bottom-out"
          videoSrc=""
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="ChainX Automation Platform Demo"
        />
        <HeroVideoDialog
          className="hidden dark:block relative z-10"
          animationStyle="top-in-bottom-out"
          videoSrc=""
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="ChainX Automation Platform Demo"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-12 text-sm text-purple-300/70"
      >
        See how ChainX revolutionizes workflow automation in just 2 minutes
      </motion.div>
    </motion.div>
  );
}
