import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RoleGuard = ({ allowedRoutes = [], permissoes = [], children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  if (!user.roles || user.roles.length === 0) return null;

  if (user.roles.includes('admin')) return children;

  const temPapel =
    allowedRoutes.length === 0 ||
    user.roles.some((papel) => allowedRoutes.includes(papel));

  if (!temPapel) return null;

  const temPermissao =
    permissoes.length === 0 ||
    (user.permissoes || []).some((p) => permissoes.includes(p));

  if (!temPermissao) return null;

  return children;
};

export default RoleGuard;
