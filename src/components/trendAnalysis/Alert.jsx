import React from 'react';

const Alert = ({ variant = 'info', title, children }) => {
  const variantClasses = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700',
  };

  const baseClasses = 'border-l-4 p-4 mb-4';
  const classes = `${baseClasses} ${variantClasses[variant]}`;

  return (
    <div className={classes} role="alert">
      {title && <p className="font-bold mb-2">{title}</p>}
      <p>{children}</p>
    </div>
  );
};

export default Alert;