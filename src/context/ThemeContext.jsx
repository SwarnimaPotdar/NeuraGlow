import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('themeColor');
    const light = savedTheme === 'light_mode';
    setIsLightMode(light);
    document.body.classList.toggle('light_mode', light);
    document.body.classList.toggle('dark_mode', !light);
  }, []);

  const toggleTheme = () => {
    const next = !isLightMode;
    setIsLightMode(next);
    document.body.classList.toggle('light_mode', next);
    document.body.classList.toggle('dark_mode', !next);
    localStorage.setItem('themeColor', next ? 'light_mode' : 'dark_mode');
  };

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};