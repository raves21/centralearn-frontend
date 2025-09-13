import { cn } from "@/lib/utils";
import { Pen, X } from "lucide-react";
import { useState } from "react";

type Props = {
  className?: string;
  previewProps: {
    preview: string | null;
    setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  };
  imageProps: {
    image: File | null;
    setImage: React.Dispatch<React.SetStateAction<File | null>>;
  };
};

export default function ImageUpload({
  className,
  imageProps,
  previewProps,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  function onChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "") imageProps.setImage(selectedFile);
      previewProps.setPreview(URL.createObjectURL(selectedFile));
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "aspect-[4/3] w-[300px] overflow-hidden border-[3px] relative rounded-md border-dashed z-10 border-gray-700/50",
        className
      )}
    >
      {previewProps.preview && (
        <div className="relative size-full">
          <img
            src={previewProps.preview}
            className="absolute z-30 object-contain size-full"
          />
          <div
            className={cn(
              "opacity-0 transition-opacity duration-300 flex items-center justify-center gap-4 absolute size-full z-40",
              {
                "opacity-100 bg-gray-700/80": isHovered,
              }
            )}
          >
            <div className="rounded-full transition-colors group border-2 hover:bg-mainaccent hover:border-white relative size-[50px]">
              <input
                onChange={onChangeFile}
                type="file"
                accept="image/*"
                className="absolute inset-0 z-10 opacity-0 group-hover:cursor-pointer size-full"
              />
              <Pen className="size-[50%] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute transition-colors group-hover:stroke-white stroke-white pointer-events-none" />
            </div>

            <button
              onClick={() => {
                previewProps.setPreview(null);
                imageProps.setImage(null);
              }}
              className="rounded-full transition-colors group border-2 hover:bg-red-500 hover:border-white grid place-items-center size-[50px]"
            >
              <X className="size-[50%] transition-colors group-hover:stroke-white stroke-white" />
            </button>
          </div>
        </div>
      )}
      <input
        onChange={onChangeFile}
        type="file"
        accept="image/*"
        className="z-20 opacity-0 size-full"
      />
      {!imageProps.image && (
        <p className="absolute text-center text-gray-600 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 -z-10">
          Click here to upload image
        </p>
      )}
    </div>
  );
}
