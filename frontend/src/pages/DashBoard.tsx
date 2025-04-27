// import { LogOut, Pencil, Settings, UserPlus } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import LoadingContainer from '../LoadingContainer'
// import { useAuth } from '../../hooks/auth/useAuth'
// import '../../../assets/styles/index.css'
// import { useNavigate } from 'react-router-dom'

// interface GameStats {
//   wins: number
//   losses: number
//   winRate: number
//   totalGames: number
// }

// interface TopPlayer {
//   id: string
//   name: string
//   points: number
//   avatar: string
// }

// interface UserPlayer {
//   id: string
//   name: string
//   avatar: string
//   isActive: boolean
//   points: number
// }

// interface MatchHistory {
//   id: string
//   player: {
//     name: string
//     avatar: string
//   }
//   opponent: {
//     name: string
//     avatar: string
//   }
//   result: 'win' | 'loss'
//   score: string
//   date: string
//   mode: '1v1' | 'tournament'
// }

// const CreatePlayerModal: React.FC<{
//   onClose: () => void
//   onCreatePlayer: (playerName: string) => void
// }> = ({ onClose, onCreatePlayer }) => {
//   const [playerName, setPlayerName] = useState('')

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (playerName.trim()) {
//       onCreatePlayer(playerName.trim())
//       onClose()
//     }
//   }

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h3>Create New Player</h3>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="text"
//               value={playerName}
//               onChange={(e) => setPlayerName(e.target.value)}
//               placeholder="Enter player name"
//               maxLength={20}
//               required
//             />
//           </div>
//           <div className="modal-actions">
//             <button type="button" onClick={onClose} className="cancel-button">
//               Cancel
//             </button>
//             <button type="submit" className="create-button">
//               Create Player
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// const GameStatsSection: React.FC<{ stats: GameStats }> = ({ stats }) => (
//   <div className="stats-section">
//     <h2>Your Stats</h2>
//     <div className="stats-grid">
//       <div className="stat-item">
//         <span className="stat-value">{stats.wins}</span>
//         <span className="stat-label">Wins</span>
//       </div>
//       <div className="stat-item">
//         <span className="stat-value">{stats.losses}</span>
//         <span className="stat-label">Losses</span>
//       </div>
//       <div className="stat-item">
//         <span className="stat-value">{stats.winRate}%</span>
//         <span className="stat-label">Win Rate</span>
//       </div>
//       <div className="stat-item">
//         <span className="stat-value">{stats.totalGames}</span>
//         <span className="stat-label">Total Games</span>
//       </div>
//     </div>
//   </div>
// )

// const QuickPlaySection: React.FC<{ userPlayers: UserPlayer[] }> = ({
//   userPlayers,
// }) => {
//   const navigate = useNavigate()
//   const hasActivePlayers = userPlayers.length > 0
//   const hasEnoughPlayers = userPlayers.length >= 2

//   const handleTournamentClick = () => {
//     if (!hasActivePlayers) {
//       alert('Please create a player before joining a tournament')
//       return
//     }
//     navigate('/tournament')
//   }

//   const handleOneVsOneClick = () => {
//     if (!hasActivePlayers) {
//       alert('Please create a player before starting a 1v1 match')
//       return
//     }
//     if (!hasEnoughPlayers) {
//       alert('You need at least 2 players to start a 1v1 match')
//       return
//     }
//     navigate('/game')
//   }

//   return (
//     <div className="quick-play-section">
//       <h2>Game Modes</h2>
//       <div className="play-options">
//         <button
//           className="play-button one-vs-one"
//           onClick={handleOneVsOneClick}
//         >
//           <span className="button-icon">🏓</span>
//           1v1 Match
//         </button>
//         <button
//           className="play-button matchmaking"
//           onClick={handleTournamentClick}
//           title="Tournament Mode (4-8 players)"
//         >
//           <span className="button-icon">🏆</span>
//           Tournament Mode
//           <span className="tournament-info">4-8 players</span>
//         </button>
//       </div>
//     </div>
//   )
// }

// const RecentMatchesSection: React.FC<{ matches: MatchHistory[] }> = ({
//   matches,
// }) => (
//   <div className="recent-matches-section">
//     <h2>Recent Matches</h2>
//     <div className="matches-list">
//       {matches.map((match) => (
//         <div key={match.id} className={`match-item ${match.result}`}>
//           <div className="match-info">
//             <span className="match-mode">
//               {match.mode === '1v1' ? '🏓' : '🏆'}
//             </span>
//             <div className="match-players">
//               {match.mode === '1v1' ? (
//                 // 1v1 match - show both players
//                 <>
//                   <div className="player">
//                     <img
//                       src={match.player.avatar}
//                       alt={match.player.name}
//                       className="player-avatar"
//                     />
//                     <span className="player-name">{match.player.name}</span>
//                   </div>
//                   <span className="vs">vs</span>
//                   <div className="player">
//                     <img
//                       src={match.opponent.avatar}
//                       alt={match.opponent.name}
//                       className="player-avatar"
//                     />
//                     <span className="player-name">{match.opponent.name}</span>
//                   </div>
//                 </>
//               ) : (
//                 // Tournament match - show only winner
//                 <div className="player">
//                   <img
//                     src={
//                       match.result === 'win'
//                         ? match.player.avatar
//                         : match.opponent.avatar
//                     }
//                     alt="Winner"
//                     className="player-avatar"
//                   />
//                   <span className="player-name tournament-winner">
//                     {match.result === 'win'
//                       ? match.player.name
//                       : match.opponent.name}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="match-details">
//             {match.mode === '1v1' && (
//               <span className="match-score">{match.score}</span>
//             )}
//             <span className="match-date">{match.date}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )

// const Dashboard: React.FC = () => {
//   const { username, logout } = useAuth()
//   const [avatar, setAvatar] = useState('')
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [userPlayers, setUserPlayers] = useState<UserPlayer[]>([])

//   const gameStats: GameStats = {
//     wins: 15,
//     losses: 8,
//     winRate: 65,
//     totalGames: 23,
//   }

//   const topPlayers: TopPlayer[] = [
//     {
//       id: '1',
//       name: 'Player1',
//       points: 12565,
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
//     },
//     {
//       id: '2',
//       name: 'Player2',
//       points: 10558,
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2',
//     },
//     {
//       id: '3',
//       name: 'Player3',
//       points: 9856,
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3',
//     },
//     {
//       id: '4',
//       name: 'Player4',
//       points: 7415,
//       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4',
//     },
//   ]

//   const recentMatches: MatchHistory[] = [
//     {
//       id: '1',
//       player: {
//         name: 'Player1',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
//       },
//       opponent: {
//         name: 'Player4',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4',
//       },
//       result: 'win',
//       score: '11-9',
//       date: '2h ago',
//       mode: '1v1',
//     },
//     {
//       id: '2',
//       player: {
//         name: 'Player2',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2',
//       },
//       opponent: {
//         name: 'Player5',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player5',
//       },
//       result: 'loss',
//       score: '9-11',
//       date: '3h ago',
//       mode: 'tournament',
//     },
//     {
//       id: '3',
//       player: {
//         name: 'Player3',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3',
//       },
//       opponent: {
//         name: 'Player6',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player6',
//       },
//       result: 'win',
//       score: '11-7',
//       date: '5h ago',
//       mode: '1v1',
//     },
//   ]

//   const handleCreatePlayer = (playerName: string) => {
//     const newPlayer: UserPlayer = {
//       id: Date.now().toString(),
//       name: playerName,
//       avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}-${Date.now()}`,
//       isActive: true,
//       points: 0,
//     }

//     setUserPlayers((prev) => [...prev, newPlayer])
//   }

//   useEffect(() => {
//     const savedAvatar = localStorage.getItem('avatar')
//     if (savedAvatar) {
//       setAvatar(savedAvatar)
//     } else {
//       const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&size=100`
//       setAvatar(randomAvatar)
//       localStorage.setItem('avatar', randomAvatar)
//     }
//   }, [username])

//   const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         const newAvatar = reader.result as string
//         setAvatar(newAvatar)
//         localStorage.setItem('avatar', newAvatar)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   if (!username) {
//     return <div>Please log in to view the dashboard</div>
//   }

//   return (
//     <LoadingContainer>
//       <div className="dashboard">
//         <div className="welcome-header">
//           <h1>Welcome, {username}!</h1>
//         </div>

//         <div className="players-management">
//           <div className="players-header">
//             <h2>Your Players</h2>
//             <button
//               className="create-player-button"
//               onClick={() => setShowCreateModal(true)}
//             >
//               <UserPlus size={16} />
//               <span>Create Player</span>
//             </button>
//           </div>
//           <div className="players-list">
//             {userPlayers.map((player) => (
//               <div
//                 key={player.id}
//                 className={`player-item ${player.isActive ? 'active' : ''}`}
//               >
//                 <img
//                   src={player.avatar}
//                   alt={`${player.name}'s avatar`}
//                   className="player-item-avatar"
//                 />
//                 <div className="player-item-info">
//                   <span className="player-item-name">{player.name}</span>
//                   <span className="player-item-points">
//                     {player.points} points
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <QuickPlaySection userPlayers={userPlayers} />

//         <div className="dashboard-grid">
//           <GameStatsSection stats={gameStats} />
//           <RecentMatchesSection matches={recentMatches} />
//         </div>

//         <div className="top-players-section">
//           <h2>TOP PLAYERS</h2>
//           <div className="players-grid">
//             {topPlayers.map((player) => (
//               <div key={player.id} className="player-card">
//                 <img
//                   src={player.avatar}
//                   alt={`${player.name}'s avatar`}
//                   className="player-avatar"
//                 />
//                 <div className="player-info">
//                   <span className="player-name">{player.name}</span>
//                   <span className="player-points">{player.points} points</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="avatar-container">
//           <img src={avatar} alt="User avatar" className="welcome-avatar" />
//           <div className="online-status" />
//           <div className="avatar-menu">
//             <div className="settings-avatar-container">
//               <img src={avatar} alt="User avatar" className="settings-avatar" />
//               <button
//                 type="button"
//                 className="settings-edit-button"
//                 onClick={() =>
//                   document.getElementById('avatar-upload')?.click()
//                 }
//                 aria-label="Edit avatar"
//               >
//                 <Pencil size={14} />
//               </button>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleAvatarChange}
//                 className="avatar-input"
//                 id="avatar-upload"
//                 aria-label="Upload profile picture"
//                 style={{ display: 'none' }}
//               />
//             </div>
//             <button className="avatar-menu-button">
//               <Settings size={16} />
//               <span>Profile Settings</span>
//             </button>
//             <button className="avatar-menu-button logout" onClick={logout}>
//               <LogOut size={16} />
//               <span>Sign Out</span>
//             </button>
//           </div>
//         </div>

//         {showCreateModal && (
//           <CreatePlayerModal
//             onClose={() => setShowCreateModal(false)}
//             onCreatePlayer={handleCreatePlayer}
//           />
//         )}
//       </div>
//     </LoadingContainer>
//   )
// }

// export default Dashboard
