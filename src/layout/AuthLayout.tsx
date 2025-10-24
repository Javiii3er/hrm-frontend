import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout" style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

export default AuthLayout;