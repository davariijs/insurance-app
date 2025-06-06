import React from 'react';
import { Form, Button } from 'antd';
import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';
import { type FormStructure, type FormField } from '../../types';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableFormItem: React.FC<{ field: FormField }> = ({ field }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    marginBottom: '24px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DynamicFieldRenderer field={field} dragHandleProps={{ listeners, attributes }} />
    </div>
  );
};

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
          <SortableFormItem key={field.id} field={field} />
        ))}
        <Form.Item style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </FormProvider>
  );
};

export default InsuranceFormComponent;
