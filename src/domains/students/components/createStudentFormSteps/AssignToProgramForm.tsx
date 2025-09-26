import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import type { Program } from "@/domains/programs/types";

type Props = {
  programs: Program[] | undefined;
  onPrev: () => void;
};

export default function AssignToProgramForm({ programs, onPrev }: Props) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  if (!programs) return null;

  return (
    <div className="flex flex-col gap-12 w-full">
      <FormField
        control={control}
        name="step2.programId"
        render={({ field }) => (
          <FormItem className="flex-1 font-poppins">
            <FormLabel>
              Program <span className="text-red-500">*</span>
            </FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? programs.find((program) => program.id === field.value)
                          ?.name
                      : "Select Program..."}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0 font-poppins">
                <Command>
                  <CommandInput placeholder="Search Program..." />
                  <CommandList>
                    <CommandEmpty>No program found.</CommandEmpty>
                    <CommandGroup>
                      {programs.map((program) => (
                        <CommandItem
                          key={program.id}
                          value={program.name}
                          onSelect={() => {
                            field.onChange(program.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              program.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {program.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
