'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store';
import { restoreAuth } from '@/features/auth';
import { AppDispatch } from '@/store';

function AuthRestorer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Only restore auth on first mount, not on every dispatch change
    dispatch(restoreAuth());
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRestorer>{children}</AuthRestorer>
    </Provider>
  );
}
