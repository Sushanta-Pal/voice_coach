import React from 'react';
import { Sun, Moon } from 'lucide-react';
import Button from './Button';
import { useTheme } from '../../providers/ThemeProvider';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button onClick={toggleTheme} variant="ghost" size="icon">
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
    );
};

export default ThemeToggle;