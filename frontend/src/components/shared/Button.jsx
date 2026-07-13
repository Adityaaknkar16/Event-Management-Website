import React from 'react';

const Button = ({ 
  children, 
  variant = 'solid', // 'solid' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  onClick,
  disabled = false,
  className = ''
}) => {
  const getClassName = () => {
    let classes = 'btn';
    if (variant === 'solid') classes += ' btn-luxury-solid';
    else if (variant === 'ghost') classes += ' btn-luxury-ghost';
    else if (variant === 'danger') classes += ' btn-danger';
    
    if (size === 'sm') classes += ' btn-sm';
    else if (size === 'lg') classes += ' btn-lg';
    
    return `${classes} ${className}`;
  };

  return (
    <button
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
