import { createContext } from "react"
//manage user state across the application
const UserCTX = createContext({user: null, setUser: ()=>{}})

export default UserCTX