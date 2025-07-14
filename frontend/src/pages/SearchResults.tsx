import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '@assets/styles/SearchResults.css'
import { API_URL } from '@utils/constants'
import { useTranslate } from '@hooks/index'
import axios from 'axios'

interface User {
  id: number
  username: string
}

export const SearchResults: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const t = useTranslate()

  // Extract the query string
  const queryParams = new URLSearchParams(location.search)
  const query = queryParams.get('query') || 'No query provided'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`)
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  // Filter users based on the query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase()),
  )

  // Navigate to the profile page of a user
  const handleClick = (id: number) => {
    navigate(`/profile/${id}`)
  }

  // Render the search results
  return (
    <div className="search-results">
      <h1 className="search-results-title">
        {query ? t('Search Results for', { query }) : t('All Users')}
      </h1>
      <p className="search-results-gray-text">
        {filteredUsers.length} {filteredUsers.length === 1 ? t('user') : t('users')} {t('found')}
      </p>

    {filteredUsers.length > 0 ? (
      <div>
          {filteredUsers.map((user) => (
            <div key={user.id} className="search-result-item">
             <div>
               <span className="search-results h2">{user.username}</span>
               <span className="search-results-gray-text">{t('User ID')}: {user.id}</span>
             </div>
             <button className="btn-primary" onClick={() => handleClick(user.id)}>{t('Show Profile')}</button>
            </div>
          ))}
      </div>
      ) : (
         <div>
           <p>{t('No results found for', { query })}</p>
         </div>
      )}
    </div>
  )
}
