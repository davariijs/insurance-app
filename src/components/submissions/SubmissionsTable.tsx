import React, { useMemo } from 'react';
import { Table, Dropdown, Button, Checkbox, Input, type TableProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { type Submission } from '../../types';

interface SubmissionsTableProps {
  columns: TableProps<Submission>['columns'];
  dataSource: Submission[];
  isLoading: boolean;
  allColumnNames: string[];
  visibleColumns: string[];
  onVisibleColumnsChange: (columns: string[]) => void;
  pagination: { current: number; pageSize: number };
  onPaginationChange: (page: number, pageSize: number) => void;
  onSearch: (text: string) => void;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  columns,
  dataSource,
  isLoading,
  allColumnNames,
  visibleColumns,
  onVisibleColumnsChange,
  pagination,
  onPaginationChange,
  onSearch,
}) => {

  const menuItems = useMemo(() => {
    return allColumnNames.map(name => ({
      key: name,
      label: (
        <Checkbox
          checked={visibleColumns.includes(name)}
          onClick={(e) => e.stopPropagation()}
        >
          {name}
        </Checkbox>
      ),
    }));
  }, [allColumnNames, visibleColumns]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const newVisibleColumns = visibleColumns.includes(key)
      ? visibleColumns.filter(c => c !== key)
      : [...visibleColumns, key];
    onVisibleColumnsChange(newVisibleColumns);
  };

  return (
    <>
      <div className="table-controls-wrapper">
        <Input.Search
          placeholder="Search in table..."
          onSearch={onSearch}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
          size="large"
          className="table-search-input"
        />
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']}>
          <Button size="large">
            Customize columns <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <Table<Submission>
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{
            ...pagination,
            total: dataSource.length,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={(newPagination) => {
            onPaginationChange(newPagination.current!, newPagination.pageSize!);
        }}
      />
    </>
  );
};

export default SubmissionsTable;