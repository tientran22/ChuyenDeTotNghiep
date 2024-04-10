/* eslint-disable @typescript-eslint/no-unused-vars */
// app.context.js
import { createContext, useState } from 'react'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean

  setisAuthenticated: React.Dispatch<React.SetStateAction<boolean>>

  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

const initialAppcontext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),

  setisAuthenticated: () => null,

  profile: getProfileFromLS(),
  setProfile: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppcontext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setisAuthenticated] = useState<boolean>(initialAppcontext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppcontext.profile)

  return (
    <AppContext.Provider value={{ isAuthenticated, setisAuthenticated, profile, setProfile }}>
      {children}
    </AppContext.Provider>
  )
}
