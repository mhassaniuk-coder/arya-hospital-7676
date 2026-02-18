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
            colors: {
                // Background colors
                background: {
                    DEFAULT: 'var(--bg-primary)',
                    primary: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    tertiary: 'var(--bg-tertiary)',
                    elevated: 'var(--bg-elevated)',
                },
                // Foreground/text colors
                foreground: {
                    DEFAULT: 'var(--text-primary)',
                    primary: 'var(--text-primary)',
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
                // Semantic Colors
                accent: {
                    DEFAULT: 'var(--accent)',
                    light: 'var(--accent-light)',
                    dark: 'var(--accent-dark)',
                    glow: 'var(--accent-glow)',
                },
                success: {
                    DEFAULT: 'var(--success)',
                    light: 'var(--success-light)',
                    dark: 'var(--success-dark)',
                },
                warning: {
                    DEFAULT: 'var(--warning)',
                    light: 'var(--warning-light)',
                    dark: 'var(--warning-dark)',
                },
                error: {
                    DEFAULT: 'var(--error)',
                    light: 'var(--error-light)',
                    dark: 'var(--error-dark)',
                },
                info: {
                    DEFAULT: 'var(--info)',
                    light: 'var(--info-light)',
                    dark: 'var(--info-dark)',
                },
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow-md)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                glow: 'var(--shadow-glow)',
                glass: 'var(--glass-shadow)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            }
        },
    },
    plugins: [],
}
