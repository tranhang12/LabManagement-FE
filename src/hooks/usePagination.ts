import { useState } from 'react';

interface PaginatableData {
  [key: string]: any;
}

const usePagination = (data: Array<PaginatableData> | null, itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedData = () => {
    if (data) {
      return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }
    return [];
  };

  return { paginatedData: paginatedData(), totalPages, currentPage, handleChangePage };
};

export default usePagination;
