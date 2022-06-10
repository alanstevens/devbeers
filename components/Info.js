// Cohort info presented on selection
class Info {
  #element
  #locationLink
  #map
  #locations

  constructor(cohorts) {
    const locations = cohorts.reduce((locations, { hash, location }) => {
      locations.set(hash, location)
      return locations
    }, new Map())

    const element = document.createElement('div')

    const schedulePrompt = document.createElement('p')
    schedulePrompt.appendChild(document.createTextNode('Next meetup: TODO'))

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
    this.#map = map
    this.#locations = locations
  }

  appendTo(parent) {
    parent.appendChild(this.#element)
  }

  setActive(hash) {
    const { map, name, website } = this.#locations.get(hash) || this.#locations.values().next().value
    this.#map.setAttribute('src', map)
    this.#locationLink.setAttribute('href', website)
    this.#locationLink.textContent = name
  }
}

export default Info
