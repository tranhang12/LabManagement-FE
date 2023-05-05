import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const withRole = (allowedRoles: number[]) => (WrappedComponent: React.ComponentType) => {
  const WithRoleComponent: React.FC = (props) => {
    const router = useRouter();
    const userRole = useSelector((state: RootState) => state.auth.user?.Is_Admin);

    const checkRole = useCallback(() => {
      if (userRole === undefined) {
        return;
      }
      if (!allowedRoles.includes(userRole)) {
        router.push('/unauthorized');
      }
    }, [router, userRole]);
    

    useEffect(() => {
      checkRole();
    }, [checkRole]);

    return <WrappedComponent {...props} />;
  };

  return WithRoleComponent;
};

export default withRole;
