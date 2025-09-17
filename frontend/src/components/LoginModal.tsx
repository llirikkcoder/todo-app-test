import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login, clearError } from '../store/authSlice';

const LoginModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
      setFormData({ username: '', password: '' });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleLoginClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('btn-login')) {
        setIsOpen(true);
      }
    };

    document.addEventListener('click', handleLoginClick);
    return () => document.removeEventListener('click', handleLoginClick);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = 'Имя пользователя обязательно';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await dispatch(login(formData));

    if (login.rejected.match(result)) {
      setFormErrors({ general: 'Неверные учетные данные' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (error) {
      dispatch(clearError());
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ username: '', password: '' });
    setFormErrors({});
    dispatch(clearError());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Вход для администратора</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {formErrors.general && (
            <div className="alert alert-error">
              {formErrors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={formErrors.username ? 'error' : ''}
              disabled={loading}
              placeholder="admin"
            />
            {formErrors.username && (
              <span className="error-message">{formErrors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={formErrors.password ? 'error' : ''}
              disabled={loading}
              placeholder="123"
            />
            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;