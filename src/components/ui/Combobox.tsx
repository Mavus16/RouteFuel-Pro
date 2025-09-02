import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ComboboxOption {
  value: string | number;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
  options, value, onValueChange, placeholder, label, disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: ComboboxOption) => {
    onValueChange(option.value);
    setSearchValue('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-md border border-border-medium bg-background-primary px-4 py-3 text-left text-base text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-10",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <span className={selectedOption ? "text-text-primary" : "text-text-placeholder"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-border-light bg-background-primary shadow-elevation3">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-md border border-border-medium bg-background-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-10"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-text-secondary">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-background-secondary",
                      option.value === value && "bg-accent text-text-inverse"
                    )}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Combobox.displayName = 'Combobox';

export { Combobox };
