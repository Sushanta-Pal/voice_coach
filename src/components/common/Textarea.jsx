import React from 'react';

const Textarea = ({ className = '', ...props }) => (
    <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-300 ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

export default Textarea;