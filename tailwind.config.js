export default {
    darkMode: ['selector', '[class="dark"]'],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            // CSS variable-based color system for dark/light mode support
            colors: {
                // Background colors
                background: {
                    DEFAULT: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    tertiary: 'var(--bg-tertiary)',
                    elevated: 'var(--bg-elevated)',
                },
                // Foreground/text colors
                foreground: {
                    DEFAULT: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                    inverse: 'var(--text-inverse)',
                },
                // Border colors
                border: {
                    DEFAULT: 'var(--border)',
                    muted: 'var(--border-muted)',
                    focus: 'var(--border-focus)',
                },
                // Status colors with light/dark variants
                success: {
                    light: 'var(--success-light)',
                    DEFAULT: 'var(--success)',
                    dark: 'var(--success-dark)',
                },
                warning: {
                    light: 'var(--warning-light)',
                    DEFAULT: 'var(--warning)',
                    dark: 'var(--warning-dark)',
                },
                error: {
                    light: 'var(--error-light)',
                    DEFAULT: 'var(--error)',
                    dark: 'var(--error-dark)',
                },
                info: {
                    light: 'var(--info-light)',
                    DEFAULT: 'var(--info)',
                    dark: 'var(--info-dark)',
                },
                // Accent color (teal brand color)
                accent: {
                    light: 'var(--accent-light)',
                    DEFAULT: 'var(--accent)',
                    dark: 'var(--accent-dark)',
                },
            },
            // Box shadows using CSS variables
            boxShadow: {
                sm: 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow-md)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
            },
            // Transition support for theme changes
            transitionProperty: {
                'theme': 'background-color, border-color, color, fill, stroke',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'scale-up': 'scaleUp 0.3s ease-out',
                'bounce-short': 'bounceShort 1s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleUp: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                bounceShort: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        },
    },
    plugins: [],
}
