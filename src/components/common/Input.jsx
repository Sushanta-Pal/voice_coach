import React from 'react';

/**
 * A styled text input component.
 *
 * @param {object} props - The component props.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the input.
 * @param {string} [props.type='text'] - The type of the input field.
 * @returns {JSX.Element} The rendered input element.
 */
const Input = ({ className = '', type = 'text', ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-500 ${className}`}
    {...props}
  />
);

/**
 * A label component, styled to be used with an Input.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content for the label.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {JSX.Element} The rendered label element.
 */
const Label = ({ className = '', ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
);

export { Input, Label };
