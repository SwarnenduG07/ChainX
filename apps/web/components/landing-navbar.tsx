"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function LandingNavBar():JSX.Element {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        setIsLoggedIn(Boolean(token));
    }, []);

    const handleSignout = (): void => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/signin");
    };

    return (
        <nav className='fixed top-0 left-0 right-0 z-50'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between mt-4'>
                    <div className='flex-shrink-0'>
                        <span className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent'>
                            ChainX
                        </span>
                    </div>
                    
                    <div className='flex items-center gap-x-8'>
                        {!isLoggedIn ? (
                            <>
                                <div className='hidden md:flex items-center space-x-8 text-sm text-neutral-300'>
                                    <span className='hover:text-purple-400 transition-colors cursor-pointer'>Features</span>
                                    <span className='hover:text-purple-400 transition-colors cursor-pointer'>Pricing</span>
                                    <span className='hover:text-purple-400 transition-colors cursor-pointer'>Contact</span>
                                </div>
                                
                                <div className='flex items-center gap-x-4'>
                                    <Button 
                                        className='px-6 py-2 rounded-full bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-all'
                                        onClick={() => router.push("/signin")}
                                    >
                                        Log in
                                    </Button>
                                    <Button 
                                        className='px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90 transition-all'
                                        onClick={() => router.push("/signup")}
                                    >
                                        Sign up
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Button 
                                className='px-6 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-600 text-white hover:opacity-90 transition-all'
                                onClick={handleSignout}
                            >
                                Logout
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
