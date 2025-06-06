import { useQuery } from '@tanstack/react-query';
import { getSubmissions } from '../services/submissionService';
import { useState, useMemo, useEffect } from 'react';
import { type TableProps } from 'antd';
import { type Submission, type SubmissionData } from '../types';

type SubmissionTableColumns = TableProps<Submission>['columns'];

export const useSubmissions = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
    staleTime: 1000 * 60 * 5,
  });

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const allColumnNames = useMemo(() => data?.columns || [], [data]);
  
  useEffect(() => {
    if (allColumnNames.length > 0) {
      setVisibleColumns(allColumnNames);
    }
  }, [allColumnNames]);

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    if (!searchText) return data.data;

    const lowercasedSearchText = searchText.toLowerCase();
    
    return data.data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(lowercasedSearchText)
      )
    );
  }, [data?.data, searchText]);


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
    submissionsData: filteredData, 
    columns: tableColumns,
    allColumnNames,
    visibleColumns,
    setVisibleColumns,
    isLoading,
    isError,
    error,
    pagination,
    setPagination,
    setSearchText,
  };
};