import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  hover = false,
  onClick
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm transition-shadow';
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverStyles = hover ? 'hover:shadow-lg cursor-pointer' : '';
  const clickStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${clickStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;