type Props = {
  onClickOptionBased: () => void;
  onClickIdentification: () => void;
  onClickEssay: () => void;
};

export default function AddAssessmentMaterialBlockDialog({
  onClickEssay,
  onClickIdentification,
  onClickOptionBased,
}: Props) {
  return (
    <div className="w-[900px] h-[300px] flex rounded-lg overflow-hidden p-2 bg-gray-bg gap-3">
      <button
        onClick={() => {
          onClickOptionBased();
        }}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        Option Based
      </button>
      <button
        onClick={() => {
          onClickIdentification();
        }}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        Identification
      </button>
      <button
        onClick={() => {
          onClickEssay();
        }}
        className="flex-1 bg-white hover:bg-mainaccent/80 hover:text-white transition-colors shadow-sm rounded-lg grid place-items-center text-2xl font-medium"
      >
        Essay
      </button>
    </div>
  );
}
