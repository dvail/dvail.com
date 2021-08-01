/**
 * global: Benchmark
 */

class PersonC {
  constructor(name) {
    this.name = name;

    this.energyLevel = 10;
    this.sleeping = false;

    this._deepestThoughts = "What _do_ snozzberries taste like?";

    this._restIntervalId = null;
  }

  askName() {
    if (this.sleeping) return;

    return `${this.name} says "Howdy! I'm ${this.name}!"`;
  }

  askThoughts() {
    if (this.sleeping) return;

    return `${this.name} ponders the universe, then speaks: "${this._deepestThoughts}"`;
  }

  exercise(exertionLevel) {
    if (this.sleeping) return;

    this.energyLevel = this.energyLevel - exertionLevel
    if (this.energyLevel <= 0) {
      this._sleep();
    }
  }

  _rest() {
      this.energyLevel = this.energyLevel + 1;

      if (this.energyLevel > 5) {
        this._wake();
      }
  }

  _sleep() {
    this.sleeping = true;
    this._restIntervalId = setInterval(this._rest.bind(this), 1000);
  }

  _wake() {
    this.sleeping = false;
    clearInterval(this._rest);
  }
}

function PersonF(name) {
  let energyLevel = 10;
  let sleeping = false;

  let _deepestThoughts = "What _do_ snozzberries taste like?";

  let _restIntervalId = null;

  function askName() {
    if (sleeping) return;

    return `${name} says "Howdy! I'm ${name}!"`;
  }

  function askThoughts() {
    if (sleeping) return;

    return `${name} ponders the universe, then speaks: "${_deepestThoughts}"`;
  }

  function exercise(exertionLevel) {
    if (sleeping) return;

    energyLevel = energyLevel - exertionLevel
    if (energyLevel <= 0) {
      _sleep();
    }
  }

  function _rest() {
      energyLevel = energyLevel + 1;

      if (energyLevel > 5) {
        _wake();
      }
  }

  function _sleep() {
    sleeping = true;
    _restIntervalId = setInterval(_rest, 1000);
  }

  function _wake() {
    sleeping = false;
    clearInterval(_rest);
  }

  return {
    sleeping,
    askName,
    askThoughts,
    exercise,
  }
}

function createClassPeople() {
  var people = [];
  for (var i = 0; i < 10000; i++) {
    people.push(new PersonC(`Neo${i}`))
  }
  for (var i = 0; i < 10000; i++) {
    people[i].askName();
    people[i].askThoughts();
  }
}

function createFunctionPeople() {
  var people = [];
  for (var i = 0; i < 10000; i++) {
    people.push(PersonF(`Neo${i}`))
  }
  for (var i = 0; i < 10000; i++) {
    people[i].askName();
    people[i].askThoughts();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let runPerformanceButton = document.getElementById('run-performance-test')
  let performanceResults = document.getElementById('performance-test-results')

  runPerformanceButton.addEventListener('click', () => {
    performanceResults.innerHTML = ''
    runPerformanceButton.textContent = "Running tests..."
    runPerformanceButton.disabled = true

    let suite = new Benchmark.Suite

    suite
      .add('Instantiation by class', () => {
        createClassPeople()
      })
      .add('Instantiation by function', () => {
        createFunctionPeople()
      })
      .on('cycle', (event) => {
        let elem = document.createElement('p')
        elem.textContent = String(event.target)
        performanceResults.appendChild(elem)
      })
      .on('complete', function () {
        let elem = document.createElement('p')
        elem.textContent = `Fastest is ${this.filter('fastest').map('name')}`
        performanceResults.appendChild(elem)

        runPerformanceButton.textContent = "Start Tests"
        runPerformanceButton.disabled = false
      })
      .run({ 'async': true });
  })
});