import { useRef } from "react";

type Props = {
  onClickText: () => void;
  onSelectImageFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AddOptionDialog({
  onClickText,
  onSelectImageFile,
}: Props) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-[600px] h-[300px] flex rounded-lg overflow-hidden p-2 bg-gray-bg gap-3">
      <button
        onClick={() => {
          onClickText();
        }}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        Text
      </button>
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onSelectImageFile}
      />
      <button
        onClick={() => imageInputRef.current?.click()}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        Image
      </button>
    </div>
  );
}
