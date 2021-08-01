---
layout: post
title:  "JavaScript OOP Performance Shootout"
tags: programming javascript 
code_highlight: true
custom-js:
  - "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
  - "https://cdn.jsdelivr.net/npm/benchmark@2.1.4/benchmark.min.js"
  - "/assets/js/oop-performance-shootout.js"
---

In a previous post [TODO link] I compared a couple of approaches to OOP object creation in Javascript and
compared the pros and cons of each. One thing I mentioned about the function closure, or factory function approaches
is that it would likely perform worse when instantiating a large number of objects. Let's test it out!

## CPU Performance

For each case I'll be using the `class` based and function closure based approaches from the previous post, along
with the following test code to create and instantiate many "Person" objects:

### Setup code

{% highlight javascript %}
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
{% endhighlight %}

### Class based instantiation
{% highlight javascript %}
var people = [];
for (var i = 0; i < 10000; i++) {
	people.push(new PersonC(`Neo${i}`))
}
for (var i = 0; i < 10000; i++) {
	people[i].askName();
	people[i].askThoughts();
}
{% endhighlight %}

### Function based instantiation
{% highlight javascript %}
var people = [];
for (var i = 0; i < 10000; i++) {
	people.push(PersonF(`Neo${i}`))
}
for (var i = 0; i < 10000; i++) {
	people[i].askName();
	people[i].askThoughts();
}
{% endhighlight %}

Each of the test cases initializes 10,000 instances of each person object and calls a few methods on the new object. In my local test results
on Chromium 92/Ubuntu 20.04 the class based method consistently runs a little over twice as fast.

```
Instantiation by class x 2,215 ops/sec ±0.55% (64 runs sampled)

Instantiation by function x 980 ops/sec ±0.68% (65 runs sampled)
```


You can test this live on your current browser with the benchmark button below:


<button id="run-performance-test">Start Tests</button>

<section class="highlight">
  <pre id="performance-test-results">
    Awaiting test run...
  </pre>
</section>