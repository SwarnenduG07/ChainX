"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.5
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
};

export function LandingNavBar(): JSX.Element {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            setIsLoggedIn(Boolean(token));
        }
    }, []);

    const handleSignout = (): void => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/signin");
    };

    return (
        <motion.nav
            variants={navVariants}
            initial="hidden"
            animate="visible"
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
                <div className="flex h-16 items-center justify-between mt-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="flex-shrink-0"
                    >
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            ChainX
                        </span>
                    </motion.div>

                    <div className="flex items-center gap-x-8">
                        {!isLoggedIn ? (
                            <>
                                <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                                    className="hidden md:flex items-center space-x-8 text-sm text-neutral-200 lg:mr-64 md:mr-56 bg-transparent border border-zinc-800 px-6 py-2 rounded-full "
                                >
                                    {['Features', 'Pricing', 'Contact'].map((item) => (
                                        <motion.span
                                            key={item}
                                            variants={itemVariants}
                                            whileHover={{ 
                                                scale: 1.1, 
                                                color: '#A78BFA',
                                                transition: { duration: 0.2 }
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {item}
                                        </motion.span>
                                    ))}
                                  
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center gap-x-4"
                                >
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            className="px-6  rounded-full bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-all"
                                            onClick={() => router.push("/signin")}
                                        >
                                            Log in
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            className="px-6  rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90 transition-all"
                                            onClick={() => router.push("/signup")}
                                        >
                                            Sign up
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </>
                        ) : (
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Button
                                    className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-600 text-white hover:opacity-90 transition-all"
                                    onClick={handleSignout}
                                >
                                    Logout
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
