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

  const getButtonClassName = (field: string) => {
    return sortBy === field ? 'sort-btn active' : 'sort-btn';
  };

  const sortFields = [
    { field: 'username' as const, label: 'Имя пользователя' },
    { field: 'email' as const, label: 'Email' },
    { field: 'status' as const, label: 'Статус' }
  ];

  return (
    <div className="sort-controls">
      <label className="sort-label">Сортировка:</label>
      <div className="sort-buttons">
        {sortFields.map(({ field, label }) => (
          <button
            key={field}
            type="button"
            className={getButtonClassName(field)}
            onClick={(e) => handleSort(e, field)}
          >
            {label} {getSortIcon(field)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortControls;