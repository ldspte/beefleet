// cypress.config.js
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001', // Cambiar de 5173 a 3001
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})