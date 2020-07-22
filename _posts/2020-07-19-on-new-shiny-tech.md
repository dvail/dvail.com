---
layout: post
title:  "On New Shiny Tech"
tags: programming purescript elixir hasura graphql
---

With the near unlimited amount of programming related tech tools being released seemingly every day it can be hard to filter out
which ones are worth the time investment and which ones you should let go. My life as a programmer seems to be a constant state of FOMO
analysis paralysis so I try to break down which tech to learn into three categories before diving in.

1. Tools that help you get a job
2. Tools that help you build the thing you want to build
3. Tools that change the way you think about programming

## Tools that help you get a job

The first is mostly geared towards people looking to break into the field, or people looking to make a change in their career. If you are just
starting out one of the fastest ways to improve is to be immersed in programming 40 hours a week. There are plenty of viable ways to learn
other than working, e.g. through school, a coding boot camp, or contributing to open source, but most people still have bills to pay and
if you can pay those bills by coding and being surrounded by other people who code you'll get the best "bang for your time-buck".

Since I currently have a job I'm going to glaze over this section, but if I was just starting out a good bet would be to learn one of the big 3
popular languages (Java, JavaScript, Python) and then a popular web framework for one of those languages. I suppose today that might be 
Spring Boot for Java, React for JavaScript, or Django for Python. Check your local job market though! There are plenty of options for these and
other languages but for the sake of not overthinking it you can't go wrong with one of the above.

## Tools that help you build the thing you want to build

This is where you would land if you already have a job, or don't care about getting a job, and just want to build The Thing in the most effective way
possible. Or maybe you already know how to build The Thing and are looking for different options that help you build it better.

In this case it depends on what your Thing is, but regardless of topic there are almost sure to be focused options catering to exactly what you need.

