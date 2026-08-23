import type { Event } from '../types/Event'
import { apiGet } from './client'

export function getEvents(): Promise<Event[]> {
  return apiGet<Event[]>('/api/events')
}