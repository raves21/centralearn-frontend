type Props = {
  onClickText: () => void;
  onClickImage: () => void;
};

export default function AddOptionDialog({ onClickText, onClickImage }: Props) {
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
      <button
        onClick={() => {
          onClickImage();
        }}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        Image
      </button>
    </div>
  );
}