Want to build a blog? I created mine with [Jekyll](https://jekyllrb.com/), but [Gatsby](https://www.gatsbyjs.org/) and [Hugo](https://gohugo.io/) 
seem to be other popular options.

Building a web app that is heavy on the front end? [React](https://reactjs.org/) is eating the world right now, but [Vue](https://vuejs.org/) gets
a lot of praise too. Or maybe try something a bit lighter like [MithrilJs](https://mithril.js.org/).

Who doesn't want to make video games? There are a ton of resources for the C# programming language out there, and it is an officially supported language
for arguably the most popular indie engine available [Unity](https://unity.com/). It's also the default in popular smaller engines 
like [Godot](https://godotengine.org/) and the venerable [Monogame](https://www.monogame.net/).

The idea with this category is not to spend too much time worrying about the perfect choice if there are clear quality options available, unless you
are hitting pain points with the tools you currently use. This should
be heavily influenced by what you already know as well. Pretty comfortable with Ruby and looking to build a SaaS type app? It might make more sense to
go with Rails instead of investing the extra time to learn Python/Django.

## Tools that change the way you think about programming

This category is not focused on new employment or attempting to build something specific, but is aimed at deepening or broadening your understanding
of the craft of programming and software development as a whole. I've found that the more diverse ideas you have on how programs can be constructed, the more easily this 
knowledge can be applied to problems in creative ways. Often times learning to write code in a new approach leads you to new best practices that
can then be applied into your day to day, even if you never end up using the tools that taught you these new techniques directly.

When looking for a new tool in this category I find I tend to gravitate towards learning new programming languages more so than trying out 
specific libraries or developing on new platforms. I suppose this is related to my interest in UI/UX, as programming languages are the
"User Experience" for the programmer. The options available to you in your language of choice will impact the way you approach problems and as
you learn more you will be able to distinguish the relative strengths and weaknesses of your language and use them to your advantage.

This isn't necessarily specific to languages though. If you are a day to day web app programmer spend some time writing some low level system code,
pushing bits and pointers around. Try to build a Linux kernel module. If you have only ever programmed in an imperative or object oriented
paradigm spend some time playing around with a functional style or logic programming. For somebody with an interest in the craft of programming
the options here really feel endless.

## So what am I hoping to learn right now? This month/year/next year...

### Hasura

[Hasura](https://hasura.io/) is one of those tools that seems to tick all three of the categories above, but I would put it more in the second category than the others. 
It is essentially a service that allows rapid CRUD development via GraphQL on a Postgres database by taking a novel approach on how to query and return the data.

Most GraphQL servers require you to write "resolvers" which are functions that specify how the data for a specific field in the GraphQL query is fetched
and returned in the response. I've done a small amount of work with GraphQL in the past and was definitely interested in the strong typing and ability
to specify the exact data you wanted in a relational tree structure, without having to create multiple REST endpoints and splice the data together on the
client. The downside here seemed to be the overhead in writing and maintaining these resolvers, as well as performance implications if deeply nested
queries were sent from the client. The approach that Hasura takes is instead of wiring up resolvers, it acts as a compiler that translates GraphQL into
an efficient SQL query directly, cutting out the middleman.

I tested this out briefly on a Saturday morning and in an hour or two I went from zero to a setup that could replace the CRUD functionality of a couple 
thousand lines of Spring MVC and JPA Entities, not only existing functionality but with seemingly limitless query potential due to the structure of GraphQL.
Clearly this isn't a one for one replacement, as file uploads, authentication, and other business logic concerns were left out, but most of those have
well documented solutions and I was impressed by how quickly I was able to get up and running.

On top of this, Hasura has a full featured database migration system built in, support for automatic re-querying with GraphQL subscriptions, and Actions
to allow for business logic separate from the core CRUD functionality.

The main reason I haven't dug into this more is that... I don't have anything to build with it at the moment! If a work or side project comes up that has
a significant CRUD/database component I will definitely look into Hasura again, potentially in conjunction with serverless functions to fill in the gaps
in the back end.

### Elixir/Phoenix/LiveView

Elixir with the [Phoenix](https://phoenixframework.org/) framework is something that has been on my radar for a long time. Phoenix is a MVC style backend web development framework
similar to Rails and Django, but written in Elixir by one of the Rails core developers, José Valim. It has been (subjectively) described as a "better Rails"
which seems to trade OOP and a large web development ecosystem for functional programming and better performance + scalability. Users claim that
the development velocity versus Rails is the same, or even better due to Elixir's focus on immutability, except of course when you would otherwise be
relying on functionality provided by a Ruby gem that does not have a counterpart in the Elixir.

Recently the Phoenix team has added a new feature called LiveView, which allows you to write increasingly interactive web applications on the server
without the need for JavaScript. This helps fill the gap between websites that just need a bit of interactivity and apps that would benefit from a
full-blown SPA framework like React. Articles about how Phoenix 
[uses IOLists to achieve sub-millisecond response times](https://www.bignerdranch.com/blog/elixir-and-io-lists-part-2-io-lists-in-phoenix/)
along with Chris Mccord's demo of [LiveView rendering an animation at 60fps](https://dockyard.com/blog/2018/09/12/liveview-project-at-elixirconf-2018)
 from the server moved Phoenix to the top of my list for server frameworks to play around with.

My server side experience ranges from plain old PHP, to minimal API development using Ruby/Sinatra/Sequel, to beefier MVC frameworks like Django and
Spring Boot. For various reasons none of these really felt optimal to me, and if I was going to create a new project as a solo developer I'm not
sure that I would choose any of the above as my first choice.

Recently however I've been more inclined to work with languages with static typing after seeing how smooth a JavaScript -> TypeScript conversion was
on one of my side projects, and all the benefits it brought to development. In the past I've mostly worked with dynamic languages and Java, so my view on
static typing was more of a hindrance than a help. For this reason I've move Phoenix a bit down from the top of my list of tech to try, but do intend
on getting back to it in the future.

I also want to take a stab at creating a Settlers of Catan clone, fully server side, to push what is possible (or reasonable) with LiveView.


### PureScript/Haskell

This is one that falls solidly into the third category, for now, and is what I'm currently spending some time on.

For quite a while I've been Haskell-curious, constantly bumping into articles and discussions where the power of the type system and pure functional
programming was claimed to be extremely productive once you wrapped your head around it, and would color the way you think about programming
problems in the future. I've also maintained a [Xmonad](https://github.com/xmonad/xmonad) configuration on all my Linux systems for a handful
of years and wanted to get a deeper understanding beyond the pseudo copy-pasting I've been doing to get this set up to my liking.

There is also something alluring about being described as one of the more difficult programming languages to learn well. (Although oddly enough
the winner here is usually C++, which isn't something that interests me at all at this point.)

My first go with this was to get a reasonable development environment for Haskell. Nothing crazy, just some type signatures on hover and general linting
and syntax errors in VSCode. This turned out to be way more of an investment than I was expecting, and after a handful of attempts with a combination of 5-10
VSCode plugins and swapping between Stack and Cabal I decided to bail on this, at least temporarily, and try out another lang with the clean ML inspired
syntax. I narrowed this down to F#, Elm, OCaml and PureScript, eventually settling on PureScript due to

- No ties to the MicroSoft ecosystem (F#)
- Pure functional programming first + subjective nicer syntax (OCaml)
- More support for Type Classes (Elm)

Additionally I heard PureScript described as "dragging Haskell 20% of the way to JavaScript", and since JavaScript is what I am most familiar with I decided
it was the best way forward. I'm current working my way through the community maintained [PureScript Book](https://book.purescript.org/) and plan to take a look
at the [Halogen](https://purescript-halogen.github.io/purescript-halogen/) library after and see what it feels like to develop a small project in the language.