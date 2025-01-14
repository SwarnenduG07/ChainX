'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';

function VerifyEmailContent(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      setStatus('loading');
      try {
        const response = await axios.get(`/api/1/user/verifyemail`, { params: { token } });
        if (response.data.message === 'Email verified Successfully') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification failed:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return <p className='bg-red-600'>Verifying your email, please wait...</p>;
  }

  if (status === 'success') {
    return (
      <div>
        <h1>Email Verified Successfully</h1>
        <p>You can now log in to your account.</p>
        <button type="button" onClick={() => router.push('/login')}>Go to Login</button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div>
        <h1>Email Verification Failed</h1>
        <p>The token is invalid or expired.</p>
        <button type="button" onClick={() => router.push('/')}>Go to Homepage</button>
      </div>
    );
  }

  return <h1>Email verification route</h1>;
}

export default function VerifyEmail(): JSX.Element {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}