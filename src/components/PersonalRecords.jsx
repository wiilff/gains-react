export default function PersonalRecords({ exerciseDetails }) {
  let pr = { weight: 0 };
  let volume = { volume: 0 };

  exerciseDetails.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (
        set.weight > pr.weight ||
        (set.weight === pr.weight && set.reps > pr.reps)
      ) {
        pr.weight = set.weight;
        pr.reps = set.reps;
      }

      const calculatedVolume = set.weight * set.reps;

      if (calculatedVolume > volume.volume || (calculatedVolume === volume.volume && set.weight > volume.weight)) {
        volume.volume = calculatedVolume;
        volume.weight = set.weight;
        volume.reps = set.reps;
        volume.date = exercise.date;
      }
    });
  });

  return (
    <div className="mt-6 flex gap-4">
      {/* Left Div */}
      <div className="flex-1 text-center bg-gray-300 p-4 rounded-xl shadow-md border border-gray-200 font-semibold text-gray-700">
        <h1 className="font-extrabold mb-2">PR</h1>
        <p>
          {pr.weight} kg for {pr.reps} reps
        </p>
      </div>

      {/* Right Div */}
      <div className="flex-1 text-center bg-gray-300 p-4 rounded-xl shadow-md border border-gray-200 font-semibold text-gray-700">
        <h1 className="font-extrabold mb-2">Highest volume</h1>
        <p>
          {volume.weight} kg for {volume.reps} reps
        </p>
      </div>
    </div>
  );
}
