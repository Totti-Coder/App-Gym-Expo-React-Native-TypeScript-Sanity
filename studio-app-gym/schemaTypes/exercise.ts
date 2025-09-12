// sanity/schemaTypes/exercise.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'Ejercicio',
  title: 'Ejercicio',
  type: 'document',
  icon: () => '🏋️‍♂️',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      description: 'Nombre del ejercicio',
      validation: Rule => Rule.required().min(3).max(100).error('El nombre debe tener entre 3 y 100 caracteres')
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      description: 'Descripción detallada del ejercicio, técnica y consejos',
      validation: Rule => Rule.required().min(10).max(1000).error('La descripción debe tener entre 10 y 1000 caracteres'),
      rows: 4
    }),
    defineField({
      name: 'dificultad',
      title: 'Dificultad',
      type: 'string',
      description: 'Nivel de dificultad del ejercicio',
      options: {
        list: [
          { title: 'Principiante', value: 'principiante' },
          { title: 'Intermedio', value: 'intermedio' },
          { title: 'Avanzado', value: 'avanzado' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required().error('Debes seleccionar un nivel de dificultad'),
      initialValue: 'principiante'
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      description: 'Imagen demostrativa del ejercicio',
      options: {
        hotspot: true,
        storeOriginalFilename: false
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Descripción de la imagen para accesibilidad',
          validation: Rule => Rule.required().error('El texto alternativo es obligatorio para accesibilidad')
        },
        {
          name: 'caption',
          title: 'Pie de imagen',
          type: 'string',
          description: 'Descripción opcional de la imagen'
        }
      ],
      validation: Rule => Rule.required().error('La imagen es obligatoria')
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL del Video',
      type: 'url',
      description: 'Enlace al video demostrativo del ejercicio (YouTube, Vimeo, etc.)',
      validation: Rule => Rule.uri({
        allowRelative: false,
        scheme: ['http', 'https']
      }).error('Debe ser una URL válida (http/https)')
    }),
    defineField({
      name: 'isActive',
      title: 'Activo',
      type: 'boolean',
      description: 'Indica si el ejercicio está activo y visible en la aplicación',
      initialValue: true
    })
  ],
  
  // Vista previa en el estudio
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'dificultad',
      media: 'imagen',
      active: 'isActive'
    },
    prepare(selection) {
      const { title, subtitle, media, active } = selection;
      return {
        title: title,
        subtitle: `${subtitle?.charAt(0).toUpperCase() + subtitle?.slice(1)} ${active ? '✅' : '❌'}`,
        media: media
      }
    }
  },

  // Ordenación por defecto
  orderings: [
    {
      title: 'Nombre A-Z',
      name: 'nombreAsc',
      by: [{ field: 'nombre', direction: 'asc' }]
    },
    {
      title: 'Nombre Z-A',
      name: 'nombreDesc',
      by: [{ field: 'nombre', direction: 'desc' }]
    },
    {
      title: 'Dificultad',
      name: 'dificultadAsc',
      by: [{ field: 'dificultad', direction: 'asc' }]
    },
    {
      title: 'Activos primero',
      name: 'activosFirst',
      by: [
        { field: 'isActive', direction: 'desc' },
        { field: 'nombre', direction: 'asc' }
      ]
    }
  ]
})