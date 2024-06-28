// components/Pagination.tsx
import React from "react";
import styles from "./Pagination.module.css";
import { useAppContext } from "@/app/contexts/AppContext";

const Pagination: React.FC = () => {
  const { totalPages, setPage, page: currentPage } = useAppContext();

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${page === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
