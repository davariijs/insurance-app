import { Spin, Card, Typography, App as AntdApp, Result, Select, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { useInsuranceForm } from '../hooks/useInsuranceForm';
import InsuranceFormComponent from '../components/form/InsuranceFormComponent';
import { useEffect } from 'react';
import type { FieldValues } from 'react-hook-form';

const InsuranceFormPage = () => {
  const { t } = useTranslation();
  const { notification } = AntdApp.useApp();

  const {
    allForms,
    isLoading,
    isError,
    setSelectedFormId,
    selectedFormStructure,
    methods,
    submit,
    isPending: isSubmitting,
    isSuccess: isSubmitSuccess,
    error: submitError,
  } = useInsuranceForm();

  useEffect(() => {
    if (isSubmitSuccess) {
      notification.success({
        message: t('notification.submit_success_title'),
        description: t('notification.submit_success_desc'),
        placement: 'topRight',
      });
    }
    if (submitError) {
      notification.error({
        message: t('notification.submit_error_title'),
        description: (submitError as Error).message || t('notification.submit_error_desc'),
        placement: 'topRight',
      });
    }
  }, [isSubmitSuccess, submitError, notification, t]);

  const handleFormSubmit = (data: FieldValues) => {
    submit(data);
  };

  if (isLoading) {
    return <Spin size="large" fullscreen />;
  }

  if (isError) {
    return <Result status="500" title={t('error.form_load_failed_title')} />;
  }

  return (
    <Card>
      <Typography.Title level={3}>{t('page_title_form')}</Typography.Title>
      <Select
        placeholder="Please select an insurance type"
        style={{ width: '100%', marginBottom: 24 }}
        onChange={(value) => setSelectedFormId(value)}
        options={allForms?.map(form => ({ value: form.formId, label: form.title }))}
      />

      {selectedFormStructure ? (
        <InsuranceFormComponent
          methods={methods}
          onSubmit={handleFormSubmit}
          formStructure={selectedFormStructure}
          isSubmitting={isSubmitting}
        />
      ) : (
        <Empty description="Select an insurance type to begin." />
      )}
    </Card>
  );
};

export default InsuranceFormPage;