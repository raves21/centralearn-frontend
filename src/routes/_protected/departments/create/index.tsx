import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ImageUpload from "@/components/shared/form/ImageUpload";
import { useState } from "react";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_protected/departments/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  return (
    <div className="size-full flex flex-col gap-16 pl-6">
      <div className="flex flex-col gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate({ to: "/departments" })}>
                Departments
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-2xl font-bold">Create Department</p>
      </div>
      <form className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex gap-10 w-full">
            <InputWithLabel label="Name" containerClassName="flex-1" />
            <InputWithLabel label="Code" containerClassName="flex-1" />
          </div>
          <div className="flex gap-10 w-full">
            <div className="flex flex-col flex-1 gap-3">
              <p>Description</p>
              <Textarea className="shadow-none h-[200px] border-gray-400 resize-none focus-visible:ring-mainaccent focus-visible:border-none bg-white" />
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <p>
                Image <span className="text-red-500">*</span>
              </p>
              <ImageUpload
                className="w-[360px]"
                imageProps={{
                  image,
                  setImage,
                }}
                previewProps={{
                  preview,
                  setPreview,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] text-white rounded-md bg-mainaccent">
            Create
          </button>
          <button className="flex font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-white border-2 border-gray-600/50 text-black">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
