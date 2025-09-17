import React from 'react';

interface SortControlsProps {
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'username' | 'email' | 'status') => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortBy, sortOrder, onSort }) => {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleSort = (e: React.MouseEvent, field: 'username' | 'email' | 'status') => {
    e.preventDefault();
    e.stopPropagation();
    onSort(field);
  };

  return (
    <div className="sort-controls">
      <label className="sort-label">Сортировка:</label>
      <div className="sort-buttons">
        <button
          type="button"
          className={`sort-btn ${sortBy === 'username' ? 'active' : ''}`}
          onClick={(e) => handleSort(e, 'username')}
        >
          Имя пользователя {getSortIcon('username')}
        </button>
        <button
          type="button"
          className={`sort-btn ${sortBy === 'email' ? 'active' : ''}`}
          onClick={(e) => handleSort(e, 'email')}
        >
          Email {getSortIcon('email')}
        </button>
        <button
          type="button"
          className={`sort-btn ${sortBy === 'status' ? 'active' : ''}`}
          onClick={(e) => handleSort(e, 'status')}
        >
          Статус {getSortIcon('status')}
        </button>
      </div>
    </div>
  );
};

export default SortControls;