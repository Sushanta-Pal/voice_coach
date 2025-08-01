import React, { useState } from 'react';

/**
 * The main container for a set of tabs. Manages the active tab state.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child elements, typically TabsList and TabsContent.
 * @param {string} props.defaultValue - The value of the tab to be active by default.
 * @param {Function} [props.onValueChange] - A callback function that is called when the active tab changes.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the container.
 * @returns {JSX.Element} The rendered tabs container.
 */
const Tabs = ({ children, defaultValue, onValueChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!child) return null;

        // Pass state and handler to TabsList
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, onTabChange: handleTabChange });
        }

        // Only render the content for the active tab
        if (child.type === TabsContent && child.props.value === activeTab) {
          return child;
        }

        return null; // Don't render other TabsContent components
      })}
    </div>
  );
};

/**
 * A container for the list of tab triggers.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child elements, typically TabsTrigger components.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {string} [props.activeTab] - (Passed from Tabs) The currently active tab's value.
 * @param {Function} [props.onTabChange] - (Passed from Tabs) The handler to change the active tab.
 * @returns {JSX.Element} The rendered list of tab triggers.
 */
const TabsList = ({ children, activeTab, onTabChange, className = '' }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, onTabChange })
    )}
  </div>
);

/**
 * The clickable button that activates a tab.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The label for the tab trigger.
 * @param {string} props.value - A unique value for the tab, used to identify it.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {string} [props.activeTab] - (Passed from TabsList) The currently active tab's value.
 * @param {Function} [props.onTabChange] - (Passed from TabsList) The handler to change the active tab.
 * @returns {JSX.Element} The rendered tab trigger button.
 */
const TabsTrigger = ({ children, value, activeTab, onTabChange, className = '' }) => {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onTabChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-white shadow-sm text-slate-950 dark:bg-slate-950 dark:text-slate-50' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * The content panel associated with a tab trigger. It is only visible when its tab is active.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content for the tab panel.
 * @param {string} props.value - The value corresponding to the tab trigger.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {JSX.Element} The rendered tab content panel.
 */
const TabsContent = ({ children, value, className = '' }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
