import { useEffect, useState } from 'react'
import { getEvents } from '../api/events'
import type { Event } from '../types/Event'

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents()
        setEvents(data)
      } catch {
        setError('Unable to load events.')
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (loading) {
    return <p>Loading events...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <section>
      <h2>Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.eventType}</strong>
              {' — '}
              {event.severity}
              {' — '}
              {event.source}
              {' — '}
              {event.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default EventsPage