import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchTasks, setCurrentPage } from '../store/tasksSlice';
import TaskItem from './TaskItem';
import Pagination from './Pagination';
import SortControls from './SortControls';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error, currentPage, totalPages } = useSelector(
    (state: RootState) => state.tasks
  );
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchTasks({
      page: currentPage
    }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleSort = (field: 'username' | 'email' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    if (!sortBy) return tasks;

    const tasksCopy = [...tasks];
    return tasksCopy.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [tasks, sortBy, sortOrder]);

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
        {sortedTasks.length === 0 ? (
          <p className="no-tasks">Нет задач</p>
        ) : (
          sortedTasks.map(task => (
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