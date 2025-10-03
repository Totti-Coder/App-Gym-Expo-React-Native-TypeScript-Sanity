import { create } from "zustand" // Libreria de gestion de estado, alternativa a Redux

// Serie de un ejercicio
export interface WorkoutSet {
  id: string
  reps: string
  weight: string
  weightUnit: "kg" | "lbs"
  isCompleted: boolean
}

// Ejercicio dentro de la rutina
interface WorkoutExercise {
  id: string
  sanityId: string
  name: string
  sets: WorkoutSet[]
}

interface WorkoutStore {
  //Lista de ejercicios de la sesion
  workoutExercises: WorkoutExercise[]
  //La unidad de peso escogida
  weightUnit: "kg" | "lbs"
  addExerciseToWorkout: (exercise: { name: string; sanityId: string }) => void
  setWorkoutExercises: (
    // Ejemplo setWorkoutExercises([{ id: "1", sanityId: "123", name: "Press Banca", sets: [] }])
    exercises: WorkoutExercise[] | ((prev: WorkoutExercise[]) => WorkoutExercise[])
  ) => void
  setWeightUnit: (unit: "kg" | "lbs") => void
  resetWorkout: () => void
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workoutExercises: [],
  // Weightunit por defecto es lbs
  weightUnit: "lbs" as "lbs",

  addExerciseToWorkout: (exercise) => set((state) => {
    // Set, es la forma de actualizar el estado en Zustand.
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