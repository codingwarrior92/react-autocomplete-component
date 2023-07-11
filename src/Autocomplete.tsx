import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

interface Option {
  id: number;
  value: string;
}

const Autocomplete: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/options');
        if (!response.ok) {
          throw new Error('Failed to fetch options');
        }
        const data: Option[] = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter options based on input value
    const filtered = options.filter((option) =>
      option.value.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleItemClick = (option: Option) => {
    setInputValue(option.value);
    setFilteredOptions([]);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setFilteredOptions([]);
    }
  };

  const replaceString = (originString: string, replaceString: string) => {
    const regex = new RegExp(replaceString, 'gi');
    const replacedStr = originString.replace(regex, (match) => {
      return `<strong>${match}</strong>`;
    });
    return replacedStr;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && filteredOptions.length > 0) {
      event.preventDefault();
      focusFirstItem();
    } else if (event.key === 'ArrowUp' && filteredOptions.length > 0) {
      event.preventDefault();
      focusLastItem();
    } else if (event.key === 'Enter' && filteredOptions.length > 0) {
      event.preventDefault();
      handleEnterKeyPress();
    }
  };

  const focusFirstItem = () => {
    const firstItem = dropdownRef.current?.querySelector('li');
    if (firstItem) {
      firstItem.focus();
    }
  };

  const focusLastItem = () => {
    const lastItem = dropdownRef.current?.querySelector(
      'li:last-child'
    ) as HTMLElement | null;
    if (lastItem) {
      lastItem.focus();
    }
  };

  const handleEnterKeyPress = () => {
    const selectedItem = dropdownRef.current?.querySelector('li:focus');
    if (selectedItem) {
      const index = Array.from(dropdownRef.current?.children as HTMLCollection).indexOf(
        selectedItem
      );
      handleItemClick(filteredOptions[index]);
    }
  };

  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    option: Option
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleItemClick(option);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusNextItem(event.currentTarget);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusPreviousItem(event.currentTarget);
    }
  };

  const focusNextItem = (currentItem: HTMLElement | null) => {
    if (!currentItem) return;

    const nextItem = currentItem.nextSibling as HTMLElement | null;
    if (nextItem) {
      nextItem.focus();
    } else {
      const firstItem = currentItem.parentNode?.firstChild as HTMLElement | null;
      if (firstItem) {
        firstItem.focus();
      }
    }
  };

  const focusPreviousItem = (currentItem: HTMLElement | null) => {
    if (!currentItem) return;

    const previousItem = currentItem.previousSibling as HTMLElement | null;
    if (previousItem) {
      previousItem.focus();
    } else {
      const lastItem = currentItem.parentNode?.lastChild as HTMLElement | null;
      if (lastItem) {
        lastItem.focus();
      }
    }
  };

  return (
    <div className="text-center">
      <div className="relative w-1/2 pt-2 inline-block">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for..."
          className="w-full px-5 py-2 rounded border border-black/20"
        />
        {isLoading ? (
          <div className="bg-black/5 p-5 rounded">Loading...</div>
        ) : (
          <ul
            ref={dropdownRef}
            className="absolute text-left w-full m-0 mt-1 p-0 bg-white list-none rounded overflow-y-auto border border-black/10 z-10 max-h-96"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="cursor-pointer px-5 py-2 hover:bg-black/5 border-b border-black/10"
                  onClick={() => handleItemClick(option)}
                  onKeyDown={(event) => handleItemKeyDown(event, option)}
                  tabIndex={0}
                  role="option"
                  aria-selected={option.value === inputValue}
                >
                  {option.value.toLowerCase().includes(inputValue.toLowerCase()) ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: replaceString(option.value, inputValue),
                      }}
                    />
                  ) : (
                    option.value
                  )}
                </li>
              ))
            ) : inputValue === '' ? (
              <></>
            ) : (
              <li className="p-3 text-center">No matching items found.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
