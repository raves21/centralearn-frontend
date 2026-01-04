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
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  minDateTime?: Date;
};

export default function DateTimePicker({
  control,
  name,
  label,
  minDateTime,
}: Props) {
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
                  className="cursor-pointer [&::-webkit-calendar-picker-indicator]:ml-auto"
                  min={
                    minDateTime &&
                    field.value &&
                    isSameDay(field.value, minDateTime)
                      ? format(minDateTime, "HH:mm")
                      : undefined
                  }
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
                  onClick={(e) => e.currentTarget.showPicker()}
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
                disabled={(date) => {
                  if (date < new Date("1900-01-01")) return true;
                  if (minDateTime) {
                    const minDateStart = new Date(minDateTime);
                    minDateStart.setHours(0, 0, 0, 0);
                    return date < minDateStart;
                  }
                  return false;
                }}
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
