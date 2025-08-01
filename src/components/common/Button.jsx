import React from 'react';

/**
 * A reusable button component with variants and sizes, styled with Tailwind CSS.
 * Mimics the structure of a shadcn/ui button.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the button.
 * @param {'default' | 'outline' | 'ghost' | 'destructive'} [props.variant='default'] - The visual style of the button.
 * @param {'default' | 'lg' | 'sm'} [props.size='default'] - The size of the button.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the button.
 * @returns {JSX.Element} The rendered button element.
 */
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  // Base classes applied to all buttons for fundamental styling and transitions.
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300";

  // Style variants that change the button's appearance (color, background, border).
  const variants = {
    default: "bg-blue-600 text-slate-50 hover:bg-blue-600/90 dark:bg-blue-500 dark:text-slate-50 dark:hover:bg-blue-500/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
  };

  // Size variants that control the button's padding, height, and font size.
  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-11 rounded-md px-8 text-base",
    sm: "h-9 rounded-md px-3",
  };

  // Combine all classes: base, variant-specific, size-specific, and any custom classes passed in.
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
