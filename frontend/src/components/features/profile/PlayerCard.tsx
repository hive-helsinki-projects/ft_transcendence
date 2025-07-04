
interface Match {
  id: number
  opponent: string
  result: 'Win' | 'Loss'
  date: string
  score: string
}

export const PlayerCard = ({ player }) => {
  return (
    <div>
      <h1>PlayerCard</h1>
      <p>Avatar_url: {player.avatar_url} </p>
      <p>Display name: {player.display_name} </p>
      <p>Wins: {player.wins} </p>
      <p>Losses: {player.losses}</p>
    </div>
  )
}
