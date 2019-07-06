//storage that we can access from anywhere in component tree 
import React from 'react'
export default React.createContext({
token: '',
login: (token, userId, tokenExpiration) => {},
logout: () => {}

})