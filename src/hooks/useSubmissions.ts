import { useQuery } from '@tanstack/react-query';
import { getSubmissions } from '../services/submissionService';
import { useState, useMemo, useEffect } from 'react';
import type { TableProps } from 'antd';
import type { Submission, SubmissionData } from '../types';

type SubmissionTableColumns = TableProps<Submission>['columns'];

export const useSubmissions = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
    staleTime: 1000 * 60 * 5, 
  });

  const allColumnNames = useMemo(() => data?.columns || [], [data]);
  
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    if (allColumnNames.length > 0) {
      setVisibleColumns(allColumnNames);
    }
  }, [allColumnNames]);

  const tableColumns = useMemo((): SubmissionTableColumns => {
    if (!allColumnNames.length) return [];
    
    const filteredColumns = allColumnNames.filter(colName =>
      visibleColumns.includes(colName)
    );
    
    return filteredColumns.map((colName: keyof SubmissionData) => ({
      title: colName,
      dataIndex: colName,
      key: colName,
      sorter: (a: Submission, b: Submission) => {
        const valA = a[colName];
        const valB = b[colName];
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return valA - valB;
        }
        return 0;
      },
    }));
  }, [allColumnNames, visibleColumns]);

  return {
    submissionsData: data?.data || [],
    columns: tableColumns,
    allColumnNames,
    visibleColumns,
    setVisibleColumns,
    isLoading,
    isError,
    error,
  };
};