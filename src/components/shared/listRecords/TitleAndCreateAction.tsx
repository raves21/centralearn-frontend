import { cn } from "../../../lib/utils";

type Props = {
  headerTitle: string;
  createAction: () => void;
  className?: string;
};

export default function TitleAndCreateAction({
  createAction,
  headerTitle,
  className,
}: Props) {
  return (
    <div
      className={cn("w-full flex items-center py-4 justify-between", className)}
    >
      <p className="text-2xl font-bold">{headerTitle}</p>
      <button
        onClick={createAction}
        className="px-5 py-3 text-white bg-mainaccent hover:bg-indigo-800 transition-colors rounded-md"
      >
        Create New
      </button>
    </div>
  );
}
