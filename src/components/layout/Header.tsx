import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <header className="bg-background-dark h-16 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-text-inverse text-xl font-semibold">
          Routefuel Pro
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleTheme}
          className="bg-background-dark border-border-light text-text-inverse hover:bg-background-primary hover:text-text-primary"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
};
