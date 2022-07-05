// fetch the next events from each calendar
const CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars'
const NOW = new Date()
const DATE_STRING_OPTIONS = {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
}
const EVENT_PARAMS = new URLSearchParams({
  timeMin: NOW.toISOString(),
  singleEvents: 'true',
  key: 'AIzaSyAAdfkotyU8Wh4p1aEP5USI9sXv7pp-RIA'
})

const getNextEvent = ({ hash, calendar }) => fetch(`${CALENDAR_URL}/${calendar.id}/events?${EVENT_PARAMS}`)
  .then(response => response.json())
  .then(response => ({ hash, nextEvent: response.items[0] }))

const getEvents = async cohorts => {
  const responses = await Promise.all(cohorts.map(getNextEvent))
  const events = new Map()

  for (const { hash, nextEvent } of responses) {
    events.set(hash, nextEvent)
  }

  return events
}

// Text component indicating the next meetup for a single DevBeers cohort
class NextMeetup {
  #element
  #events

  constructor(cohorts) {
    const element = document.createTextNode('')

    this.#events = getEvents(cohorts)
    this.#element = element
  }

  appendTo(parent) {
    parent.appendChild(this.#element)
  }

  async setActive(hash) {
    const events = await this.#events
    const event = events.get(hash) || events.values().next().value
    const date = new Date(event.start.dateTime)

    this.#element.textContent = date.toLocaleDateString(undefined, DATE_STRING_OPTIONS)
  }
}

// Cohort info presented on selection
class Info {
  #element
  #locationLink
  #locations
  #map
  #nextMeetup

  constructor(cohorts) {
    const locations = cohorts.reduce((locations, { hash, location }) => {
      locations.set(hash, location)
      return locations
    }, new Map())

    const nextMeetup = new NextMeetup(cohorts)

    const element = document.createElement('div')

    const schedulePrompt = document.createElement('p')
    schedulePrompt.appendChild(document.createTextNode('Next meetup: '))
    nextMeetup.appendTo(schedulePrompt)

    const locationPrompt = document.createElement('p')
    locationPrompt.appendChild(document.createTextNode('Meetup location: '))

    const locationLink = document.createElement('a')
    locationPrompt.appendChild(locationLink)

    const map = document.createElement('iframe')
    map.setAttribute('allowfullscreen', 'true')
    map.setAttribute('referrerpolicy', 'no-referrer-when-downgrade')


    element.appendChild(schedulePrompt)
    element.appendChild(locationPrompt)
    element.appendChild(map)

    this.#element = element
    this.#locationLink = locationLink
    this.#locations = locations
    this.#map = map
    this.#nextMeetup = nextMeetup
  }

  appendTo(parent) {
    parent.appendChild(this.#element)
  }

  async setActive(hash) {
    const { map, name, website } = this.#locations.get(hash) || this.#locations.values().next().value
    this.#map.setAttribute('src', map)
    this.#locationLink.setAttribute('href', website)
    this.#locationLink.textContent = name
    await this.#nextMeetup.setActive(hash)
  }
}

export default Info
