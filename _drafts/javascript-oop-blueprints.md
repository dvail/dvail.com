---
layout: post
title:  "JavaScript OOP Blueprints"
tags: javascript programming
code_highlight: true
---

Unlike many other classical OOP languages, JavaScript gives you many ways to create the "classes" or blueprints of objects in your system. For the purposes of comparing these options,
lets consider the definition of OOP to be "data and the methods that act on that data are fused into a single entity".

Three of the main patterns of creating a class in JavaScript can be summed up as: using the prototype directly, using the class keyword, using function closures.


## Using the prototype
{% highlight javascript %}
function Person(name) {
  this.name = name;

  this.energyLevel = 10;
  this.sleeping = false;

  this._deepestThoughts = "What _do_ snozzberries taste like?";

  this._restIntervalId = null;
}

Person.prototype.askName = function askName() {
  if (this.sleeping) return;

  console.log(`${this.name} says "Howdy! I'm ${this.name}!"`);
  return this.name;
}

Person.prototype.askThoughts = function askThoughts() {
  if (this.sleeping) return;

  console.log(`${this.name} ponders the universe, then speaks: "${this._deepestThoughts}"`);
  return this._deepestThoughts;
}

Person.prototype.exercise = function exercise(exertionLevel) {
  if (this.sleeping) return;

  console.log(`${this.name} starts doing jumping jacks at a ${exertionLevel} intensity level.`);
  this.energyLevel = this.energyLevel - exertionLevel
  if (this.energyLevel <= 0) {
    this._sleep();
  }
}

Person.prototype._rest = function _rest() {
    this.energyLevel = this.energyLevel + 1;

    console.log(`zzzz.... ${this.name} is resting.`);
    if (this.energyLevel > 5) {
      this._wake();
    }
}

Person.prototype._sleep = function _sleep() {
  console.log(`${this.name} can't stand being awake any longer, and drifts off to sleep!`);
  this.sleeping = true;
  this._restIntervalId = setInterval(this._rest.bind(this), 1000);
}

Person.prototype._wake = function _wake() {
  console.log(`${this.name} is awake!`);
  this.sleeping = false;
  clearInterval(this._rest);
}
{% endhighlight %}

Using the prototype method:

{% highlight javascript %}
let joe = new Person("Joe");

joe.askName();
joe.exercise(10);
joe.sleeping === true; // true

// access to private properties
joe._wake();
joe.sleeping === false; // true

// Extending a Person (inheritance)
function Developer(name, languages) {
  Person.call(name);
  this.languages = languages;
}

Developer.prototype = Object.create(Person.prototype);

Developer.prototype.askThoughts = function askThoughts() {
  if (this.sleeping) return;

  console.log(`${this.name} says "I know [${this.languages.join(',')}] pretty well."`);
  return this._deepestThoughts;
};

let jen =  new Developer("Jen", ["JavaScript", "PHP", "Elm"]);

jen.askThoughts(); // method overridden
jen.exercise(15); // method executed from the Person prototype
jen.sleeping === true; // true
{% endhighlight %}

**Advantages of this method:**
- Works in virtually every browser in existence
- Performance (possibly, benchmarks later)
- More explicit about the prototype system, which is the basis for OOP in JavaScript

**Disadvantages:**
- Awkward syntax to developers used to classical OOP
- No true encapsulation
- Susceptible to problems with `this`
- Can lead to bugs if objects are not created with `new`

The prototype method is the traditional way to create OOP objects in JavaScript and directly exposes the system that is used at the core of the language.
The `class` based system in the next section is syntactical sugar for the prototype method, as each method works almost identically under the hood.

The disadvantages with this method are primarily based around the `this` keyword, which is often a point of confusion. For example, creating an object using
the prototype method is allowed both with and without the use of `new`, which causes the value of `this` to be different in each case:

{% highlight javascript %}
let joe = new Person("Joe");
// The value of `this` when constructing Joe is the new object that is created. Properties like `name` will be set on the object
// when `this.name = name` is called.

let bernice = Person("Bernice");
// Oh no, the `new` keyword is omitted. Instead of throwing an error JavaScript will happily just call the function, returning `undefined`.
// The value of `this` inside the function will also be the global object `window`. So statements like `this.name = name` effectively
// become `window.name = name`, polluting the global namespace.
{% endhighlight %}

