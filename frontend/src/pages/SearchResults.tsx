import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import '../assets/styles/SearchResults.css'
import axios from 'axios'
import ProfilePage from '../components/ProfilePage'

const SearchResults: React.FC = () => {
    const [users, setUsers] = React.useState([])
  const location = useLocation()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:3001/users')
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

  const handleClick = () => {
    console.log('Button clicked')
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  )

  if (filteredUsers.length === 1) {
    return (<div>
        <ProfilePage user={filteredUsers[0]} />
    </div>
    )}

  return (
    <div className="search-results">
      <h1>Search Results</h1>
        {filteredUsers.length > 1 ? (
            <ul>
            {filteredUsers.map((user) => (
                <div key={user.id}>
                <img src={user.avatar} alt="picture" className="avatar" /> <span>{user.username}</span> <button onClick={handleClick}>Show Profile</button>
                </div>
            ))}
            </ul>
        ) : (
            <p>No results found for "{query}"</p>
        )}
    </div>
  )
}

export default SearchResults