import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import Button from './Button';
import { SparklesIcon, XIcon } from '../icons/index'; // Assuming icons are in a central file

/**
 * A reusable modal dialog component.
 * It renders an overlay with a card-based dialog in the center.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {Function} props.onClose - Function to call when the modal should be closed.
 * @param {string} props.title - The title to display in the modal header.
 * @param {React.ReactNode | string} props.content - The main content to display in the modal body. Can be a string or JSX.
 * @returns {JSX.Element | null} The rendered modal element or null if not open.
 */
const Modal = ({ title, content, isOpen, onClose }) => {
  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    // Backdrop: a semi-transparent overlay that covers the entire screen.
    // Clicking the backdrop calls the onClose function to close the modal.
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Panel: the main dialog box. */}
      {/* e.stopPropagation() prevents clicks inside the modal from bubbling up to the backdrop and closing it. */}
      <div
        className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="text-blue-500" /> {title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
              <XIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            {/* Display the content, or a loading message if content is not yet available. */}
            {/* The dangerouslySetInnerHTML is used to render HTML content from the Gemini API. */}
            {content ? (
              typeof content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
              ) : (
                content
              )
            ) : (
              <p>Generating...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Modal;
