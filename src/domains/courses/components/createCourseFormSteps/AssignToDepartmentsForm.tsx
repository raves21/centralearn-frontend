import type { Department } from "@/domains/departments/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { useFormContext } from "react-hook-form";

type Props = {
  departments: Department[] | undefined;
  onPrev: () => void;
};

export default function AssignToDepartmentsForm({
  departments,
  onPrev,
}: Props) {
  const { control } = useFormContext();

  if (!departments) return null;

  return (
    <div className="flex flex-col gap-12 w-full">
      <FormField
        control={control}
        name="step2.departments"
        render={({ field }) => (
          <FormItem className="flex-1 font-poppins">
            <FormLabel>
              Department/s <span className="text-red-500">*</span>
            </FormLabel>
            <MultiSelect onValuesChange={field.onChange} values={field.value}>
              <FormControl>
                <MultiSelectTrigger className="w-full">
                  <MultiSelectValue placeholder="Select Departments..." />
                </MultiSelectTrigger>
              </FormControl>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {departments.map((department) => (
                    <MultiSelectItem value={department.id}>
                      {department.name}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          type="button"
          className="flex hover:gray-500 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-gray-300 border-2 text-black"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex hover:bg-indigo-800 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-mainaccent border-2 text-white"
        >
          Create
        </button>
      </div>
    </div>
  );
}
