type Props = {
  block: {
    id: string;
    type: "file";
    content: File | string; // File for new uploads, string URL for existing files
  };
};

export default function EditFileBlock({ block }: Props) {
  const isFile = block.content instanceof File;

  // For File objects (new uploads)
  if (isFile) {
    const file = block.content as File; // Type assertion after instanceof check
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Check if it's an image
    if (fileType.startsWith("image/") || fileName.match(/\.(jpg|jpeg|png)$/)) {
      const imageUrl = URL.createObjectURL(file);
      return (
        <div className="max-w-fit border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={file.name}
            className="object-contain max-w-full max-h-[600px]"
          />
        </div>
      );
    }

    // Check if it's a video
    if (fileType.startsWith("video/") || fileName.match(/\.(mp4|mkv)$/)) {
      const videoUrl = URL.createObjectURL(file);
      return (
        <div className="aspect-[16/9] w-[800px] border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <video src={videoUrl} controls className="size-full">
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Default: show filename for other file types
    return (
      <div className="h-full flex items-center border-y border-gray-500/70">
        <div className="w-[800px] h-[100px] border-2 border-gray-300 rounded-lg grid place-items-center bg-gray-50">
          <p className="text-lg font-medium text-gray-700">{file.name}</p>
        </div>
      </div>
    );
  }

  // For URL strings (existing files from database)
  const url = block.content as string; // Type assertion for string
  const extension = url.split(".").pop()?.toLowerCase() || "";

  // Check if it's an image
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
    return (
      <div className="max-w-fit border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={url}
          alt="Lecture material"
          className="object-contain max-w-full max-h-[600px]"
        />
      </div>
    );
  }

  // Check if it's a video
  if (["mp4", "mkv", "webm", "mov"].includes(extension)) {
    return (
      <div className="aspect-[16/9] w-[800px] border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <video src={url} controls className="size-full">
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Default: show URL for other file types
  return (
    <div className="w-[800px] h-[100px] border-2 border-gray-300 rounded-lg grid place-items-center bg-gray-50">
      <p className="text-lg font-medium text-gray-700">{url}</p>
    </div>
  );
}
