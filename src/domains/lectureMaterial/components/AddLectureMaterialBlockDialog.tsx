type Props = {
  onClickText: () => void;
  onSelectFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function AddLectureMaterialBlockDialog({
  onClickText,
  onSelectFile,
  fileInputRef,
}: Props) {
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
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onSelectFile}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        File
      </button>
    </div>
  );
}
