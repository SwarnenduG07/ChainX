"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "ChainX has transformed our team's productivity. We automated our entire customer onboarding process in just a few hours.",
    author: "Sarah Johnson",
    role: "CTO at TechFlow",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    quote: "The AI-powered suggestions have saved us countless hours. It's like having an extra team member that works 24/7.",
    author: "Mark Williams",
    role: "Product Lead at Innovate",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    quote: "After trying multiple automation tools, ChainX is by far the most intuitive and powerful solution we've found.",
    author: "Emily Chen",
    role: "Operations Manager",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

export function Testimonials() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20"
    >
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-6"
        >
          What People Say
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Join thousands of satisfied users who have revolutionized their workflows
        </motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {testimonials.map((testimonial, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * i + 0.5 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 p-8 rounded-2xl backdrop-blur-md border border-purple-500/20 shadow-xl"
          >
            <div className="flex mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-200 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
            <div className="flex items-center">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.author} 
                className="h-12 w-12 rounded-full border-2 border-purple-500/50"
              />
              <div className="ml-4">
                <h4 className="text-white font-medium">{testimonial.author}</h4>
                <p className="text-purple-300 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
