import React from 'react';
import { Navigate } from 'react-router-dom';
// Защита роута главной страницы от неавторизованных пользователей
// (этот компонент принимает другой компонент в качестве пропса
// он также может взять неограниченное число пропсов и передать их новому компоненту)
const ProtectedRoute = ({ element: Component, ...props }) =>  {
  return (
      props.isLoggedIn ? < Component { ...props } /> : < Navigate to='/signin' replace/>
  )
}

export default ProtectedRoute;