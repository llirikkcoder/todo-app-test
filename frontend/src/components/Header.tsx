import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="container">
        <h1>ToDo List</h1>
        <div className="auth-controls">
          {isAuthenticated ? (
            <>
              <span className="username">Admin: {user?.username}</span>
              <button className="btn btn-logout" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <button className="btn btn-login" onClick={() => setShowLoginModal(true)}>
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;