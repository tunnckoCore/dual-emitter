[![npm version][npmjs-img]][npmjs-url]
[![mit license][license-img]][license-url]
[![build status][travis-img]][travis-url]
[![coverage status][coveralls-img]][coveralls-url]
[![deps status][daviddm-img]][daviddm-url]

> Cross-browser (and IE8) + node.js event emitter. Invoke custom or DOM event.  
Micro library in 35 lines without jQuery!!!

## Install
```bash
npm install dual-emitter
npm test
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
var DualEmitter = require('dual-emitter');
var dualEmitter = new DualEmitter();

dualEmitter
  .on('test', function(one, two, arr, obj) {
    console.log('test', one, two, arr, obj);
    console.log('------------');
  })
  .emit('test', 1, 2, [3, 4, 5], {six: 'seven'})
  // you need DOM for this
  //.on(document.querySelector('.customh1'), 'click', function(arg1, arg2) {
  //  console.log('you emit DOM event', arg1, arg2);
  //  console.log('------------');
  //})
  // and you can emit DOM event with `i:` prefix, followed by event name
  //.emit('i:click', 'arg1', 'arg2')
```


## API / CLI


## Author
**Charlike Mike Reagent**
+ [gratipay/tunnckoCore][author-gratipay]
+ [twitter/tunnckoCore][author-twitter]
+ [github/tunnckoCore][author-github]
+ [npmjs/tunnckoCore][author-npmjs]
+ [more ...][contrib-more]


## License [![MIT license][license-img]][license-url]
Copyright (c) 2014 [Charlike Mike Reagent][contrib-more], [contributors][contrib-graf].  
Released under the [`MIT`][license-url] license.


[npmjs-url]: http://npm.im/dual-emitter
[npmjs-img]: https://img.shields.io/npm/v/dual-emitter.svg?style=flat&label=dual-emitter

[coveralls-url]: https://coveralls.io/r/tunnckoCore/dual-emitter?branch=master
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/dual-emitter.svg?style=flat

[license-url]: https://github.com/tunnckoCore/dual-emitter/blob/master/license.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat

[travis-url]: https://travis-ci.org/tunnckoCore/dual-emitter
[travis-img]: https://img.shields.io/travis/tunnckoCore/dual-emitter.svg?style=flat

[daviddm-url]: https://david-dm.org/tunnckoCore/dual-emitter
[daviddm-img]: https://img.shields.io/david/tunnckoCore/dual-emitter.svg?style=flat

[author-gratipay]: https://gratipay.com/tunnckoCore
[author-twitter]: https://twitter.com/tunnckoCore
[author-github]: https://github.com/tunnckoCore
[author-npmjs]: https://npmjs.org/~tunnckocore

[contrib-more]: http://j.mp/1stW47C
[contrib-graf]: https://github.com/tunnckoCore/dual-emitter/graphs/contributors

***

_Powered and automated by [readdirp + hogan.js](https://github.com/tunnckoCore), December 30, 2014_