import React, { createContext, useContext, useState, ReactNode } from "react";

const colorThemes = {
  default: {
    100: "#3B6064",
    200: "#F4FAFA",
    300: "#3B6064",
    400: "#E8EBEB",
    500: "#FEFCFB",
    600: "#55828B",
    700: "#D2E7DF",
    800: "#3B6064",
  },
  alternate: {
    100: "#F4FAFA",
    200: "#364958",
    300: "#F4FAFA",
    400: "#4A5B68",
    500: "#42606D",
    600: "#D2E7DF",
    700: "#42606D",
    800: "#55828B",
  },
};

interface ThemeContextType {
  theme: typeof colorThemes.default;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(colorThemes.default);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === colorThemes.default ? colorThemes.alternate : colorThemes.default
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
