import { create } from "zustand"
import { add } from "date-fns"

export interface WorkoutSet {
  id: string
  reps: string
  weight: string
  weightUnit: "kg" | "lbs"
  isCompleted: boolean
}

interface WorkoutExercise {
  id: string
  sanityId: string
  name: string
  sets: WorkoutSet[]
}

interface WorkoutStore {
  workoutExercises: WorkoutExercise[]
  weightUnit: "kg" | "lbs"
  addExerciseToWorkout: (exercise: { name: string; sanityId: string }) => void
  setWorkoutExercises: (
    exercises: WorkoutExercise[] | ((prev: WorkoutExercise[]) => WorkoutExercise[])
  ) => void
  setWeightUnit: (unit: "kg" | "lbs") => void
  resetWorkout: () => void
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workoutExercises: [],
  weightUnit: "lbs" as "lbs",

  addExerciseToWorkout: (exercise) => set((state) => {
    const newExercise: WorkoutExercise = {
      id: Math.random().toString(),
      sanityId: exercise.sanityId,
      name: exercise.name,
      sets: []
    }
    return {
      workoutExercises: [...state.workoutExercises, newExercise],
    } 
  }),
  
  setWorkoutExercises: (exercises) =>
    // set es la funcion para actualizar el estado
    set((state) => ({
      workoutExercises:
        typeof exercises === "function"
          ? exercises(state.workoutExercises)
          : exercises,
    })),
    
  setWeightUnit: (unit) => set({
    weightUnit: unit,
  }),
  
  resetWorkout: () => set({ workoutExercises: [] })
}))