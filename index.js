/*!
 * dual-emitter <https://github.com/tunnckoCore/dual-emitter>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

/**
 * Expose `DualEmitter`
 */

module.exports = DualEmitter

/**
 * > Create a new instance of `DualEmitter`.
 *
 * **Example**
 *
 * ```js
 * var DualEmitter = require('dual-emitter')
 * var emitter = new DualEmitter()
 * ```
 *
 * @param {Object} `[events]` Initialize with default events.
 * @api public
 */

function DualEmitter (events) {
  if (!(this instanceof DualEmitter)) {
    return new DualEmitter(events)
  }

  this._events = events && typeof events === 'object' ? events : {}
}

/**
 * > Add/bind event listener to custom or DOM event.
 * Notice that `this` in event handler function vary - it can be the DOM element
 * or DualEmitter instance.
 *
 * **Example**
 *
 * ```js
 * function handler (a, b) {
 *   console.log('hi', a, b) //=> hi 123 bar
 * }
 *
 * function onclick (evt) {
 *   console.log(evt, 'clicked')
 * }
 *
 * var element = document.body.querySelector('a.link')
 *
 * emitter.on('custom', handler).emit('custom', 123, 'bar')
 * emitter.on('click', onclick, element).off('click', onclick, element)
 * ```
 *
 * @param  {String} `<name>` event name
 * @param  {Function} `<fn>` event handler
 * @param  {Object} `[el]` optional DOM element
 * @return {DualEmitter} DualEmitter for chaining
 * @api public
 */

DualEmitter.prototype.on = function on (name, fn, el) {
  if (typeof name !== 'string') {
    throw new TypeError('DualEmitter#on expect `name` be string')
  }
  if (typeof fn !== 'function') {
    throw new TypeError('DualEmitter#on expect `fn` be function')
  }

  this._events[name] = this._hasOwn(this._events, name) ? this._events[name] : []
  this._events[name].push(fn)

  if (el && this._isDom(el)) {
    fn.outerHTML = el.outerHTML
    this._element = el
    el.addEventListener ? el.addEventListener(name, fn, false) : el.attachEvent('on' + name, fn)
  }
  return this
}

/**
 * > Remove/unbind event listener of custom or DOM event.
 *
 * **Example**
 *
 * ```js
 * var element = document.body.querySelector('a.link')
 * emitter.off('custom', handler)
 * emitter.off('click', onclick, element)
 * ```
 *
 * @param  {String} `<name>` event name
 * @param  {Function} `<fn>` event handler
 * @param  {Object} `[el]` optional DOM element
 * @return {DualEmitter} DualEmitter for chaining
 * @api public
 */

DualEmitter.prototype.off = function off (name, fn, el) {
  if (typeof name !== 'string') {
    throw new TypeError('DualEmitter#off expect `name` be string')
  }
  if (typeof fn !== 'function') {
    throw new TypeError('DualEmitter#off expect `fn` be function')
  }
  if (!this._hasOwn(this._events, name)) {return this}
  this._events[name].splice(this._events[name].indexOf(fn), 1)

  if (el && this._isDom(el)) {
    el.removeEventListener ? el.removeEventListener(name, fn, false) : el.detachEvent('on' + name, fn)
  }
  return this
}

/**
 * > Add one-time event listener to custom or DOM event.
 * Notice that `this` in event handler function vary - it can be the DOM element
 * or DualEmitter instance.
 *
 * **Example**
 *
 * ```js
 * emitter
 *   .once('custom', function () {
 *     console.log('executed one time')
 *   })
 *   .emit('custom')
 *   .emit('custom')
 *
 * var element = document.body.querySelector('a.link')
 * emitter.once('click', function () {
 *   console.log('listen for click event only once')
 * }, element)
 * ```
 *
 * @param  {String} `<name>` event name
 * @param  {Function} `<fn>` event handler
 * @param  {Object} `[el]` optional DOM element
 * @return {DualEmitter} DualEmitter for chaining
 * @api public
 */

