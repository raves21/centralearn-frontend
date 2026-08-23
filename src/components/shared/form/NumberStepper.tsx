import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onInput: (value: number) => void;
  min: number;
  max: number;
  className?: string;
  valueInputClassName?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function NumberStepper({
  value,
  onIncrease,
  onDecrease,
  onInput,
  min,
  max,
  className,
  valueInputClassName,
}: Props) {
  const [rawValue, setRawValue] = useState(String(value));

  useEffect(() => {
    setRawValue(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    const clamped = clamp(Number.isNaN(parsed) ? min : parsed, min, max);
    onInput(clamped);
    setRawValue(String(clamped));
  };

  return (
    <div
      className={cn(
        "flex items-stretch w-fit border rounded-md overflow-hidden",
        className,
      )}
    >
      <Input
        type="number"
        min={min}
        max={max}
        value={rawValue}
        onChange={(e) => setRawValue(e.target.value)}
        onBlur={() => commit(rawValue)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(rawValue);
            e.currentTarget.blur();
          }
        }}
        className={cn(
          "w-[150px] text-center font-semibold border-0 rounded-none shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          valueInputClassName,
        )}
      />
      <div className="flex flex-col border-l">
        <button
          type="button"
          onClick={onIncrease}
          disabled={value >= max}
          aria-label="Increase value"
          className="flex items-center justify-center px-2 h-5 border-b hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onDecrease}
          disabled={value <= min}
          aria-label="Decrease value"
          className="flex items-center justify-center px-2 h-5 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
