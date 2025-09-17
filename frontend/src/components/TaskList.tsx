import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchTasks, setSortBy, setSortOrder, setCurrentPage } from '../store/tasksSlice';
import TaskItem from './TaskItem';
import Pagination from './Pagination';
import SortControls from './SortControls';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, currentPage, totalPages, sortBy, sortOrder } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    dispatch(fetchTasks({
      page: currentPage,
      sortBy: sortBy || undefined,
      sortOrder
    }));
  }, [dispatch, currentPage, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleSort = (field: 'username' | 'email' | 'status') => {
    if (sortBy === field) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(field));
      dispatch(setSortOrder('asc'));
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="task-list-container">
      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">Нет задач</p>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TaskList;