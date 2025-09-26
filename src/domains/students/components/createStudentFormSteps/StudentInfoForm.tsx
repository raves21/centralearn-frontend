import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

type Props = {
  onNext: () => void;
};

export default function StudentInfoForm({ onNext }: Props) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex w-full gap-10">
          <FormField
            control={control}
            name="step1.firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="step1.lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Last Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-start w-full gap-10">
          <FormField
            control={control}
            name="step1.address"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-start w-full gap-10">
          <FormField
            control={control}
            name="step1.email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="step1.password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          type="button"
          className="flex hover:bg-indigo-800 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-mainaccent border-2 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
