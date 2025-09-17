import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { updateTask, fetchTasks } from '../store/tasksSlice';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentPage, sortBy, sortOrder } = useSelector((state: RootState) => state.tasks);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleStatusChange = async () => {
    if (!isAuthenticated) return;

    await dispatch(updateTask({
      id: task.id,
      data: { status: task.status === 'completed' ? 'pending' : 'completed' }
    }));

    dispatch(fetchTasks({
      page: currentPage,
      sortBy: sortBy || undefined,
      sortOrder
    }));
  };

  const handleTextEdit = async () => {
    if (!isAuthenticated) return;

    if (editedText !== task.text) {
      await dispatch(updateTask({
        id: task.id,
        data: { text: editedText }
      }));

      dispatch(fetchTasks({
        page: currentPage,
        sortBy: sortBy || undefined,
        sortOrder
      }));
    }

    setIsEditing(false);
  };

  const renderText = () => {
    const text = task.text.replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/');

    return text;
  };

  return (
    <div className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-info">
          <span className="task-username">{task.username}</span>
          <span className="task-email">{task.email}</span>
        </div>
        <div className="task-status-badges">
          {task.status === 'completed' && (
            <span className="badge badge-completed">Выполнено</span>
          )}
          {task.editedByAdmin && (
            <span className="badge badge-edited">Отредактировано администратором</span>
          )}
        </div>
      </div>

      <div className="task-content">
        {isEditing && isAuthenticated ? (
          <div className="task-edit">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="task-edit-textarea"
            />
            <div className="task-edit-actions">
              <button className="btn btn-save" onClick={handleTextEdit}>
                Сохранить
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => {
                  setEditedText(task.text);
                  setIsEditing(false);
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <p className="task-text">{renderText()}</p>
        )}
      </div>

      {isAuthenticated && (
        <div className="task-actions">
          <button
            className="btn btn-checkbox"
            onClick={handleStatusChange}
          >
            {task.status === 'completed' ? '✓' : '☐'}
            {task.status === 'completed' ? 'Отменить выполнение' : 'Отметить выполненным'}
          </button>
          {!isEditing && (
            <button
              className="btn btn-edit"
              onClick={() => setIsEditing(true)}
            >
              Редактировать
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;