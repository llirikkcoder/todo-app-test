import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { validateToken } from './store/authSlice';
import TaskList from './components/TaskList';
import CreateTask from './components/CreateTask';
import LoginModal from './components/LoginModal';
import Header from './components/Header';
import './styles/App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(validateToken(token));
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <CreateTask />
          <TaskList />
        </div>
      </main>
      <LoginModal />
    </div>
  );
}

export default App;