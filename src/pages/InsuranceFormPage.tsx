import { useEffect, useState } from 'react';
import { Spin, Card, Typography, App as AntdApp, Result, Select, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useInsuranceForm } from '../hooks/useInsuranceForm';
import InsuranceFormComponent from '../components/form/InsuranceFormComponent';
import { type FieldValues } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { type FormField } from '../types';

const InsuranceFormPage = () => {
  const navigate = useNavigate();
  const { notification } = AntdApp.useApp();
  const {
    allForms,
    isLoading,
    isError,
    setSelectedFormId,
    selectedFormStructure,
    methods,
    submit,
    isSubmitting,
    isSubmitSuccess,
    submitError,
  } = useInsuranceForm();

  const [formFields, setFormFields] = useState<FormField[]>([]);

  useEffect(() => {
    if (selectedFormStructure?.fields) {
      setFormFields(selectedFormStructure.fields);
    } else {
      setFormFields([]);
    }
  }, [selectedFormStructure]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFormSubmit = (data: FieldValues) => {
    submit(data);
  };

  useEffect(() => {
    if (isSubmitSuccess) {
      notification.success({
        message: 'Submission Successful',
        description: 'Your application has been received.',
        duration: 2,
        onClose: () => {
          navigate('/');
        },
      });
    }
    if (submitError) {
      notification.error({
        message: 'Submission Failed',
        description: (submitError as Error).message,
      });
    }
  }, [isSubmitSuccess, submitError, navigate, notification]);

  if (isLoading) {
    return <Spin size="large" fullscreen />;
  }

  if (isError || !allForms) {
    return (
      <Result
        status="500"
        title="Failed to Load Form"
        subTitle="Sorry, we couldn't load the form structure. Please try again later."
      />
    );
  }

  return (
    <Card
      className="page-card"
      title={<Typography.Title level={3}>Smart Insurance Application</Typography.Title>}
    >
      <Select
        placeholder="Please select an insurance type"
        style={{ width: '100%', marginBottom: 24 }}
        onChange={(value) => setSelectedFormId(value)}
        options={allForms.map((form) => ({ value: form.formId, label: form.title }))}
        allowClear
      />

      {selectedFormStructure ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={formFields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <InsuranceFormComponent
              methods={methods}
              onSubmit={handleFormSubmit}
              formStructure={{ ...selectedFormStructure, fields: formFields }}
              isSubmitting={isSubmitting}
            />
          </SortableContext>
        </DndContext>
      ) : (
        <Empty description="Select an insurance type to begin." style={{ marginTop: 48 }} />
      )}
    </Card>
  );
};

export default InsuranceFormPage;