DualEmitter.prototype.once = function once (name, fn, el) {
  var self = this
  function handler () {
    self.off(name, handler, el)
    return fn.apply(el, arguments)
  }
  return this.on(name, handler, el)
}

/**
 * > Emit/execute some type of event listener.
 * You also can emit DOM events if last argument
 * is the DOM element that have attached event listener.
 *
 * **Example**
 *
 * ```js
 * var i = 0
 *
 * emitter
 *   .on('custom', function () {
 *     console.log('i ==', i++, arguments)
 *   })
 *   .emit('custom')
 *   .emit('custom', 123)
 *   .emit('custom', 'foo', 'bar', 'baz')
 *   .emit('custom', [1, 2, 3], 4, 5)
 *
 * // or even emit DOM events, but you should
 * // give the element as last argument to `.emit` method
 * var element = document.body.querySelector('a.link')
 * var clicks = 0
 *
 * emitter
 *   .on('click', function (a) {
 *     console.log(a, 'clicked', clicks++)
 *     console.log(this.textContent) // content of <a> tag
 *   }, element)
 *   .emit('click', 123, element)
 *   .emit('click', element)
 *   .emit('click', foo, element)
 * ```
 *
 * @param  {String} `<name>` event name
 * @param  {Mixed} `[args...]` context to pass to event listeners
 * @param  {Object} `[el]` optional DOM element
 * @return {DualEmitter} DualEmitter for chaining
 * @api public
 */

DualEmitter.prototype.emit = function emit (name) {
  if (!this._hasOwn(this._events, name)) {return this}
  var args = Array.prototype.slice.call(arguments, 1)
  var el = args[args.length - 1]
  var isdom = this._isDom(el)
  el = isdom ? el : this
  args = isdom ? args.slice(0, -1) : args

  for (var i = 0; i < this._events[name].length; i++) {
    var fn = this._events[name][i]
    if (isdom && fn.outerHTML !== el.outerHTML) {
      continue
    }
    fn.apply(el, args)
  }
  return this
}

/**
 * > Check that given `val` is DOM element. Used internally.
 *
 * **Example**
 *
 * ```js
 * var element = document.body.querySelector('a.link')
 *
 * emitter._isDom(element) //=> true
 * emitter._isDom({a: 'b'}) //=> false
 * ```
 *
 * @param  {Mixed}  `val`
 * @return {Boolean}
 * @api public
 */

DualEmitter.prototype._isDom = function isDom (val) {
  val = Object.prototype.toString.call(val).slice(8, -1)
  return /(?:HTML)?(?:.*)Element/.test(val)
}

/**
 * > Check that `key` exists in the given `obj`.
 *
 * **Example**
 *
 * ```js
 * var obj = {a: 'b'}
 *
 * emitter._hasOwn(obj, 'a') //=> true
 * emitter._hasOwn(obj, 'foo') //=> false
 * ```
 *
 * @param  {Object}  `obj`
 * @param  {String}  `key`
 * @return {Boolean}
 * @api public
 */

DualEmitter.prototype._hasOwn = function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * > Static method for mixing `DualEmitter` prototype properties onto `receiver`.
 *
 * **Example**
 *
 * ```js
 * function App() {
 *   DualEmitter.call(this)
 * }
 *
 * DualEmitter.mixin(App.prototype)
 * ```
 *
 * @param  {Object} `receiver`
 * @param  {Object} `provider`
 * @return {Object}
 * @api public
 */

DualEmitter.mixin = function mixin (receiver, provider) {
  provider = provider || this
  for (var key in provider) {
    receiver.constructor[key] = provider[key]
  }
  receiver.constructor.prototype = Object.create(provider.prototype)
  for (var prop in receiver) {
    receiver.constructor.prototype[prop] = receiver[prop]
  }
  receiver.constructor.__super__ = provider.prototype
  return receiver.constructor
}
