type Props = {
  block: {
    id: string;
    type: "file";
    content: File;
  };
};

export default function FileLectureContentBlock({ block }: Props) {
  const fileType = block.content.type;
  const fileName = block.content.name.toLowerCase();

  // Check if it's an image
  if (fileType.startsWith("image/") || fileName.match(/\.(jpg|jpeg|png)$/)) {
    const imageUrl = URL.createObjectURL(block.content);
    return (
      <div className="max-w-fit border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={block.content.name}
          className="object-contain max-w-full max-h-[600px]"
        />
      </div>
    );
  }

  // Check if it's a video
  if (fileType.startsWith("video/") || fileName.match(/\.(mp4|mkv)$/)) {
    const videoUrl = URL.createObjectURL(block.content);
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
    <div className="w-[800px] h-[100px] border-2 border-gray-300 rounded-lg grid place-items-center bg-gray-50">
      <p className="text-lg font-medium text-gray-700">{block.content.name}</p>
    </div>
  );
}
