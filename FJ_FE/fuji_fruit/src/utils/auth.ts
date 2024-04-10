import { User } from 'src/types/user.type'

export const setAccessTokentoLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const setUserRolestoLS = (user_roles: string) => {
  localStorage.setItem('user_roles', user_roles)
}

export const getUserRolesFromLS = () => localStorage.getItem('user_roles') || ''

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  localStorage.removeItem('user_roles')
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
