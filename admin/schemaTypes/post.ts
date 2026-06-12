import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog (Actualités)',
  type: 'document',
  fields: [
    // --- TITRES ---
    defineField({
      name: 'titleFr',
      title: 'Titre (Français)',
      type: 'string',
    }),
    defineField({
      name: 'titleEn',
      title: 'Titre (Anglais)',
      type: 'string',
    }),
    
    // --- SLUG (Généralement basé sur le titre français) ---
    defineField({
      name: 'slug',
      title: 'Lien URL (Slug)',
      type: 'slug',
      options: {
        source: 'titleFr',
        maxLength: 96,
      },
    }),

    // --- RÉSUMÉS ---
    defineField({
      name: 'excerptFr',
      title: 'Résumé (Français)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'excerptEn',
      title: 'Résumé (Anglais)',
      type: 'text',
      rows: 3,
    }),

    // --- CORPS DE L'ARTICLE ---
    defineField({
      name: 'bodyFr',
      title: 'Corps de l\'article (Français)',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'bodyEn',
      title: 'Corps de l\'article (Anglais)',
      type: 'array',
      of: [{type: 'block'}],
    }),

    // --- IMAGES ET DATES (Communs aux deux langues) ---
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
    }),
    defineField({
        name: 'category',
        title: 'Catégorie',
        type: 'string',
        options: {
          list: [
            {title: 'Action', value: 'Action'},
            {title: 'Projet', value: 'Projet'},
            {title: 'Partenariat', value: 'Partenariat'},
          ],
        },
      }),
  ],
})