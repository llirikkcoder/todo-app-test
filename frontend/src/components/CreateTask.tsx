import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createTask, fetchTasks } from '../store/tasksSlice';
import {
  setCreateTaskFormField,
  setCreateTaskFormErrors,
  setCreateTaskFormSuccess,
  setCreateTaskFormSubmitting,
  resetCreateTaskForm
} from '../store/uiSlice';

const CreateTask: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { username, email, text, errors, success, isSubmitting } = useSelector(
    (state: RootState) => state.ui.createTaskForm
  );
  const formData = { username, email, text };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.text.trim()) {
      newErrors.text = 'Текст задачи обязателен';
    }

    dispatch(setCreateTaskFormErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(setCreateTaskFormSubmitting(true));
    dispatch(setCreateTaskFormSuccess(false));

    try {
      await dispatch(createTask(formData)).unwrap();

      dispatch(resetCreateTaskForm());
      dispatch(setCreateTaskFormSuccess(true));

      setTimeout(() => dispatch(setCreateTaskFormSuccess(false)), 3000);

      dispatch(fetchTasks({ page: 1 }));
    } catch (error) {
      dispatch(setCreateTaskFormErrors({ general: 'Ошибка при создании задачи' }));
    } finally {
      dispatch(setCreateTaskFormSubmitting(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setCreateTaskFormField({ field: name as 'username' | 'email' | 'text', value }));

    if (errors[name]) {
      dispatch(setCreateTaskFormErrors({ ...errors, [name]: '' }));
    }
  };

  return (
    <div className="create-task">
      <h2>Создать новую задачу</h2>

      {success && (
        <div className="alert alert-success">
          Задача успешно добавлена!
        </div>
      )}

      {errors.general && (
        <div className="alert alert-error">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-task-form">
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="text">Текст задачи</label>
          <textarea
            id="text"
            name="text"
            value={text}
            onChange={handleChange}
            className={errors.text ? 'error' : ''}
            rows={3}
            disabled={isSubmitting}
          />
          {errors.text && <span className="error-message">{errors.text}</span>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создание...' : 'Создать задачу'}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;