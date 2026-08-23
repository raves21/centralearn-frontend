import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
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
import { CalendarIcon, X } from "lucide-react";

type Props = {
  value: Date | null | undefined;
  onSelect: (date: Date | undefined) => void;
  onClear: () => void;
  label: string;
  minDateTime?: Date;
};

export default function DateTimePicker({
  value,
  onSelect,
  onClear,
  label,
  minDateTime,
}: Props) {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "flex-1 pl-3 text-left font-normal",
                  !value && "text-muted-foreground",
                )}
              >
                {value ? format(value, "PP p") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[200]" align="start">
            <div className="p-2 border-b">
              <Input
                type="time"
                className="cursor-pointer [&::-webkit-calendar-picker-indicator]:ml-auto font-poppins"
                min={
                  minDateTime && value && isSameDay(value, minDateTime)
                    ? format(minDateTime, "HH:mm")
                    : undefined
                }
                value={value ? format(value, "HH:mm") : ""}
                onChange={(e) => {
                  const date = value || new Date();
                  const [hours, minutes] = e.target.value.split(":");
                  if (hours && minutes) {
                    const newDate = new Date(date);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    onSelect(newDate);
                  }
                }}
                onClick={(e) => e.currentTarget.showPicker()}
              />
            </div>
            <Calendar
              mode="single"
              selected={value || undefined}
              onSelect={(date) => {
                if (date) {
                  const current = value ? new Date(value) : new Date();
                  // Preserve time
                  date.setHours(current.getHours(), current.getMinutes());
                  onSelect(date);
                } else {
                  onSelect(undefined);
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onClear}
          disabled={!value}
          aria-label={`Clear ${label}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
}
