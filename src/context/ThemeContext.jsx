import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    // Always stick to dark theme
    const [theme] = useState('dark');

    const toggleTheme = useCallback(() => {
        // No-op: Light theme is disabled as per user request
        console.log('Theme toggle disabled: App is permanently in Dark Mode.');
    }, []);

    useEffect(() => {
        // Ensure the attribute is always set correctly on mount
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('threads26_theme', 'dark');
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
};
