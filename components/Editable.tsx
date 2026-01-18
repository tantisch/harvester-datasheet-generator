import React, { useEffect, useRef } from 'react';

interface EditableProps {
  initialValue: string;
  className?: string;
  placeholder?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  onChange?: (value: string) => void;
}

export const Editable: React.FC<EditableProps> = ({ 
  initialValue, 
  className = '', 
  placeholder = 'Type here...', 
  tag: Tag = 'div',
  onChange
}) => {
  const elementRef = useRef<HTMLElement>(null);

  // If the initialValue changes externally (e.g. from sidebar), update the text content manually
  // This avoids full re-renders that might mess up selection if we were using key-based resetting
  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== initialValue) {
      elementRef.current.innerText = initialValue;
    }
  }, [initialValue]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (onChange) {
      const newValue = e.currentTarget.innerText;
      if (newValue !== initialValue) {
        onChange(newValue);
      }
    }
  };

  return (
    <Tag
      ref={elementRef as any}
      className={`outline-none transition-colors duration-200 ${className}`}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={handleBlur}
    >
      {initialValue}
    </Tag>
  );
};