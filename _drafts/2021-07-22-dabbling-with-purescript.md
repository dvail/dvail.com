---
layout: post
title:  "Dabbling With PureScript"
tags: programming purescript 
code_highlight: true
last_modified: 2021-11-16 22:20:00 -0500
---

Recently, in order to get more comfortable with functional programming I spent some time learning the basics of PureScript and building a small
app with it. [PureScript](https://www.purescript.org/) is a purely functional programming language that is heavily inspired by Haskell that
compiles to reasonably readable JavaScript (it also has backends for C++, Go, and Erlang).

As with most things, this wasn't a concentrated effort, but a gradual dabbling from month to month throughout 2020 and 2021. After getting through chapter 8
(monads 👻) in the PureScript book to get a handle on the language, I build a [small app](https://chord-katas.dvail.com/) to get a more real world feel for the language.
The app was for a quick idea I had as a rank beginner learning acoustic guitar - a quick way to practice assorted chord progressions across a variety of different keys.
Core functionality is there, but the site is definitely lacking polish. For some reason during the last set of edits I made, TailwindCSS generation broke and I could not get
styles to update. Since I haven't been feeling the "fight with tooling vibe" lately I decided to put the project on hold for a while.

Spending some time studying and using the languages has given me some great takeaways, even if I'm unlikely to use the language professionally in the future.

## The Struggles

As expected, the biggest struggle for me personally using PureScript was the size of the ecosystem. Being a super niche language, there isn't a wealth of documentation,
ready-made libraries, or huge developer community behind the language; even compared to other relatively niche functional programming languages like F# or Clojure. This
was definitely offset by PureScript's attachment to the JS ecosystem and relatively straightforward FFI. There are multiple bindings to React, and PureScript has it's own
UI framework called Halogen, but bindings to other popular frameworks and libraries were tough to find.

Compounding on the small ecosystem, documentation was quite sparse or even non-existent in some cases. PureScript does seem to follow the Haskell approach to documentation, as
the majority of my learning the libraries was though reading source code comments and type signatures. Library documentation was very good in this regard, with most packages
being browseable on [Pursuit](https://pursuit.purescript.org/), but there were very few tutorials, examples, or how-to type guides. I did find myself frequently
visiting [Jordan's reference](https://github.com/JordanMartinez/purescript-jordans-reference) to really get into the details of the language when I was stuck.

The other struggle, more of a mini-struggle, is that pure functional programming is _hard_.

["Formally, `Apply` represents a strong lax semi-monoidal endofunctor"](https://pursuit.purescript.org/packages/purescript-prelude/5.0.1/docs/Control.Apply#t:Apply) anyone?

PureScript doesn't shy away from Haskell's research roots, and although you don't need a background in category theory to get stuff done, statements like the
above tend to lead to more time spent on Wikipedia than on Stack Overflow.

A lot of the difficulty is likely more akin to the fact that learning _programming_ is hard though,
and like many others have claimed online, learning pure FP (via PureScript or Haskell) requires a shift in thinking even for experienced programmers.
In my case the difficulty was part of the intended journey, as learning PureScript was just that: a mind-expanding exercise.

## Some Goodness

One expectation I had when diving into such a small ecosystem was the the tooling would be rough around the edges or missing core capabilities. I was surprised to see
that the one plugin for VSCode and the spago build tool pretty much just worked out of the box. Building and testing the project was simple, updating and installing dependencies
was straightforward, and code completion/type hints pretty much "just worked" out of the box. This is in contrast to the hours I spent trying to get type tooltips working
in VSCode with Haskell, something I never actually did get set up. This is one case where I was pleasantly surprised with the ecosystem, as the community has made the
onboarding experience into a relatively difficult language very easy to get started.

Ok enough about the ecosystem, what about the language itself?

Algebraic Data Types. These are great. PureScript (and other ML-related languages from what I understand) provide great facilities for modeling data in a lightweight and
correct way. The following two lines models all possible Chords in the Chord Katas app:

{% highlight haskell %}
data Note = A | Bb | B | C | Db | D | Eb | E | F | Gb | G | Ab
data Chord = Major Note | Minor Note | Dom7 Note | Maj7 Note | Dim Note
{% endhighlight %}

These two lines combine [Sum](https://en.wikipedia.org/wiki/Tagged_union) types using the `|` operator with [Product](https://en.wikipedia.org/wiki/Product_type) types
to define a `Chord` as every possible combination of chord type with root note. For example, using the `Major` data constructor of `Chord` defines the number of possible values
as `1 x number_of_notes`, with the `1` being due to `Major` accepting a single argument that could be any one of the defined `Note` values. 

TODO Model this similarly in TypeScript and/or Java

The value of ADTs in modeling code goes hand in hand with pattern matching, which PureScript uses to declaratively perform logic base on incoming data. This is somewhat
analogous to a switch/case in other languages, except with a more consice syntax, automatic variable binding, and exhaustiveness checks.

The following snippet shows a function that pattern matches to return the display value from a provided `Chord`.

TODO Mention wrapper types 'Pattern', 'Replacement'...

{% highlight haskell %}
displayNote :: Note -> String
displayNote = show >>> replace (Pattern "b") (Replacement "♭")

displayChord :: Chord -> String
displayChord (Major n) = displayNote n
displayChord (Minor n) = displayNote n <> "m"
displayChord (Dom7 n)  = displayNote n <> "dom⁷"
displayChord (Maj7 n)  = displayNote n <> "maj⁷"
displayChord (Dim n)   = displayNote n <> "°"
{% endhighlight %}

Note that the value of the `Note` contained within the `Chord` is automatically assigned to the identifier `n` in each case. Additionally, if each case was not explicitly listed
in the function definition compilation would fail. If we removed the `(Dim n)` line here, or if we added another value to the `data Chord` ADT such as `Augmented Note`, all modules in the code base that pattern matched against the `Chord` data type would fail compilation. This is valuable to enforce consistency and avoid the likelihood of programmer
error when making changes to data structures. 

TODO Model this similarly in TypeScript and/or Java

Pattern matching can also apply against the structure of the data as well, as shown in this recursive function that builds up a scale. (Note that `List` itself is a recursive
ADT, which builds up a linked list of values using the `cons` operator `:`). Exhaustive pattern matching ensures that no case can be forgotten when
recursively walking the interval list until the base case is reached.

{% highlight haskell %}
-- Given a root note and list of scale intervals, build up the resulting scale starting
-- from the provided root.
buildScale :: Note -> Array Interval -> List Note
buildScale rootNote intervals = buildScale' intervalList noteList $ rootNote : Nil
  where
  noteList :: List Note
  noteList = drop 1 $ chromaticFrom rootNote
  intervalList :: List Interval
  intervalList = reverse $ fromFoldable intervals
  buildScale' :: List Interval -> List Note -> List Note -> List Note
  buildScale' (Whole : ixs) (_ : (x : xs)) scale = buildScale' ixs xs $ x : scale
  buildScale' (Half  : ixs) (x : xs)       scale = buildScale' ixs xs $ x : scale
  buildScale' (Half  : _)   Nil            scale = scale
  buildScale' (Whole : _)   Nil            scale = scale
  buildScale' (Whole : _)   (_ : Nil)      scale = scale
  buildScale' Nil           _              scale = scale
{% endhighlight %}

Although somewhat subjective, I feel like PureScript has hit the sweet spot for crisp, minimal syntax. Using a 'space' to denote function application, as
well automatic currying and partial application gives the language a Lisp-like simplicity, without all the parenthesis. I'm surprised to see that this isn't
a feature of more statically typed languages, as it isn't immediately clear to me what the downside would be to offer this functionality to developers by default.
The readability is impeded a little bit for newcomers due to
the language's use of special characters for many core functions when called infix (`$`, `<$>`, `<*>`...), but the full function names (`apply`, `map`, `apply`) are always
available if you prefer to structure your code that way. 

## No verdict

There were a handful of language features that are definitely interesting, but I'm not completely sold on at this point. This isn't because I don't think
the features have value, but more that the scope of the Chord Katas app didn't require using them to their full extent.

### Type Classes

One of the hallmark feature of Haskell and PureScript, type classes allow you to define implementations of predefined functions that enable you to add
ad-hoc polymorphism to new data types. For example, the `Functor` type class defines operations on a type that can be "mapped over" using the `<$>` or `map` functions
in PureScript. The language comes with many built in implementations of this, such as mapping a `List a` to a `List b` (similar to `Array.map` in JavaScript), or
mapping `Maybe a` to `Just a` or `Nothing`. New data types can implement an instance of these type classes outside of where the type classes were defined, allowing
the use of polymorphism without requiring an update of existing code. If you create a new type that implements `Functor`, you can use that type interchangeably 
with any function that is declared to accept a `Functor`. 

{% highlight haskell %}
-- Contrived example to demonstrate simple polymorphism via type classes
exclaim :: Functor String -> Functor String
exclaim = map (\s -> s <> "!")

wordList :: List String
wordList = "a" : "b" : "test" : Nil

exclaim wordList
-- "a!" : "b!" : "test!"

justWord :: Maybe String
justWord = Just "I exist"

exclaim justWord
-- Just "I exist!"

nothingWord :: Maybe String
nothingWord = Nothing

exclaim nothingWord
-- Nothing

-- Lets say we have a binary tree data structure defined as
data Tree a = Leaf a | Branch (Tree a) (Tree a) 

-- You could define an implementation of `Functor` for the tree as follows
instance Functor Tree where
  map fn (Leaf a) = Leaf (fn a) 
  map fn (Branch l r) = Branch (map fn l) (map fn r)

-- Then with a tree of strings, we can use the `exclaim` function to liven it up
myTree = Branch (Branch (Leaf "Its") (Leaf "a")) (Leaf "tree")

exclaim myTree
-- Branch (Branch (Leaf "Its!") (Leaf "a!")) (Leaf "tree!")
{% endhighlight %}

Type classes help address the [expression problem](https://en.wikipedia.org/wiki/Expression_problem) in functional languages. However in the 
app I developed, they were simply used to derive equality checks (`Eq`) and convert new types to strings (`Show`), so my expose here is limited.

## Purity

One of the other defining features of Haskell and PureScript is the concept of _purity_, which is a defining feature to the point that
`PureScript` is named after it. 


## Overall

- "If it compiles it works"