import { defineStore } from 'pinia'
import { seedData } from '../utils/seed'

export const useSeedStore = defineStore('seeds', {
  

  state: () => ({
    seedData
  }),
})