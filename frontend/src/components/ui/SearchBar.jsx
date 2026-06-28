import { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || 'Search...'}
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchBar    