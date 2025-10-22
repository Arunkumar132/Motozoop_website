'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { dashboardTool } from '@sanity/dashboard'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import AnalyticsWidget from './dashboardWidgets/AnalyticsWidget'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    dashboardTool({
      widgets: [
        AnalyticsWidget,
        // Add default widgets if needed:
        // { name: 'document-list', options: { title: 'Recent Orders', order: '_createdAt desc', types: ['order'] } },
      ],
    }),
  ],
})
