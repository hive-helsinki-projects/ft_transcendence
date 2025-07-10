import React, { useState } from 'react'
import '../assets/styles/SearchBar.css' // Import the CSS file
import { useTranslate } from '@hooks/index'

interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(query)
  }

  const t = useTranslate()

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <input
        className="search-bar-input"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={`${t('Search')}...`}
      />
      <button className="search-bar-button" type="submit">
        {t('Search')}
      </button>
    </form>
  )
}

export default SearchBar