There are other `this` related pitfalls, which can be seen in the method definition below. The first is the use of `Function.bind`.
Due to the changing nature of `this`, without binding the function passed to `setInterval` the `_rest` method will try to wake up
the `window` object instead of the Person instance we would expect. In order to ensure `this` is what we want it to be, we need to call
`this._rest.bind(this)` which creates a new function, which is a copy of the bound function with `this` sealed in place. Here, the first argument passed
to `bind` is `this` which creates a new version of the `_rest()` function where the value of `this` inside it is always the same as the `this` that
is passed in when the function is bound.

This!

{% highlight javascript %}
Person.prototype._sleep = function _sleep() {
  console.log(`${this.name} can't stand being awake any longer, and drifts off to sleep!`);
  this.sleeping = true;
  this._restIntervalId = setInterval(this._rest.bind(this), 1000);
}
{% endhighlight %}

Another more subtle issue is that property names assigned on `this` can easily be mis-typed:

{% highlight javascript %}
  this._restIntervalid = setInterval(this._rest.bind(this), 1000);
  // Oops, we accidentally used a lower case "i" instead of "I" for "Id"...
{% endhighlight %}

Due to JavaScript's dynamic typing, this is perfectly valid and even desired in some cases. We can add properties to objects whenever we want
and the program will continue without issue. However since there are now two properties on `this`: `_restIntervalId` and `_restIntervalid`, bugs are
certain to occur later on in the program's execution.

A convention you might have noticed used in this example is the leading underscore on method and property names, like `this._deepestThoughts`. There isn't
anything special about this, it is just a way to communicate to the developer that the value is intended to be "private".

{% highlight javascript %}
let joe = new Person("Joe");
console.log(joe._deepestThoughts);
// Joe's deepest thoughts are supposed to be hidden, be we can easily access them anyway.
{% endhighlight %}

One of the main tenets of Object Oriented Programming is that internal data and methods should be hidden via encapsulation, with only the
external API available for use. Using the prototype method in JavaScript doesn't really allow this, and the leading underscore implies
a "consenting adults" method of encapsulation. You can access these properties but the leading underscore lets you know that you probably
shouldn't.

## Using the `class` keyword
{% highlight javascript %}
class Person(name) {
  constructor(name) {
    this.name = name;

    this.energyLevel = 10;
    this.sleeping = false;

    this._deepestThoughts = "What _do_ snozzberries taste like?";

    this._restIntervalId = null;
  }

  askName() {
    if (this.sleeping) return;

    console.log(`${this.name} says "Howdy! I'm ${this.name}!"`);
    return this.name;
  }

  askThoughts() {
    if (this.sleeping) return;

    console.log(`${this.name} ponders the universe, then speaks: "${this._deepestThoughts}"`);
    return this._deepestThoughts;
  }

  exercise(exertionLevel) {
    if (this.sleeping) return;

    console.log(`${this.name} starts doing jumping jacks at a ${exertionLevel} intensity level.`);
    this.energyLevel = this.energyLevel - exertionLevel
    if (this.energyLevel <= 0) {
      this._sleep();
    }
  }

  _rest() {
      this.energyLevel = this.energyLevel + 1;

      console.log(`zzzz.... ${this.name} is resting.`);
      if (this.energyLevel > 5) {
        this._wake();
      }
  }

  _sleep() {
    console.log(`${this.name} can't stand being awake any longer, and drifts off to sleep!`);
    this.sleeping = true;
    this._restIntervalId = setInterval(this._rest.bind(this), 1000);
  }

  _wake() {
    console.log(`${this.name} is awake!`);
    this.sleeping = false;
    clearInterval(this._rest);
  }
}
{% endhighlight %}

Putting the class keyword to use:

{% highlight javascript %}
let joe = new Person("Joe");

joe.askName();
joe.exercise(10);
joe.sleeping === true; // true

// access to private properties
joe._wake();
joe.sleeping === false; // true

// Extending a Person (inheritance)
class Developer extends Person {
  constructor(name, languages) {
    super(name);
    this.languages = languages;
  }

  askThoughts() {
    if (this.sleeping) return;

    console.log(`${this.name} says "I know [${this.languages.join(',')}] pretty well."`);
    return this._deepestThoughts;
  };
}

let jen =  new Developer("Jen", ["JavaScript", "PHP", "Elm"]);

