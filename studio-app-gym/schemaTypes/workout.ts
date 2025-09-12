import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'workout',
  title: 'Entrenamiento',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'ID de Usuario',
      type: 'string',
      description: 'El Clerk ID del usuario que realizó el entrenamiento.',
    
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Fecha',
      type: 'datetime',
      description: 'La fecha y hora en que se realizó el entrenamiento.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'durationInSeconds',
      title: 'Duración (en segundos)',
      type: 'number',
      description: 'La duración total del entrenamiento en segundos.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'exercises',
      title: 'Ejercicios',
      type: 'array',
      of: [{
        type: 'object',
        name: 'exerciseLog',
        title: 'Registro de Ejercicio',
        fields: [
          defineField({
            name: 'exercise',
            title: 'Ejercicio',
            type: 'reference',
            to: [{ type: 'Ejercicio' }],
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'sets',
            title: 'Series',
            type: 'array',
            of: [{
              type: 'object',
              name: 'setLog',
              title: 'Registro de Serie',
              fields: [
                defineField({
                  name: 'reps',
                  title: 'Repeticiones',
                  type: 'number',
                  validation: (Rule) => Rule.required().min(1),
                }),
                defineField({
                  name: 'weight',
                  title: 'Peso',
                  type: 'number',
                  validation: (Rule) => Rule.required().min(0),
                }),
                defineField({
                  name: 'weightUnit',
                  title: 'Unidad de Peso',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'lbs', value: 'lbs' },
                      { title: 'kg', value: 'kg' },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  reps: 'reps',
                  weight: 'weight',
                  weightUnit: 'weightUnit',
                },
                prepare({ reps, weight, weightUnit }) {
                  return {
                    title: `${reps} Repeticiones`,
                    subtitle: `${weight} ${weightUnit}`,
                  };
                },
              },
            }],
            validation: (Rule) => Rule.min(1).error('Un ejercicio debe tener al menos una serie.'),
          }),
        ],
        preview: {
          select: {
            exerciseNombre: 'exercise.nombre',
            sets: 'sets',
          },
          prepare({ exerciseNombre, sets }) {
            const numSets = sets?.length || 0;
            return {
              title: exerciseNombre,
              subtitle: `${numSets} series`,
            };
          },
        },
      }],
      validation: (Rule) => Rule.min(1).error('Un entrenamiento debe tener al menos un ejercicio.'),
    }),
  ],
  preview: {
    select: {
      date: 'date',
      duration: 'durationInSeconds',
      exercises: 'exercises',
    },
    prepare({ date, duration, exercises }) {
      const formattedDate = new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const numExercises = exercises?.length || 0;
      return {
        title: formattedDate,
        subtitle: `${Math.round(duration / 60)} minutos - ${numExercises} ejercicios`,
      };
    },
  },
});