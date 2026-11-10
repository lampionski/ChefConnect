import { createContext } from "react"
//manage user state across the application
const UserCTX = createContext({user: null, setUser: ()=>{}, refreshUserData: async () => null})

export default UserCTX
