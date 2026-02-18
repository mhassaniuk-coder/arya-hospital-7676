import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../src/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
    /** Visual variant of the toggle */
    variant?: 'icon' | 'button' | 'dropdown' | 'segmented';
    /** Size of the toggle */
    size?: 'sm' | 'md' | 'lg';
    /** Whether to show the label (for button variant) */
    showLabel?: boolean;
    /** Direction for dropdown/popover expansion */
    direction?: 'up' | 'down';
    /** Additional CSS classes */
    className?: string;
}

/**
 * ThemeToggle Component
 * 
 * A versatile theme toggle component supporting three theme modes:
 * - Light: Forces light theme
 * - Dark: Forces dark theme  
 * - System: Follows OS preference automatically
 * 
 * Supports multiple visual variants:
 * - icon: Simple icon button that cycles through themes
 * - button: Button with icon and optional label
 * - dropdown: Dropdown menu with all options
 * - segmented: Segmented control with all options visible
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({
    variant = 'icon',
    size = 'md',
    showLabel = false,
    direction = 'down',
    className = '',
}) => {
    const { theme, resolvedTheme, setTheme, isDark, isSystem } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Size configurations
    const sizeConfig = {
        sm: {
            icon: 'w-4 h-4',
            button: 'p-1.5 text-xs',
            gap: 'gap-1.5',
        },
        md: {
            icon: 'w-5 h-5',
            button: 'p-2 text-sm',
            gap: 'gap-2',
        },
        lg: {
            icon: 'w-6 h-6',
            button: 'p-3 text-base',
            gap: 'gap-3',
        },
    };

    // Theme options for dropdown/segmented
    const themeOptions: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
        { value: 'light', icon: <Sun className={sizeConfig[size].icon} />, label: 'Light' },
        { value: 'dark', icon: <Moon className={sizeConfig[size].icon} />, label: 'Dark' },
        { value: 'system', icon: <Monitor className={sizeConfig[size].icon} />, label: 'System' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get current theme icon
    const getCurrentIcon = () => {
        if (theme === 'system') {
            return <Monitor className={sizeConfig[size].icon} />;
        }
        // Show the icon representing what's CURRENTLY active, not what will happen next
        return theme === 'light' ? <Sun className={sizeConfig[size].icon} /> : <Moon className={sizeConfig[size].icon} />;
    };

    // Get current theme label
    const getCurrentLabel = () => {
        if (theme === 'system') return 'System';
        return theme === 'light' ? 'Light' : 'Dark';
    };

    // Handle keyboard navigation for dropdown
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (variant === 'dropdown') {
            if (event.key === 'Escape') {
                setIsOpen(false);
            } else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setIsOpen(!isOpen);
            }
        }
    };

    // Icon variant - simple cycling button
    if (variant === 'icon') {
        return (
            <button
                onClick={() => {
                    if (theme === 'light') setTheme('dark');
                    else if (theme === 'dark') setTheme('system');
                    else setTheme('light');
                }}
                className={`
          rounded-full ${sizeConfig[size].button}
          bg-slate-100 dark:bg-slate-800
          hover:bg-slate-200 dark:hover:bg-slate-700
          text-slate-600 dark:text-slate-300
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-teal-500
          ${className}
        `}
                aria-label={`Current theme: ${theme}. Click to change.`}
                title={`Theme: ${theme} (click to change)`}
            >
                {getCurrentIcon()}
            </button>
        );
    }

    // Button variant - button with optional label
    if (variant === 'button') {
        return (
            <button
                onClick={() => {
                    if (theme === 'light') setTheme('dark');
                    else if (theme === 'dark') setTheme('system');
                    else setTheme('light');
                }}
                className={`
          flex items-center ${sizeConfig[size].gap} ${sizeConfig[size].button}
          rounded-lg
          bg-slate-100 dark:bg-slate-800
          hover:bg-slate-200 dark:hover:bg-slate-700
          text-slate-700 dark:text-slate-300
          border border-slate-200 dark:border-slate-700
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-teal-500
          ${className}
        `}
                aria-label={`Current theme: ${theme}. Click to change.`}
            >
                {getCurrentIcon()}
                {showLabel && <span>{getCurrentLabel()}</span>}
            </button>
        );
    }

    // Dropdown variant - dropdown menu with all options
    if (variant === 'dropdown') {
        const isUp = direction === 'up';
        return (
            <div ref={dropdownRef} className={`relative ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    className={`
            flex items-center ${sizeConfig[size].gap} ${sizeConfig[size].button}
            rounded-lg
            bg-white dark:bg-slate-800
            hover:bg-slate-50 dark:hover:bg-slate-700
            text-slate-700 dark:text-slate-300
            border border-slate-200 dark:border-slate-700
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-teal-500
          `}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-label="Select theme"
                >
                    {getCurrentIcon()}
                    {showLabel && <span>{getCurrentLabel()}</span>}
                    <svg
                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div
                        className={`
              absolute right-0 ${isUp ? 'bottom-full mb-2' : 'top-full mt-2'} py-1 w-36
              bg-white dark:bg-slate-800
              rounded-lg shadow-lg
              border border-slate-200 dark:border-slate-700
              z-50
              animate-fade-in
            `}
                        role="listbox"
                        aria-label="Theme options"
                    >
                        {themeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setTheme(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                  w-full flex items-center ${sizeConfig[size].gap} px-3 py-2
                  text-left text-sm
                  ${theme === option.value
                                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }
                  transition-colors duration-150
                `}
                                role="option"
                                aria-selected={theme === option.value}
                            >
                                {option.icon}
                                <span>{option.label}</span>
                                {theme === option.value && (
                                    <svg className="w-4 h-4 ml-auto text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Segmented variant - all options visible as segments
    if (variant === 'segmented') {
        return (
            <div
                className={`
          inline-flex p-1 rounded-lg
          bg-slate-100 dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          ${className}
        `}
                role="radiogroup"
                aria-label="Theme selection"
            >
                {themeOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`
              flex items-center ${sizeConfig[size].gap} ${sizeConfig[size].button}
              rounded-md
              font-medium
              transition-all duration-200
              ${theme === option.value
                                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1
            `}
                        role="radio"
                        aria-checked={theme === option.value}
                        aria-label={`${option.label} theme`}
                    >
                        {option.icon}
                        {showLabel && <span>{option.label}</span>}
                    </button>
                ))}
            </div>
        );
    }

    return null;
};

export default ThemeToggle;
