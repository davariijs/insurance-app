import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useState } from 'react';
import { getAllForms, submitForm, type SubmitFormResponse } from '../services/formService';
import { createFormSchema } from '../lib/zodSchemas';
import { useDebounce } from './useDebounce';

export const useInsuranceForm = () => {
  const queryClient = useQueryClient();
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    return createFormSchema(fields);
  }, [selectedFormStructure]);

  const methods = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  });

  const formValues = methods.watch();
  const debouncedFormValues = useDebounce(formValues, 1000);

  useEffect(() => {
    if (selectedFormId && Object.keys(debouncedFormValues).length > 0 && !isSubmitted) {
      localStorage.setItem(`form_draft_${selectedFormId}`, JSON.stringify(debouncedFormValues));
    }
  }, [debouncedFormValues, selectedFormId, isSubmitted]);

  useEffect(() => {
    if (selectedFormId) {
      setIsSubmitted(false); 
      
      try {
        const savedDraft = localStorage.getItem(`form_draft_${selectedFormId}`);
        if (savedDraft) {
          const draftValues = JSON.parse(savedDraft);
          methods.reset(draftValues);
        } else {
          methods.reset({});
        }
      } catch (error) {
        console.error("Failed to load or parse draft:", error);
        methods.reset({});
      }
    } else {
      methods.reset({});
    }
  }, [selectedFormId, methods]);
  


  const { mutate, ...mutationResult } = useMutation<SubmitFormResponse, Error, FieldValues>({
    mutationFn: (formData) => submitForm(formData, selectedFormId!),
    onSuccess: () => {
      if (selectedFormId) {
        localStorage.removeItem(`form_draft_${selectedFormId}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      methods.reset();
      
      setIsSubmitted(true);
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