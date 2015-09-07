# [dual-emitter][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> EventEmitter done right and no dependencies. For nodejs and the browser (>= IE8). Can emit custom or DOM events.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]


## Install
```
npm i dual-emitter --save
npm test
```


## Features
- minimal, yet simple to use
- just 4kb minified - no jQuery, no dependencies
- works on the browser (**even IE8**), [use dist/dual-emitter.min.js](./dist/dual-emitter.min.js)
- works on the server, just install it and `require` it
- can emit (trigger or whatever you call it) DOM events manually
- have `.on`, `.off`, `.once` and `.emit` methods


## Usage
> For more use-cases see the [tests](./test.js)

```js
var DualEmitter = require('dual-emitter')
var emitter = new DualEmitter()

function handler () {
  console.log('foo bar')
}

emitter
  .once('custom', function () {
    console.log('executed once')
  })
  .on('foo', handler)
  .emit('custom', 'abc')
  .emit('custom', 'foo', ['bar', 'baz'])
  .emit('custom')
  .off('foo', handler)
  .on('click', function () {
    console.log('link clicked')
  }, document.body.querySelector('a[href]'))
```

## API
### [DualEmitter](./index.js#L30)
> Create a new instance of `DualEmitter`.

- `[events]` **{Object}** Initialize with default events.    

**Example**

```js
var DualEmitter = require('dual-emitter')
var emitter = new DualEmitter()
```

### [.on](./index.js#L64)
> Add/bind event listener to custom or DOM event. Notice that `this` in event handler function vary - it can be the DOM element or DualEmitter instance.

- `<name>` **{String}** event name    
- `<fn>` **{Function}** event handler    
- `[el]` **{Object}** optional DOM element    
- `returns` **{DualEmitter}** DualEmitter for chaining  

**Example**

```js
function handler (a, b) {
  console.log('hi', a, b) //=> hi 123 bar
}

function onclick (evt) {
  console.log(evt, 'clicked')
}

var element = document.body.querySelector('a.link')

emitter.on('custom', handler).emit('custom', 123, 'bar')
emitter.on('click', onclick, element).off('click', onclick, element)
```

### [.off](./index.js#L103)
> Remove/unbind event listener of custom or DOM event.

- `<name>` **{String}** event name    
- `<fn>` **{Function}** event handler    
- `[el]` **{Object}** optional DOM element    
- `returns` **{DualEmitter}** DualEmitter for chaining  

**Example**

```js
var element = document.body.querySelector('a.link')
emitter.off('custom', handler)
emitter.off('click', onclick, element)
```

### [.once](./index.js#L147)
> Add one-time event listener to custom or DOM event. Notice that `this` in event handler function vary - it can be the DOM element or DualEmitter instance.

- `<name>` **{String}** event name    
- `<fn>` **{Function}** event handler    
- `[el]` **{Object}** optional DOM element    
- `returns` **{DualEmitter}** DualEmitter for chaining  

**Example**

```js
emitter
  .once('custom', function () {
    console.log('executed one time')
  })
  .emit('custom')
  .emit('custom')

var element = document.body.querySelector('a.link')
emitter.once('click', function () {
  console.log('listen for click event only once')
}, element)
```

### [.emit](./index.js#L196)
> Emit/execute some type of event listener. You also can emit DOM events if last argument is the DOM element that have attached event listener.

- `<name>` **{String}** event name    
- `[args...]` **{Mixed}** context to pass to event listeners    
- `[el]` **{Object}** optional DOM element    
- `returns` **{DualEmitter}** DualEmitter for chaining  

**Example**

```js
var i = 0

emitter
  .on('custom', function () {
    console.log('i ==', i++, arguments)
  })
  .emit('custom')
  .emit('custom', 123)
  .emit('custom', 'foo', 'bar', 'baz')
  .emit('custom', [1, 2, 3], 4, 5)

// or even emit DOM events, but you should
// give the element as last argument to `.emit` method
var element = document.body.querySelector('a.link')
var clicks = 0

emitter
  .on('click', function (a) {
    console.log(a, 'clicked', clicks++)
  }, element)
  .emit('click', 123, element)
  .emit('click', element)
  .emit('click', foo, element)
```

### [._isDom](./index.js#L231)
> Check that given `val` is DOM element. Used internally.

- `val` **{Mixed}**    
- `returns` **{Boolean}**  

**Example**

```js
var element = document.body.querySelector('a.link')

emitter._isDom(element) //=> true
emitter._isDom({a: 'b'}) //=> false
```

### [._hasOwn](./index.js#L255)
> Check that `key` exists in the given `obj`.

- `obj` **{Object}**    
- `key` **{String}**    
- `returns` **{Boolean}**  

**Example**

```js
var obj = {a: 'b'}

emitter._hasOwn(obj, 'a') //=> true
emitter._hasOwn(obj, 'foo') //=> false
```

### [.extend](index.js#L287)
> Static method for inheriting both the prototype and static methods of the `DualEmitter` class.

- `Ctor` **{Function}** The constructor to extend.

**Example**

```js
function MyApp(options) {
  DualEmitter.call(this)
}
DualEmitter.extend(MyApp)

// Optionally pass another object to extend onto `MyApp`
function MyApp(options) {
  DualEmitter.call(this)
  Foo.call(this, options)
}
DualEmitter.extend(MyApp, Foo.prototype)
```


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/dual-emitter/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.


## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckocore.tk][author-www-img]][author-www-url] [![keybase tunnckocore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]


[npmjs-url]: https://www.npmjs.com/package/dual-emitter
[npmjs-img]: https://img.shields.io/npm/v/dual-emitter.svg?label=dual-emitter

[license-url]: https://github.com/tunnckoCore/dual-emitter/blob/master/LICENSE.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg


[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/dual-emitter
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/dual-emitter.svg

[travis-url]: https://travis-ci.org/tunnckoCore/dual-emitter
[travis-img]: https://img.shields.io/travis/tunnckoCore/dual-emitter.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/dual-emitter
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/dual-emitter.svg

[david-url]: https://david-dm.org/tunnckoCore/dual-emitter
[david-img]: https://img.shields.io/david/tunnckoCore/dual-emitter.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg


[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/messages
[new-message-img]: https://img.shields.io/badge/send%20me-message-green.svg
