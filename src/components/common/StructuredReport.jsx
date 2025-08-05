

import React from 'react';

const StructuredReport = ({ reportText }) => {
    if (!reportText) {
        return null;
    }

    const renderSection = (section) => {
        // Check for list items (lines starting with '-')
        if (section.startsWith('- ')) {
            const items = section.split('\n').filter(line => line.startsWith('- '));
            return (
                <ul className="list-disc list-inside space-y-2 my-3">
                    {items.map((item, index) => (
                        <li key={index} className="text-slate-700 dark:text-slate-300">{item.substring(2)}</li>
                    ))}
                </ul>
            );
        }
        
        // Check for headings (lines ending with ':')
        if (section.endsWith(':')) {
            return <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-2">{section.slice(0, -1)}</h3>;
        }

        // Default to paragraph
        return <p className="text-slate-600 dark:text-slate-400 mb-4">{section}</p>;
    };

    const sections = reportText.split('\n\n');

    return (
        <div className="prose dark:prose-invert max-w-none">
            {sections.map((section, index) => (
                <React.Fragment key={index}>
                    {renderSection(section)}
                </React.Fragment>
            ))}
        </div>
    );
};

export default StructuredReport;

