import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Galerie Multimédia',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type de média',
      type: 'string',
      options: {
        list: [
          {title: '📷 Image / Photo', value: 'image'},
          {title: '🎥 Vidéo (Fichier MP4)', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          {title: 'Cameroun', value: 'Cameroun'},
          {title: 'Congo', value: 'Congo'},
          {title: 'Eau Potable', value: 'Eau'},
          {title: 'Éducation', value: 'Education'},
          {title: 'Santé', value: 'Santé'},
        ],
      },
    }),
    // --- CONTENU PHYSIQUE ---
    defineField({
      name: 'image',
      title: 'La Photo',
      type: 'image',
      options: {hotspot: true},
      hidden: ({document}) => document?.type === 'video',
    }),
    // NOUVEAU CHAMP : Importation de fichier vidéo
    defineField({
    name: 'videoFile',
    title: 'Fichier Vidéo (MP4/MOV)',
    type: 'file',
    options: {
        accept: 'video/*' // Filtre pour n'accepter que les vidéos
    },
    hidden: ({document}) => document?.type === 'image',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Image de couverture (pour la vidéo)',
      type: 'image',
      options: {hotspot: true},
      hidden: ({document}) => document?.type === 'image',
    }),
    // --- TEXTES BILINGUES (Gardez les mêmes) ---
    defineField({ name: 'captionFr', title: 'Légende (Français)', type: 'string' }),
    defineField({ name: 'captionEn', title: 'Légende (Anglais)', type: 'string' }),
    defineField({ name: 'locationFr', title: 'Lieu (Français)', type: 'string' }),
    defineField({ name: 'locationEn', title: 'Lieu (Anglais)', type: 'string' }),
    defineField({ name: 'date', title: 'Date de l\'action', type: 'date' }),
  ],
})