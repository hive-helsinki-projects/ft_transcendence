import { useParams } from 'react-router-dom'
import { GetUserPlayers, FriendList, IncomingFriendRequests, UserMatchHistory, FriendStatusButton } from '@components/features/profile'
import { useTranslate, useFriends, useUserProfile } from '@hooks/index'

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const t = useTranslate()
  const { friends, loading: friendsLoading, error: friendsError, refetch: refetchFriends } = useFriends()
  const { user, loading, error, isOwnProfile } = useUserProfile(id)

  if (loading) return <div><h2>{t('profile.loadingProfile')}</h2></div>
  if (error) return <div><h2>{t('profile.error')}</h2><p>{error}</p></div>
  if (!user) return <div><h2>{t('profile.userNotFound')}</h2></div>

  return (
    <>
      <h1>{t('profile.title', { username: user.username })}</h1>
      <div>
        {isOwnProfile && (
          <IncomingFriendRequests onFriendAccepted={refetchFriends} />
        )}
        
        {!isOwnProfile && (
          <FriendStatusButton 
            user={{
              id: user.id,
              username: user.username,
              online_status: user.online_status
            }}
          />
        )}
        
        {isOwnProfile && (
          <FriendList 
            friends={friends} 
            loading={friendsLoading} 
            error={friendsError}
            isOwnProfile={isOwnProfile}
            targetUser={user}
            onFriendRemoved={refetchFriends}
          />
        )}
        
        <GetUserPlayers userId={user.id} />
        <UserMatchHistory userId={String(user.id)} />
      </div>
    </>
  )
}
