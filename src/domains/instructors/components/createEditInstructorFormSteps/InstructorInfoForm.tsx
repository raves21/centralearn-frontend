import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  onNext: () => void;
};

export default function InstructorInfoForm({ onNext }: Props) {
  const { control } = useFormContext();
  const navigate = useNavigate();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
        <div className="flex w-full gap-10">
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
        <div className="flex w-full gap-10">
          <FormField
            control={control}
            name="step1.jobTitle"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Job Title <span className="text-red-500">*</span>
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
            name="step1.isAdmin"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Give Admin rights <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between font-normal border border-gray-400"
                          )}
                        >
                          {field.value === true ? "Yes" : "No"}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 font-poppins">
                      <Command>
                        <CommandList>
                          <CommandItem
                            onSelect={() => {
                              field.onChange(false);
                              setIsPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === false
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            No
                          </CommandItem>
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                field.onChange(true);
                                setIsPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === true
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              Yes
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full gap-10">
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
      <div className="flex justify-between">
        <button
          onClick={() => navigate({ to: "/admin-panel/instructors" })}
          type="button"
          className="flex hover:bg-gray-400 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-gray-300 border-2 text-black"
        >
          Cancel
        </button>
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
