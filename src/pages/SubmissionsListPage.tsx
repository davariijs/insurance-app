import { Card, Typography, Result, Empty } from 'antd';
import { useSubmissions } from '../hooks/useSubmissions';
import SubmissionsTable from '../components/submissions/SubmissionsTable';
import { useTranslation } from 'react-i18next';

const SubmissionsListPage = () => {
  const { t } = useTranslation();
  const {
    submissionsData,
    columns,
    allColumnNames,
    visibleColumns,
    setVisibleColumns,
    isLoading,
    isError,
    error,
    pagination,
    setPagination,
    setSearchText,
  } = useSubmissions();

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize: pageSize });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <SubmissionsTable
          dataSource={[]}
          columns={[]}
          isLoading={true}
          allColumnNames={[]}
          visibleColumns={[]}
          onVisibleColumnsChange={() => {}}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          onSearch={setSearchText}
        />
      );
    }

    if (isError) {
      return (
        <Result
          status="warning"
          title={t('error.submissions_load_failed_title')}
          subTitle={(error as Error)?.message || t('error.submissions_load_failed_desc')}
        />
      );
    }

    if (submissionsData.length === 0 && !isLoading) {
      return (
          <>
            <SubmissionsTable
              dataSource={[]}
              columns={columns}
              isLoading={false}
              allColumnNames={allColumnNames}
              visibleColumns={visibleColumns}
              onVisibleColumnsChange={setVisibleColumns}
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
              onSearch={setSearchText}
            />
            <Empty description={t('table.empty_text')} />
          </>
      );
    }

    return (
      <SubmissionsTable
        dataSource={submissionsData}
        columns={columns}
        isLoading={false}
        allColumnNames={allColumnNames}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onSearch={setSearchText}
      />
    );
  };

  return (
    <Card title={<Typography.Title level={3}>{t('page_title_submissions')}</Typography.Title>}>
      {renderContent()}
    </Card>
  );
};

export default SubmissionsListPage;