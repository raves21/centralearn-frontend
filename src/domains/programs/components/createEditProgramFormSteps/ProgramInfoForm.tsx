import ImageUpload from "@/components/shared/form/ImageUpload";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  onNext: () => void;
  imageProps: {
    image: File | null;
    setImage: Dispatch<SetStateAction<File | null>>;
    preview: string | null;
    setPreview: Dispatch<SetStateAction<string | null>>;
  };
};

export default function ProgramInfoForm({ onNext, imageProps }: Props) {
  const { control } = useFormContext();
  const { image, preview, setImage, setPreview } = imageProps;

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex w-full gap-10">
          <FormField
            control={control}
            name="step1.name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="step1.code"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Code <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-start w-full gap-10">
          <FormField
            control={control}
            name="step1.description"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="shadow-none h-[200px] border-gray-400 resize-none focus-visible:ring-mainaccent focus-visible:border-none bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col flex-1 gap-2">
            <p>Image</p>
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
      <div className="flex justify-between">
        <button
          onClick={() => navigate({ to: "/programs" })}
          type="button"
          className="flex hover:bg-gray-400 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-gray-300 border-2 text-black"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          type="button"
          className="flex hover:bg-indigo-800 transition-colors font-medium px-4 hover:cursor-pointer disabled:hover:cursor-auto items-center justify-center gap-4 py-[10px] rounded-md bg-mainaccent border-2 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
