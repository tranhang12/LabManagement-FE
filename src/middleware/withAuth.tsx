// hoc/withAuth.tsx
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { RootState } from '@/store';

const withAuth = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    useEffect(() => {
      if (!isLoggedIn) {
        router.push('/auth/login');
      }
    }, [isLoggedIn, router]);
    return <><WrappedComponent {...props} /></>;
  };

  return Wrapper;
};

export default withAuth;
