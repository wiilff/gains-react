export function getTimeSpent(workouts, filter = "weekly") {
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - (filter === "monthly" ? 30 : 7));

  const workoutMap = {};

  workouts.forEach((workout) => {
    if (!workout.sets?.length) return;

    const workoutDay = new Date(workout.date).toDateString();

    const setsOnSameDay = workout.sets.filter(
      (s) => new Date(s.loggedAt).toDateString() === workoutDay
    );

    if (!setsOnSameDay.length) return;

    const times = setsOnSameDay.map((s) => new Date(s.loggedAt).getTime());
    const minutes = Math.round(
      (Math.max(...times) - Math.min(...times)) / 60000
    );

    workoutMap[workoutDay] = (workoutMap[workoutDay] || 0) + minutes;
  });

  // fill in missing days
  const result = [];
  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const key = d.toDateString();
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    result.push({ date: label, minutes: workoutMap[key] || 0 });
  }

  return result;
}

export function getMuscleGroupsTrained(workouts, filter = "weekly") {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  const start = new Date();
  if (filter === "monthly") {
    start.setDate(now.getDate() - 30);
  } else if (filter === "weekly") {
    start.setDate(now.getDate() - 7);
  } else if (filter === "all-time") {
    start.setTime(0);
  }

  const muscleCounts = {};

  workouts.forEach((workout) => {
    if (!workout.sets?.length) return;

    const workoutDate = new Date(workout.date);
    if (workoutDate < start || workoutDate > now) return;

    const group = workout.muscleGroup;
    muscleCounts[group] = (muscleCounts[group] || 0) + workout.sets.length;
  });

  return Object.entries(muscleCounts)
    .map(([muscleGroup, count]) => ({ muscleGroup, count }))
    .sort((a, b) => b.count - a.count);
}
