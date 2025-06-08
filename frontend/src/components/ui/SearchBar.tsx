import React, { useCallback, useState } from 'react'
import { Button } from './Button'
import { Input } from './FormField'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  initialValue?: string
  size?: 'sm' | 'md' | 'lg'
  showButton?: boolean
  buttonText?: string
  onClear?: () => void
  disabled?: boolean
  autoSubmit?: boolean
  debounceMs?: number
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  size = 'md',
  showButton = true,
  buttonText = 'Search',
  onClear,
  disabled = false,
  autoSubmit = false,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState(initialValue)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  )

  const handleSearch = useCallback(() => {
    if (query.trim() || initialValue) {
      onSearch(query.trim())
    }
  }, [query, onSearch, initialValue])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)

    // Auto-submit with debouncing
    if (autoSubmit) {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      const timer = setTimeout(() => {
        onSearch(newQuery.trim())
      }, debounceMs)

      setDebounceTimer(timer)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSearch()
  }

  const handleClear = () => {
    setQuery('')
    if (onClear) {
      onClear()
    } else {
      onSearch('')
    }
  }

  const SearchIcon = () => (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )

  const ClearIcon = () => (
    <button
      type="button"
      onClick={handleClear}
      className="text-gray-400 transition-colors hover:text-gray-600"
      aria-label="Clear search"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm">
      <div className="flex-1">
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          leftIcon={<SearchIcon />}
          rightIcon={query && <ClearIcon />}
          className={showButton ? 'rounded-r-none' : ''}
        />
      </div>

      {showButton && (
        <Button
          type="submit"
          variant="primary"
          size={size}
          disabled={disabled}
          className="rounded-l-none border-l-0"
        >
          {buttonText}
        </Button>
      )}
    </form>
  )
}

// Pre-configured search bar variants
export const AutoSearchBar: React.FC<Omit<SearchBarProps, 'autoSubmit'>> = (
  props,
) => <SearchBar autoSubmit showButton={false} {...props} />

export const CompactSearchBar: React.FC<
  Omit<SearchBarProps, 'size' | 'showButton'>
> = (props) => <SearchBar size="sm" showButton={false} {...props} />
