import React from 'react';

export const Textarea = ({ value, onChange, placeholder, className }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`textarea ${className}`}
  />
);
