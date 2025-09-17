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

  return (
    <div className="sort-controls">
      <label className="sort-label">Сортировка:</label>
      <div className="sort-buttons">
        <button
          className={`sort-btn ${sortBy === 'username' ? 'active' : ''}`}
          onClick={() => onSort('username')}
        >
          Имя пользователя {getSortIcon('username')}
        </button>
        <button
          className={`sort-btn ${sortBy === 'email' ? 'active' : ''}`}
          onClick={() => onSort('email')}
        >
          Email {getSortIcon('email')}
        </button>
        <button
          className={`sort-btn ${sortBy === 'status' ? 'active' : ''}`}
          onClick={() => onSort('status')}
        >
          Статус {getSortIcon('status')}
        </button>
      </div>
    </div>
  );
};

export default SortControls;