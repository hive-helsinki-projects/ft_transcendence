import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../assets/styles/SearchResults.css'
import axios from 'axios'

const SearchResults: React.FC = () => {
  const [users, setUsers] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:3001/users') // Use HTTP for localhost
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  // Extract the query string
  const queryParams = new URLSearchParams(location.search)
  const query = queryParams.get('query') || 'No query provided'

  // Filter users based on the query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  )

  // Navigate to the profile page of a user
  const handleClick = (id: number) => {
    navigate(`/profile/${id}`)
  }

  // If there is only one user, show the ProfilePage directly
  if (filteredUsers.length === 1) {
    navigate(`/profile/${filteredUsers[0].id}`)
    return null;
  }

  // Render the search results
  return (
    <div className="search-results">
      <h1>Search Results</h1>
      {filteredUsers.length > 0 ? (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <img src={user.avatar} alt="picture" className="avatar" />
              <span>{user.username}</span>
              <button onClick={() => handleClick(user.id)}>Show Profile</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found for "{query}"</p>
      )}
    </div>
  )
}

export default SearchResults