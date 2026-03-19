type Props = {
  pointsEarned: number | null;
  itemPointWorth: number;
};

export default function PointsEarned({ itemPointWorth, pointsEarned }: Props) {
  if (pointsEarned === null) {
    return (
      <div className="font-semibold border border-yellow-200 bg-yellow-200 text-yellow-800 rounded-md px-3 py-2 flex items-center gap-2">
        <p>Pending</p>
      </div>
    );
  }

  if (pointsEarned === 0) {
    return (
      <div className="font-semibold bg-red-200 text-red-500 border-red-500 border rounded-md px-3 py-2 flex items-center gap-2">
        <p className="text-red-500">0</p>
        <p>/</p>
        <p>{itemPointWorth}</p>
      </div>
    );
  }

  if (pointsEarned === itemPointWorth) {
    return (
      <div className="font-semibold bg-green-200 text-green-500 border-green-500 border rounded-md px-3 py-2 flex items-center gap-2">
        <p className="text-green-500">{pointsEarned}</p>
        <p>/</p>
        <p>{itemPointWorth}</p>
      </div>
    );
  }

  return (
    <div className="font-semibold bg-indigo-200 text-mainaccent border-mainaccent border rounded-md px-3 py-2 flex items-center gap-2">
      <p className="text-mainaccent-500">{pointsEarned}</p>
      <p>/</p>
      <p>{itemPointWorth}</p>
    </div>
  );
}
