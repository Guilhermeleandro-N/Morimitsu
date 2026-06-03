import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const RoleGuard = ({allowedRoutes, children}) => {
  const {user} = useContext(AuthContext);
  console.log(user.roles)
  if (!user.roles.some(papeis => allowedRoutes.includes(papeis))){
    return null
  }

  return children
}

export default RoleGuard