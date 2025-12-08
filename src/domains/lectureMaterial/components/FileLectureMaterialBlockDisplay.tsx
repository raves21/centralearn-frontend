import type { FileAttachment } from "@/utils/sharedTypes";

type Props = {
  material: FileAttachment;
};

export default function FileLectureMaterialBlock({ material }: Props) {
  // Check if it's an image
  if (material.type === "image") {
    return (
      <div className="max-w-fit border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={material.url}
          alt={material.name}
          className="object-contain max-w-full max-h-[600px]"
        />
      </div>
    );
  }

  // Check if it's a video
  if (material.type === "video") {
    return (
      <div className="aspect-[16/9] w-[800px] border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <video src={material.url} controls className="size-full">
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Default: show filename for other file types (documents)
  return (
    <div className="w-[800px] h-[100px] border-2 border-gray-300 rounded-lg grid place-items-center bg-gray-50">
      <a
        href={material.url}
        download={material.name}
        className="text-lg font-medium text-blue-600 hover:underline"
      >
        {material.name}
      </a>
    </div>
  );
}
