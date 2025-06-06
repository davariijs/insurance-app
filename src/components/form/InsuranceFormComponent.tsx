import { Form, Button } from 'antd';
import { FormProvider } from 'react-hook-form';
import type { UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form';
import type { FormStructure } from '../../types';
import DynamicFieldRenderer from './DynamicFieldRenderer';

interface InsuranceFormComponentProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  formStructure: FormStructure;
  isSubmitting: boolean;
}

const InsuranceFormComponent = <T extends FieldValues>({
  methods,
  onSubmit,
  formStructure,
  isSubmitting,
}: InsuranceFormComponentProps<T>) => {
  return (
    <FormProvider {...methods}>
      <Form layout="vertical" onFinish={methods.handleSubmit(onSubmit)}>
        {formStructure.fields.map((field) => (
          <DynamicFieldRenderer key={field.id} field={field} />
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </FormProvider>
  );
};

export default InsuranceFormComponent;