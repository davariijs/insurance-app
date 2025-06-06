import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useState } from 'react';
import { getAllForms, submitForm, type SubmitFormResponse } from '../services/formService';
import { createFormSchema } from '../lib/zodSchemas';
import { useTranslation } from 'react-i18next';

export const useInsuranceForm = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const { data: allForms, isLoading: isLoadingForms, isError: isFormsError } = useQuery({
    queryKey: ['allForms'],
    queryFn: getAllForms,
    staleTime: Infinity,
  });

  const selectedFormStructure = useMemo(() => {
    if (!selectedFormId || !allForms) return null;
    return allForms.find(form => form.formId === selectedFormId);
  }, [allForms, selectedFormId]);

  const formSchema = useMemo(() => {
    const fields = selectedFormStructure?.fields ?? [];
    return createFormSchema(fields, t);
  }, [selectedFormStructure, t]);

  const methods = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    methods.reset({});
  }, [selectedFormId, methods]);

  const { mutate, ...mutationResult } = useMutation<SubmitFormResponse, Error, FieldValues>({
    mutationFn: (formData) => submitForm(formData, selectedFormId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      methods.reset();
    },
    
    onError: (error) => {
      console.error("Submission failed:", error);
    },
  });


  return {
    allForms,
    isLoading: isLoadingForms,
    isError: isFormsError,
    setSelectedFormId,
    selectedFormStructure,
    methods,
    submit: mutate,
    isSubmitting: mutationResult.isPending,
    isSubmitSuccess: mutationResult.isSuccess,
    submitError: mutationResult.error,
  };
};