import { useState } from 'react';

interface SortableData {
  [key: string]: any;
}

const useSortData = (data: Array<SortableData>) => {
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  const handleRequestSort = (key: string) => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortData = () => {
    if (sortConfig.key) {
      const sortedData = [...data];
      sortedData.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return sortedData;
    }
    return data;
  };

  return { sortedData: sortData(), requestSort: handleRequestSort, sortConfig, handleRequestSort };
};

export default useSortData;
