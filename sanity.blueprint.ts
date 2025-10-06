import 'dotenv/config'
import process from 'node:process'
import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

const {NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN} = process.env

if (typeof NEXT_PUBLIC_SANITY_PROJECT_ID !== 'string' || typeof NEXT_PUBLIC_SANITY_DATASET !== 'string' || typeof SANITY_API_TOKEN !== 'string') {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN must be set')
}

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      type: 'sanity.function.document',
      name: 'compute-category-hierarchy',
      src: './functions/compute-category-hierarchy',
      memory: 1,
      timeout: 10,
      event: {
        on: ['publish'],
        filter: "_type == 'product' && defined(category) && delta::changedAny(category)",
        projection: '_id',
      },
      env: {
        SANITY_STUDIO_PROJECT_ID: NEXT_PUBLIC_SANITY_PROJECT_ID,
        SANITY_STUDIO_DATASET: NEXT_PUBLIC_SANITY_DATASET,
        SANITY_AUTH_TOKEN: SANITY_API_TOKEN,
      },
    }),
  ],
})
