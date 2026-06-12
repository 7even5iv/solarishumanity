import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  // REMPLACE PAR TON PROJECT ID (trouvé dans admin/sanity.config.ts)
  projectId: 'yhkxrm6s', 
  dataset: 'production',
  useCdn: true, // true pour des performances rapides
  apiVersion: '2024-03-11', // utilise la date du jour
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}