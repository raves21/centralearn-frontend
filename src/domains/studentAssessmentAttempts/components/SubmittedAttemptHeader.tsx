import { NotebookPen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  assessmentName: string;
  chapterName: string;
  classId: string;
};

export default function SubmittedAttemptHeader({
  assessmentName,
  chapterName,
  classId,
}: Props) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link
                  to="/lms/classes/$classId"
                  params={{
                    classId,
                  }}
                >
                  {chapterName}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{assessmentName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-4 p-6 rounded-md bg-white w-full">
          <NotebookPen className="size-8" />
          <div className="flex items-center gap-5">
            <p className="text-2xl font-bold">{assessmentName}</p>
            <p className="py-1 px-2 rounded-md bg-orange-200 text-orange-800 border border-orange-800">
              Read-Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
