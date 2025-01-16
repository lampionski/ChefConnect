const { createContext } = require("react");

const UserCTX = createContext({user: null, setUser: ()=>{}})

export default UserCTX