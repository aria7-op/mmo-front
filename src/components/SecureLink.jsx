import React from 'react';
import { Link } from 'react-router-dom';

const SecureLink = ({ to, children, className, style, onClick, ...props }) => {
  return (
    <Link
      to={to}
      className={className}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default SecureLink;
