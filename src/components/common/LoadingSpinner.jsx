import React from 'react';

/**
 * A simple, reusable loading spinner component styled with Tailwind CSS.
 * It displays a centered, spinning border animation.
 *
 * @returns {JSX.Element} The rendered loading spinner element.
 */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

export default LoadingSpinner;
