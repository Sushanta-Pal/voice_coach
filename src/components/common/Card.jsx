import React from 'react';

/**
 * A container component styled as a card.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the card.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the card.
 * @returns {JSX.Element} The rendered card element.
 */
const Card = ({ children, className = '', ...props }) => (
  <div
    className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

/**
 * A header component for a Card.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content for the card header.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {JSX.Element} The rendered card header element.
 */
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * A title component for a CardHeader.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content for the card title.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {JSX.Element} The rendered card title element.
 */
const CardTitle = ({ children, className = '', ...props }) => (
  <h3
    className={`text-xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

/**
 * A description component for a CardHeader.
 *
* @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content for the card description.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {JSX.Element} The rendered card description element.
 */
const CardDescription = ({ children, className = '', ...props }) => (
  <p
    className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}
    {...props}
  >
    {children}
  </p>
);

/**
 * The main content area for a Card.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The main content of the card.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {JSX.Element} The rendered card content element.
 */
const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
