import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
};

export default function DateTimePicker({ control, name, label }: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PP p")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[200]" align="start">
              <div className="p-2 border-b">
                <Input
                  type="time"
                  value={field.value ? format(field.value, "HH:mm") : ""}
                  onChange={(e) => {
                    const date = field.value || new Date();
                    const [hours, minutes] = e.target.value.split(":");
                    if (hours && minutes) {
                      const newDate = new Date(date);
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      field.onChange(newDate);
                    }
                  }}
                />
              </div>
              <Calendar
                mode="single"
                selected={field.value || undefined}
                onSelect={(date) => {
                  if (date) {
                    const current = field.value
                      ? new Date(field.value)
                      : new Date();
                    // Preserve time
                    date.setHours(current.getHours(), current.getMinutes());
                    field.onChange(date);
                  } else {
                    field.onChange(date);
                  }
                }}
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
