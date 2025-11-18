import CourseClassCard from "@/components/shared/LMS/CourseClassCard";
import { useCourseClasses } from "@/domains/classes/api/queries";
import { Loader } from "lucide-react";

export default function AdminLmsClasses() {
  const { data: courseClasses, status: courseClassesStatus } = useCourseClasses(
    {}
  );

  if (courseClassesStatus === "error") {
    return (
      <div className="size-full grid place-items-center">
        <p className="text-xl font-medium">An error occured.</p>
      </div>
    );
  }

  if (courseClassesStatus === "pending") {
    return (
      <div className="size-full grid place-items-center">
        <Loader className="size-15 stroke-mainaccent animate-spin" />
      </div>
    );
  }

  if (courseClasses) {
    return (
      <div className="flex flex-col gap-12 h-full pb-12">
        <p className="text-2xl font-bold">Classes</p>
        {courseClasses.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {courseClasses.data.map((courseClass) => (
              <CourseClassCard courseClass={courseClass} />
            ))}
          </div>
        ) : (
          <div className="flex-grow grid place-items-center">
            <p className="pb-30 text-lg">No results</p>
          </div>
        )}
      </div>
    );
  }
}
