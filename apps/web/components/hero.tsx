"use client"
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { BlackHole } from './black-hole';

export function Hero():JSX.Element {
  const router = useRouter();
  
  return (
    <div className='relative min-h-[80vh] flex flex-col items-center justify-start pt-20'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center space-y-8 relative z-10'>
          <div className="absolute inset-x-0 top-40 pointer-events-none">
            <BlackHole />
          </div>

          <h1 className='text-7xl font-medium tracking-tight text-neutral-200/90  drop-shadow-lg'>
              Make life Easy with ChainX
          </h1>
          
          <p className='text-xl text-white/80 max-w-2xl mx-auto relative z-20 drop-shadow-md'>
            Auto mate your workflows with us
          </p>

          <div className='inline-flex items-center gap-4 mt-8 relative z-20'>
            <Button 
              onClick={() => router.push('/signup')}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              Start free trial
            </Button>
            <Button 
              variant="ghost"
              size="lg"
              className="text-white/90 hover:text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
