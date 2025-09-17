import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { createTask, fetchTasks } from '../store/tasksSlice';

const CreateTask: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    text: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);

    try {
      await dispatch(createTask(formData)).unwrap();

      setFormData({
        username: '',
        email: '',
        text: ''
      });
      setErrors({});
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);

      dispatch(fetchTasks({ page: 1 }));
    } catch (error) {
      setErrors({ general: 'Ошибка при создании задачи' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
            value={formData.username}
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
            value={formData.email}
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
            value={formData.text}
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