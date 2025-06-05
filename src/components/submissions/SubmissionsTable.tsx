import React, { useMemo } from 'react';
import { Table, Dropdown, Button, Checkbox, Space, type TableProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { type Submission } from '../../types';

interface SubmissionsTableProps {
  columns: TableProps<Submission>['columns'];
  dataSource: Submission[];
  isLoading: boolean;
  allColumnNames: string[];
  visibleColumns: string[];
  onVisibleColumnsChange: (columns: string[]) => void;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  columns,
  dataSource,
  isLoading,
  allColumnNames,
  visibleColumns,
  onVisibleColumnsChange,
}) => {
  const { t } = useTranslation();

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
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'flex-end' }}>
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']}>
          <Button>
            {t('table.customize_columns')} <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
      <Table<Submission>
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </>
  );
};

export default SubmissionsTable;