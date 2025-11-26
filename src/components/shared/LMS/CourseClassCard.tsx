import type { CourseClass } from "@/domains/classes/types";
import { cn } from "@/lib/utils";

type Props = {
  courseClass: CourseClass;
  onClick: () => void;
};

export default function CourseClassCard({ courseClass, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="hover:border hover:border-mainaccent transition-all text-start bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm flex flex-col"
    >
      <div className="h-40 w-full">
        {courseClass.imageUrl ? (
          <img src={courseClass.imageUrl} className="size-full object-cover" />
        ) : (
          <div className="grid place-items-center size-full text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between font-medium text-gray-400">
          <div className="text-gray-400 font-medium">
            {courseClass.course.code}
            <span>&nbsp;|&nbsp;</span>
            {courseClass.section.name}
          </div>

          <p
            className={cn(
              "px-2 py-1 rounded font-semibold text-xs",
              courseClass.status === "open"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {courseClass.status === "open" ? "Open" : "Close"}
          </p>
        </div>
        <div className="space-y-2">
          <div className="font-semibold">{courseClass.course.name}</div>
          <div>{courseClass.semester.name}</div>
        </div>
      </div>
    </button>
  );
}
