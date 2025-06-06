import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Checkbox, InputNumber, DatePicker, Radio, Divider } from 'antd';
import { Controller, useFormContext, type ControllerRenderProps, type FieldValues } from 'react-hook-form';
import { type FormField, type FormFieldOption } from '../../types';
import { getDynamicOptions } from '../../services/locationService';
import dayjs, { type Dayjs } from 'dayjs';

interface DynamicFieldRendererProps {
  field: FormField;
  fieldNamePrefix?: string;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ field, fieldNamePrefix = '' }) => {
  const { control, watch, setValue } = useFormContext();
  const fieldName = fieldNamePrefix ? `${fieldNamePrefix}.${field.id}` : field.id;

  const [dynamicOptions, setDynamicOptions] = useState<FormFieldOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const isDynamicField = !!field.dynamicOptions;
  const dependentFieldName = isDynamicField ? (fieldNamePrefix ? `${fieldNamePrefix}.${field.dynamicOptions!.dependsOn}` : field.dynamicOptions!.dependsOn) : null;
  const dependentFieldValue = dependentFieldName ? watch(dependentFieldName) : null;

  useEffect(() => {
    if (!isDynamicField) return;

    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      setValue(fieldName, null, { shouldValidate: false });
      
      const options = await getDynamicOptions(
        field.dynamicOptions!.endpoint,
        field.dynamicOptions!.dependsOn,
        dependentFieldValue
      );
      
      setDynamicOptions(options);
      setIsLoadingOptions(false);
    };
    
    fetchOptions();

  }, [dependentFieldValue, isDynamicField, fieldName, setValue, field.dynamicOptions]);

  if (field.visibility) {
    const visibilityDependentFieldName = fieldNamePrefix ? `${fieldNamePrefix}.${field.visibility.dependsOn}` : field.visibility.dependsOn;
    const watchedVisibilityValue = watch(visibilityDependentFieldName);
    if (watchedVisibilityValue !== field.visibility.value) {
      return null;
    }
  }
  
  if (field.type === 'group') {
    return (
      <div style={{ border: '1px solid #f0f0f0', padding: '16px', borderRadius: 8, marginBottom: 16 }}>
        <Divider orientation="left" style={{ marginTop: 0 }}>{field.label}</Divider>
        {field.fields?.map(groupField => (
          <DynamicFieldRenderer key={groupField.id} field={groupField} fieldNamePrefix={fieldName} />
        ))}
      </div>
    );
  }

  const getNormalizedOptions = (): FormFieldOption[] => {
    const optionsSource = isDynamicField ? dynamicOptions : field.options;
    if (!optionsSource) return [];
    
    return optionsSource.map(opt => 
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );
  };
  
  const renderInputComponent = (controllerProps: ControllerRenderProps<FieldValues, string>) => {
    const commonProps = { ...controllerProps, style: { width: '100%' } };

    switch (field.type) {
      case 'text':
        return <Input {...commonProps} />;
      case 'number':
        return <InputNumber {...commonProps} />;
      case 'date': {
        const stringValue = controllerProps.value;
        const dayjsValue = stringValue && dayjs(stringValue).isValid() ? dayjs(stringValue) : null;
        const handleDateChange = (date: Dayjs | null, dateString: string | string[]) => {
          if (Array.isArray(dateString)) {
            controllerProps.onChange(dateString.length > 0 ? dateString[0] : null);
          } else {
            controllerProps.onChange(dateString || null);
          }
        };
        return (
          <DatePicker
            ref={commonProps.ref}
            onBlur={commonProps.onBlur}
            name={commonProps.name}
            value={dayjsValue}
            onChange={handleDateChange}
            style={commonProps.style}
            format="YYYY-MM-DD"
          />
        );
      }
      case 'select':
        return (
          <Select
            {...commonProps}
            options={getNormalizedOptions()}
            loading={isLoadingOptions}
            disabled={isLoadingOptions}
            placeholder={`Select ${field.label}`}
            showSearch
            optionFilterProp="label"
          />
        );
      case 'radio':
        return <Radio.Group {...commonProps} options={getNormalizedOptions()} />;
      case 'checkbox': {
        if (Array.isArray(field.options)) {
          return <Checkbox.Group {...commonProps} options={getNormalizedOptions()} />;
        }
        return <Checkbox {...commonProps} checked={!!commonProps.value}>{field.label}</Checkbox>;
      }
    }
    return null;
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