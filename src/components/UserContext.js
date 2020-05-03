import React from 'react'

const user = {id: null, email: null, name: null, isLoggedIn: false};

const UserContext = React.createContext(user);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;