jen.askThoughts(); // method overridden
jen.exercise(15); // method executed from the Person prototype
jen.sleeping === true; // true
{% endhighlight %}

**Advantages of this method:**
- Familiar syntax for developers used to classical OOP
- Performance (possibly, benchmarks later)
- Must be constructed with `new`, omitting the keyword throws an error instead of leading to bugs
- Less verbose than the prototype method

**Disadvantages:**
- Works only in relatively modern browsers (no IE)
- No true encapsulation
- Susceptible to problems with `this`
- Obscures the prototypical nature of JavaScript

The `class` keyword is a somewhat recent edition to JavaScript and is usable in all browsers except the fringe of browsers that are out
of date (looking at you Internet Explorer). [https://caniuse.com/#search=es6%20classes](https://caniuse.com/#search=es6%20classes)

Using `class` is very similar to `Object.prototype` with one main advantage: it is required to use the `new` keyword to construct a new
object from a class.

{% highlight javascript %}
// Creates a new object
let joe = new Person("Joe");

// This will throw an error and reduce bugs propagating through the system
let jen = Person("Jen");
{% endhighlight %}

However using `class` still has the same issues with needing to refer to `this`, with potential typos causing bugs and having
to bind functions.

Using `class` also does not get around the issue of encapsulation, as private fields and methods are only possible through conventions
like the leading underscore.*

*As of the time of this writing, private fields are part of a stage 3 proposal and are available in the latest versions of Chrome and MS Edge.
[https://caniuse.com/#search=private](https://caniuse.com/#search=private)
[https://github.com/tc39/proposal-class-fields](https://github.com/tc39/proposal-class-fields)

{% highlight javascript %}
class Person {
  #deepestThoughts = "My thoughts are truly hidden now!";

  constructor(name) {
    this.name = name;
  }
}
{% endhighlight %}

## Using function closures

{% highlight javascript %}
function Person(name) {
  let energyLevel = 10;
  let sleeping = false;

  let _deepestThoughts = "What _do_ snozzberries taste like?";

  let _restIntervalId = null;

  function askName() {
    if (sleeping) return;

    console.log(`${name} says "Howdy! I'm ${name}!"`);
    return name;
  }

  function askThoughts() {
    if (sleeping) return;

    console.log(`${name} ponders the universe, then speaks: "${_deepestThoughts}"`);
    return _deepestThoughts;
  }

  function exercise(exertionLevel) {
    if (sleeping) return;

    console.log(`${name} starts doing jumping jacks at a ${exertionLevel} intensity level.`);
    energyLevel = energyLevel - exertionLevel
    if (energyLevel <= 0) {
      _sleep();
    }
  }

  function _rest() {
      energyLevel = energyLevel + 1;

      console.log(`zzzz.... ${name} is resting.`);
      if (energyLevel > 5) {
        _wake();
      }
  }

  function _sleep() {
    console.log(`${name} can't stand being awake any longer, and drifts off to sleep!`);
    sleeping = true;
    _restIntervalId = setInterval(_rest, 1000);
  }

  function _wake() {
    console.log(`${name} is awake!`);
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

And usage of the closure method:
{% highlight javascript %}
let joe = Person("Joe");

joe.askName();
joe.exercise(10);
joe.sleeping === true; // true

// access to private properties
joe._wake(); // error - no access to private methods
joe.sleeping === false; // false

// Extending a Person (inheritance)
function Developer(name, languages) {
  let parentObject = Person(name);

  function askThoughts() {
    if (parentObject.sleeping) return;

    console.log(`$parentObject.{name} says "I know [${languages.join(',')}] pretty well."`);
    return parentObject._deepestThoughts;
  };

  return Object.assign(parentObject, {
    languages,
    askThoughts,
  });
}

let jen =  Developer("Jen", ["JavaScript", "PHP", "Elm"]);

jen.askThoughts(); // method overridden
jen.exercise(15); // method executed from the Person object
jen.sleeping === true; // true
{% endhighlight %}

Advantages of this method:
- Avoids issues with `this`
- Behavior is consistent with or without `new` keyword
- Allows true encapsulation of private methods/fields

Disadvantages:
- No access to private methods/properties on parent objects
- See https://stackoverflow.com/questions/3561177/can-i-extend-a-closure-defined-class-in-javascript
- Performance (possibly, benchmarks later)

