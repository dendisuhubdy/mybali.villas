'use client';

import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

interface GoogleSignInButtonProps {
  text?: 'signin_with' | 'signup_with';
  onSuccess: (credential: string) => void;
  onError: () => void;
}

export default function GoogleSignInButton({
  text = 'signin_with',
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const [mounted, setMounted] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !clientId) {
    return null;
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          onSuccess(credentialResponse.credential);
        }
      }}
      onError={onError}
      type="standard"
      theme="outline"
      size="large"
      width="400"
      text={text}
    />
  );
}
