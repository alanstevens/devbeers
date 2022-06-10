// Button selector for a single DevBeers cohort
class Selector {
  #identifier
  #element

  constructor({ name, hash }) {
    const element = document.createElement('button')
    const content = document.createTextNode(name)
    element.appendChild(content)
    element.addEventListener('click', () => location.hash = hash)
    this.#identifier = hash
    this.#element = element
  }

  appendTo(parent) {
    parent.appendChild(this.#element)
  }

  setActive() {
    this.#element.classList.add('active')
  }

  setInactive() {
    this.#element.classList.remove('active')
  }

  is(identifier) {
    return this.#identifier === identifier
  }
}

// Set of all cohort selectors
class Selectors {
  #selectors

  constructor(cohorts) {
    this.#selectors = cohorts.map(cohort => new Selector(cohort))
  }

  appendTo(parent) {
    for (const selector of this.#selectors) {
      selector.appendTo(parent)
    }
  }

  setActive(hash) {
    if (!hash) {
      this.#selectors[0].setActive()
      return
    }

    let hasMatch = false

    for (const selector of this.#selectors) {
      if (selector.is(hash)) {
        hasMatch = true
        selector.setActive()
      } else {
        selector.setInactive()
      }
    }

    // FIXME: move to the top level
    if (!hasMatch) {
      location.hash = ''
    }
  }
}

export default Selectors
