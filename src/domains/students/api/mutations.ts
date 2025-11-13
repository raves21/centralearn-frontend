import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateStudent() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/students", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useEditStudent() {
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      await api.post(`/students/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
}

export function useEnrollStudentToClass() {
  return useMutation({
    mutationFn: async ({
      studentId,
      classId,
    }: {
      studentId: string;
      classId: string;
    }) => {
      await api.post(`/students/${studentId}/enroll-to-class`, {
        course_class_id: classId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentEnrolledClasses"] });
      queryClient.invalidateQueries({ queryKey: ["studentEnrollableClasses"] });
    },
  });
}
