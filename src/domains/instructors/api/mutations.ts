import { api } from "@/utils/axiosBackend";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useCreateInstructor() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post("/instructors", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
    },
  });
}

export function useEditInstructor() {
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      await api.post(`/instructors/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      queryClient.invalidateQueries({ queryKey: ["instructor"] });
    },
  });
}

export function useAssignInstructorToClass() {
  return useMutation({
    mutationFn: async ({
      instructorId,
      classId,
    }: {
      instructorId: string;
      classId: string;
    }) => {
      await api.post(`/instructors/${instructorId}/assign-to-class`, {
        course_class_id: classId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["instructorAssignedClasses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructorAssignableClasses"],
      });
    },
  });
}
