import React from 'react';
import { Form, Input, Select, Checkbox, InputNumber, DatePicker, Radio, Divider } from 'antd';
import { Controller, useFormContext,  } from 'react-hook-form';
import type { FieldValues, ControllerRenderProps } from 'react-hook-form';
import type { FormField, FormFieldOption } from '../../types';

interface DynamicFieldRendererProps {
  field: FormField;
  fieldNamePrefix?: string;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ field, fieldNamePrefix = '' }) => {
  const { control, watch } = useFormContext();
  const fieldName = fieldNamePrefix ? `${fieldNamePrefix}.${field.id}` : field.id;

  if (field.visibility) {
    const dependentFieldName = fieldNamePrefix ? `${fieldNamePrefix}.${field.visibility.dependsOn}` : field.visibility.dependsOn;
    const watchedValue = watch(dependentFieldName);
    if (watchedValue !== field.visibility.value) {
      return null;
    }
  }

  if (field.type === 'group') {
    return (
      <div style={{ border: '1px solid #f0f0f0', padding: '0 16px 16px', borderRadius: 8, marginBottom: 16 }}>
        <Divider orientation="left" style={{ marginTop: 0 }}>{field.label}</Divider>
        {field.fields?.map(groupField => (
          <DynamicFieldRenderer key={groupField.id} field={groupField} fieldNamePrefix={fieldName} />
        ))}
      </div>
    );
  }

  const normalizeOptions = (): FormFieldOption[] => {
    if (!field.options) return [];
    return field.options.map(opt => (typeof opt === 'string' ? { label: opt, value: opt } : opt));
  };

  const renderInputComponent = (controllerProps: ControllerRenderProps<FieldValues, string>) => {
    const commonProps = { ...controllerProps, style: { width: '100%' } };

    switch (field.type) {
      case 'text': return <Input {...commonProps} />;
      case 'number': return <InputNumber {...commonProps} />;
      case 'date': return <DatePicker {...commonProps} format="YYYY-MM-DD" />;
      case 'select': return <Select {...commonProps} options={normalizeOptions()} />;
      case 'radio': return <Radio.Group {...commonProps} options={normalizeOptions()} />;
      case 'checkbox': { 
        if (Array.isArray(field.options)) {
          return <Checkbox.Group {...commonProps} options={normalizeOptions()} />;
        }
        return <Checkbox {...commonProps} checked={commonProps.value}>{field.label}</Checkbox>;
      }
    }
  };

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={field.defaultValue ?? null}
      render={({ field: controllerField, fieldState: { error } }) => (
        <Form.Item
          label={(field.type === 'checkbox' && !Array.isArray(field.options)) ? '' : field.label}
          validateStatus={error ? 'error' : ''}
          help={error?.message}
          required={field.required}
          {...(field.type === 'checkbox' && !Array.isArray(field.options) && { valuePropName: 'checked' })}
        >
          {renderInputComponent(controllerField)}
        </Form.Item>
      )}
    />
  );
};

export default DynamicFieldRenderer;