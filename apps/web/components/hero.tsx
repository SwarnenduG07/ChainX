"use client"
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Feature } from './features'


export  function Hero():JSX.Element {
    const router  = useRouter();
  return (
    <div className=''>
        <div className='flex justify-center'>
            <div className=' text-center pt-20 text-neutral-50'>
                <h1 className='text-6xl font-thin  text-center pt-8  text-neutral-50'>
                    The No-Code Automation Platform 
                </h1>
                <h1 className='text-3xl font-light pt-12'>Automate as fast as you can type</h1>
                
            </div>
        </div>        
        <div className='flex justify-center'>
            <div className='text-xl font-normal text-center pt-10 max-w-xl text-neutral-200'>
            AI gives you automation superpowers, and ChainX puts them to work. Pairing AI and chainX helps you turn ideas into workflows and bots that work for you.
            </div>
        </div>     
        <div className='flex justify-center pt-4 space-x-4'>
            <Button className='rounded-full w-52 py-6 bg-purple-500 text-lg' onClick={() => {
                router.push("/signup")
            }}>
                Get started
            </Button>
            <Button className='rounded-full w-52 py-6 text-lg' onClick={() => {
                router.push("/signup")
            }} variant="outline">
                Contact Sales
            </Button>
        </div>   
        <div className="flex justify-center pt-4 text-neutral-50">
            <Feature subtitle="for core features" title="Free Forever" />
            <Feature subtitle="than any other platforms" title="More apps" />
            <Feature subtitle="AI Features" title="Cutting Edge" />
        </div>
    </div>
  )
}

