import cohorts from './cohorts.json'
import { Selectors, Info } from './components'

// TODO:
// 2. set up/query an actual public calendar for each cohort instead of cronning this

// add components to the DOM
const container = document.getElementById('cohorts')
const selectors = new Selectors(cohorts)
const info = new Info(cohorts)

selectors.appendTo(container)
info.appendTo(container)

// render all components
const render = () => {
  const nextLocation = location.hash.substring(1);
  const isValidLocation = !nextLocation || cohorts.some(({ hash }) => hash === nextLocation)

  if (isValidLocation) {
    selectors.setActive(nextLocation)
    info.setActive(nextLocation)
  } else {
    location.hash = ''
  }
}

// re-render whenever the URL hash changes
addEventListener('hashchange', render)

// render the components on page load
render()
