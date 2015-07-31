(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DualEmitter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * dual-emitter <https://github.com/tunnckoCore/dual-emitter>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

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
    el.addEventListener
      ? el.addEventListener(name, fn, false)
      : el.attachEvent('on' + name, fn)
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
  if (!this._hasOwn(this._events, name) && !this._events[name]) return this
  this._events[name].splice(this._events[name].indexOf(fn), 1)

  if (el && this._isDom(el)) {
    el.removeEventListener
      ? el.removeEventListener(name, fn, false)
      : el.detachEvent('on' + name, fn)
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
  function handler (evt) {
    self.off(name, handler, el)
    return fn(evt)
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
  if (!this._hasOwn(this._events, name) && !this._events[name]) return this
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdmVyc2lvbnMvaW8uanMvdjIuNC4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogZHVhbC1lbWl0dGVyIDxodHRwczovL2dpdGh1Yi5jb20vdHVubmNrb0NvcmUvZHVhbC1lbWl0dGVyPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBDaGFybGlrZSBNaWtlIFJlYWdlbnQgPEB0dW5uY2tvQ29yZT4gKGh0dHA6Ly93d3cudHVubmNrb2NvcmUudGspXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogRXhwb3NlIGBEdWFsRW1pdHRlcmBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IER1YWxFbWl0dGVyXG5cbi8qKlxuICogPiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYER1YWxFbWl0dGVyYC5cbiAqXG4gKiAqKkV4YW1wbGUqKlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgRHVhbEVtaXR0ZXIgPSByZXF1aXJlKCdkdWFsLWVtaXR0ZXInKVxuICogdmFyIGVtaXR0ZXIgPSBuZXcgRHVhbEVtaXR0ZXIoKVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGBbZXZlbnRzXWAgSW5pdGlhbGl6ZSB3aXRoIGRlZmF1bHQgZXZlbnRzLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBEdWFsRW1pdHRlciAoZXZlbnRzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEdWFsRW1pdHRlcikpIHtcbiAgICByZXR1cm4gbmV3IER1YWxFbWl0dGVyKGV2ZW50cylcbiAgfVxuXG4gIHRoaXMuX2V2ZW50cyA9IGV2ZW50cyAmJiB0eXBlb2YgZXZlbnRzID09PSAnb2JqZWN0JyA/IGV2ZW50cyA6IHt9XG59XG5cbi8qKlxuICogPiBBZGQvYmluZCBldmVudCBsaXN0ZW5lciB0byBjdXN0b20gb3IgRE9NIGV2ZW50LlxuICogTm90aWNlIHRoYXQgYHRoaXNgIGluIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb24gdmFyeSAtIGl0IGNhbiBiZSB0aGUgRE9NIGVsZW1lbnRcbiAqIG9yIER1YWxFbWl0dGVyIGluc3RhbmNlLlxuICpcbiAqICoqRXhhbXBsZSoqXG4gKlxuICogYGBganNcbiAqIGZ1bmN0aW9uIGhhbmRsZXIgKGEsIGIpIHtcbiAqICAgY29uc29sZS5sb2coJ2hpJywgYSwgYikgLy89PiBoaSAxMjMgYmFyXG4gKiB9XG4gKlxuICogZnVuY3Rpb24gb25jbGljayAoZXZ0KSB7XG4gKiAgIGNvbnNvbGUubG9nKGV2dCwgJ2NsaWNrZWQnKVxuICogfVxuICpcbiAqIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdhLmxpbmsnKVxuICpcbiAqIGVtaXR0ZXIub24oJ2N1c3RvbScsIGhhbmRsZXIpLmVtaXQoJ2N1c3RvbScsIDEyMywgJ2JhcicpXG4gKiBlbWl0dGVyLm9uKCdjbGljaycsIG9uY2xpY2ssIGVsZW1lbnQpLm9mZignY2xpY2snLCBvbmNsaWNrLCBlbGVtZW50KVxuICogYGBgXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBgPG5hbWU+YCBldmVudCBuYW1lXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gYDxmbj5gIGV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSAge09iamVjdH0gYFtlbF1gIG9wdGlvbmFsIERPTSBlbGVtZW50XG4gKiBAcmV0dXJuIHtEdWFsRW1pdHRlcn0gRHVhbEVtaXR0ZXIgZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uIChuYW1lLCBmbiwgZWwpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0R1YWxFbWl0dGVyI29uIGV4cGVjdCBgbmFtZWAgYmUgc3RyaW5nJylcbiAgfVxuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRHVhbEVtaXR0ZXIjb24gZXhwZWN0IGBmbmAgYmUgZnVuY3Rpb24nKVxuICB9XG5cbiAgdGhpcy5fZXZlbnRzW25hbWVdID0gdGhpcy5faGFzT3duKHRoaXMuX2V2ZW50cywgbmFtZSkgPyB0aGlzLl9ldmVudHNbbmFtZV0gOiBbXVxuICB0aGlzLl9ldmVudHNbbmFtZV0ucHVzaChmbilcblxuICBpZiAoZWwgJiYgdGhpcy5faXNEb20oZWwpKSB7XG4gICAgZm4ub3V0ZXJIVE1MID0gZWwub3V0ZXJIVE1MXG4gICAgdGhpcy5fZWxlbWVudCA9IGVsXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgPyBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZuLCBmYWxzZSlcbiAgICAgIDogZWwuYXR0YWNoRXZlbnQoJ29uJyArIG5hbWUsIGZuKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogPiBSZW1vdmUvdW5iaW5kIGV2ZW50IGxpc3RlbmVyIG9mIGN1c3RvbSBvciBET00gZXZlbnQuXG4gKlxuICogKipFeGFtcGxlKipcbiAqXG4gKiBgYGBqc1xuICogdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2EubGluaycpXG4gKiBlbWl0dGVyLm9mZignY3VzdG9tJywgaGFuZGxlcilcbiAqIGVtaXR0ZXIub2ZmKCdjbGljaycsIG9uY2xpY2ssIGVsZW1lbnQpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGA8bmFtZT5gIGV2ZW50IG5hbWVcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBgPGZuPmAgZXZlbnQgaGFuZGxlclxuICogQHBhcmFtICB7T2JqZWN0fSBgW2VsXWAgb3B0aW9uYWwgRE9NIGVsZW1lbnRcbiAqIEByZXR1cm4ge0R1YWxFbWl0dGVyfSBEdWFsRW1pdHRlciBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRHVhbEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIG9mZiAobmFtZSwgZm4sIGVsKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdEdWFsRW1pdHRlciNvZmYgZXhwZWN0IGBuYW1lYCBiZSBzdHJpbmcnKVxuICB9XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdEdWFsRW1pdHRlciNvZmYgZXhwZWN0IGBmbmAgYmUgZnVuY3Rpb24nKVxuICB9XG4gIGlmICghdGhpcy5faGFzT3duKHRoaXMuX2V2ZW50cywgbmFtZSkgJiYgIXRoaXMuX2V2ZW50c1tuYW1lXSkgcmV0dXJuIHRoaXNcbiAgdGhpcy5fZXZlbnRzW25hbWVdLnNwbGljZSh0aGlzLl9ldmVudHNbbmFtZV0uaW5kZXhPZihmbiksIDEpXG5cbiAgaWYgKGVsICYmIHRoaXMuX2lzRG9tKGVsKSkge1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgID8gZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBmbiwgZmFsc2UpXG4gICAgICA6IGVsLmRldGFjaEV2ZW50KCdvbicgKyBuYW1lLCBmbilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqID4gQWRkIG9uZS10aW1lIGV2ZW50IGxpc3RlbmVyIHRvIGN1c3RvbSBvciBET00gZXZlbnQuXG4gKiBOb3RpY2UgdGhhdCBgdGhpc2AgaW4gZXZlbnQgaGFuZGxlciBmdW5jdGlvbiB2YXJ5IC0gaXQgY2FuIGJlIHRoZSBET00gZWxlbWVudFxuICogb3IgRHVhbEVtaXR0ZXIgaW5zdGFuY2UuXG4gKlxuICogKipFeGFtcGxlKipcbiAqXG4gKiBgYGBqc1xuICogZW1pdHRlclxuICogICAub25jZSgnY3VzdG9tJywgZnVuY3Rpb24gKCkge1xuICogICAgIGNvbnNvbGUubG9nKCdleGVjdXRlZCBvbmUgdGltZScpXG4gKiAgIH0pXG4gKiAgIC5lbWl0KCdjdXN0b20nKVxuICogICAuZW1pdCgnY3VzdG9tJylcbiAqXG4gKiB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignYS5saW5rJylcbiAqIGVtaXR0ZXIub25jZSgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gKiAgIGNvbnNvbGUubG9nKCdsaXN0ZW4gZm9yIGNsaWNrIGV2ZW50IG9ubHkgb25jZScpXG4gKiB9LCBlbGVtZW50KVxuICogYGBgXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBgPG5hbWU+YCBldmVudCBuYW1lXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gYDxmbj5gIGV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSAge09iamVjdH0gYFtlbF1gIG9wdGlvbmFsIERPTSBlbGVtZW50XG4gKiBAcmV0dXJuIHtEdWFsRW1pdHRlcn0gRHVhbEVtaXR0ZXIgZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSAobmFtZSwgZm4sIGVsKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBmdW5jdGlvbiBoYW5kbGVyIChldnQpIHtcbiAgICBzZWxmLm9mZihuYW1lLCBoYW5kbGVyLCBlbClcbiAgICByZXR1cm4gZm4oZXZ0KVxuICB9XG4gIHJldHVybiB0aGlzLm9uKG5hbWUsIGhhbmRsZXIsIGVsKVxufVxuXG4vKipcbiAqID4gRW1pdC9leGVjdXRlIHNvbWUgdHlwZSBvZiBldmVudCBsaXN0ZW5lci5cbiAqIFlvdSBhbHNvIGNhbiBlbWl0IERPTSBldmVudHMgaWYgbGFzdCBhcmd1bWVudFxuICogaXMgdGhlIERPTSBlbGVtZW50IHRoYXQgaGF2ZSBhdHRhY2hlZCBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiAqKkV4YW1wbGUqKlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgaSA9IDBcbiAqXG4gKiBlbWl0dGVyXG4gKiAgIC5vbignY3VzdG9tJywgZnVuY3Rpb24gKCkge1xuICogICAgIGNvbnNvbGUubG9nKCdpID09JywgaSsrLCBhcmd1bWVudHMpXG4gKiAgIH0pXG4gKiAgIC5lbWl0KCdjdXN0b20nKVxuICogICAuZW1pdCgnY3VzdG9tJywgMTIzKVxuICogICAuZW1pdCgnY3VzdG9tJywgJ2ZvbycsICdiYXInLCAnYmF6JylcbiAqICAgLmVtaXQoJ2N1c3RvbScsIFsxLCAyLCAzXSwgNCwgNSlcbiAqXG4gKiAvLyBvciBldmVuIGVtaXQgRE9NIGV2ZW50cywgYnV0IHlvdSBzaG91bGRcbiAqIC8vIGdpdmUgdGhlIGVsZW1lbnQgYXMgbGFzdCBhcmd1bWVudCB0byBgLmVtaXRgIG1ldGhvZFxuICogdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2EubGluaycpXG4gKiB2YXIgY2xpY2tzID0gMFxuICpcbiAqIGVtaXR0ZXJcbiAqICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uIChhKSB7XG4gKiAgICAgY29uc29sZS5sb2coYSwgJ2NsaWNrZWQnLCBjbGlja3MrKylcbiAqICAgICBjb25zb2xlLmxvZyh0aGlzLnRleHRDb250ZW50KSAvLyBjb250ZW50IG9mIDxhPiB0YWdcbiAqICAgfSwgZWxlbWVudClcbiAqICAgLmVtaXQoJ2NsaWNrJywgMTIzLCBlbGVtZW50KVxuICogICAuZW1pdCgnY2xpY2snLCBlbGVtZW50KVxuICogICAuZW1pdCgnY2xpY2snLCBmb28sIGVsZW1lbnQpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGA8bmFtZT5gIGV2ZW50IG5hbWVcbiAqIEBwYXJhbSAge01peGVkfSBgW2FyZ3MuLi5dYCBjb250ZXh0IHRvIHBhc3MgdG8gZXZlbnQgbGlzdGVuZXJzXG4gKiBAcGFyYW0gIHtPYmplY3R9IGBbZWxdYCBvcHRpb25hbCBET00gZWxlbWVudFxuICogQHJldHVybiB7RHVhbEVtaXR0ZXJ9IER1YWxFbWl0dGVyIGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5EdWFsRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQgKG5hbWUpIHtcbiAgaWYgKCF0aGlzLl9oYXNPd24odGhpcy5fZXZlbnRzLCBuYW1lKSAmJiAhdGhpcy5fZXZlbnRzW25hbWVdKSByZXR1cm4gdGhpc1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgdmFyIGVsID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdXG4gIHZhciBpc2RvbSA9IHRoaXMuX2lzRG9tKGVsKVxuICBlbCA9IGlzZG9tID8gZWwgOiB0aGlzXG4gIGFyZ3MgPSBpc2RvbSA/IGFyZ3Muc2xpY2UoMCwgLTEpIDogYXJnc1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZXZlbnRzW25hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGZuID0gdGhpcy5fZXZlbnRzW25hbWVdW2ldXG4gICAgaWYgKGlzZG9tICYmIGZuLm91dGVySFRNTCAhPT0gZWwub3V0ZXJIVE1MKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICBmbi5hcHBseShlbCwgYXJncylcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqID4gQ2hlY2sgdGhhdCBnaXZlbiBgdmFsYCBpcyBET00gZWxlbWVudC4gVXNlZCBpbnRlcm5hbGx5LlxuICpcbiAqICoqRXhhbXBsZSoqXG4gKlxuICogYGBganNcbiAqIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdhLmxpbmsnKVxuICpcbiAqIGVtaXR0ZXIuX2lzRG9tKGVsZW1lbnQpIC8vPT4gdHJ1ZVxuICogZW1pdHRlci5faXNEb20oe2E6ICdiJ30pIC8vPT4gZmFsc2VcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSAge01peGVkfSAgYHZhbGBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5faXNEb20gPSBmdW5jdGlvbiBpc0RvbSAodmFsKSB7XG4gIHZhbCA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpLnNsaWNlKDgsIC0xKVxuICByZXR1cm4gLyg/OkhUTUwpPyg/Oi4qKUVsZW1lbnQvLnRlc3QodmFsKVxufVxuXG5cbi8qKlxuICogPiBDaGVjayB0aGF0IGBrZXlgIGV4aXN0cyBpbiB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogKipFeGFtcGxlKipcbiAqXG4gKiBgYGBqc1xuICogdmFyIG9iaiA9IHthOiAnYid9XG4gKlxuICogZW1pdHRlci5faGFzT3duKG9iaiwgJ2EnKSAvLz0+IHRydWVcbiAqIGVtaXR0ZXIuX2hhc093bihvYmosICdmb28nKSAvLz0+IGZhbHNlXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBgb2JqYFxuICogQHBhcmFtICB7U3RyaW5nfSAgYGtleWBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5faGFzT3duID0gZnVuY3Rpb24gaGFzT3duIChvYmosIGtleSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KVxufVxuXG4vKipcbiAqID4gU3RhdGljIG1ldGhvZCBmb3IgbWl4aW5nIGBEdWFsRW1pdHRlcmAgcHJvdG90eXBlIHByb3BlcnRpZXMgb250byBgcmVjZWl2ZXJgLlxuICpcbiAqICoqRXhhbXBsZSoqXG4gKlxuICogYGBganNcbiAqIGZ1bmN0aW9uIEFwcCgpIHtcbiAqICAgRHVhbEVtaXR0ZXIuY2FsbCh0aGlzKVxuICogfVxuICpcbiAqIER1YWxFbWl0dGVyLm1peGluKEFwcC5wcm90b3R5cGUpXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGByZWNlaXZlcmBcbiAqIEBwYXJhbSAge09iamVjdH0gYHByb3ZpZGVyYFxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5EdWFsRW1pdHRlci5taXhpbiA9IGZ1bmN0aW9uIG1peGluIChyZWNlaXZlciwgcHJvdmlkZXIpIHtcbiAgcHJvdmlkZXIgPSBwcm92aWRlciB8fCB0aGlzXG4gIGZvciAodmFyIGtleSBpbiBwcm92aWRlcikge1xuICAgIHJlY2VpdmVyLmNvbnN0cnVjdG9yW2tleV0gPSBwcm92aWRlcltrZXldXG4gIH1cbiAgcmVjZWl2ZXIuY29uc3RydWN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwcm92aWRlci5wcm90b3R5cGUpXG4gIGZvciAodmFyIHByb3AgaW4gcmVjZWl2ZXIpIHtcbiAgICByZWNlaXZlci5jb25zdHJ1Y3Rvci5wcm90b3R5cGVbcHJvcF0gPSByZWNlaXZlcltwcm9wXVxuICB9XG4gIHJlY2VpdmVyLmNvbnN0cnVjdG9yLl9fc3VwZXJfXyA9IHByb3ZpZGVyLnByb3RvdHlwZVxuICByZXR1cm4gcmVjZWl2ZXIuY29uc3RydWN0b3Jcbn1cbiJdfQ==
