import { Card, Typography, Result, Empty } from 'antd';
import { useSubmissions } from '../hooks/useSubmissions';
import SubmissionsTable from '../components/submissions/SubmissionsTable';

const SubmissionsListPage = () => {
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
          title="Could Not Fetch Submissions"
          subTitle={(error as Error)?.message || 'Please check your connection and try again.'}
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
            <Empty description="No submissions found. Start by filling out a new application!" />
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
    <Card 
      className="page-card" 
      title={<Typography.Title level={3}>My Submitted Applications</Typography.Title>}
    >
      {renderContent()}
    </Card>
  );
};

export default SubmissionsListPage;