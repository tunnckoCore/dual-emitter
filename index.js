/*!
 * dual-emitter <https://github.com/tunnckoCore/dual-emitter>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

function DualEmitter (events) {
  if (!(this instanceof DualEmitter)) {
    return new DualEmitter(events)
  }

  this._events = events && typeof events === 'object' ? events : {}
}

DualEmitter.prototype.on = function on (name, fn, el) {
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

DualEmitter.prototype.off = function off (name, fn, el) {
  if (!this._hasOwn(this._events, name) && !this._events[name]) return this
  this._events[name].splice(this._events[name].indexOf(fn), 1)

  if (el && this._isDom(el)) {
    el.removeEventListener
      ? el.removeEventListener(name, fn, false)
      : el.detachEvent('on' + name, fn)
  }
  return this
}

DualEmitter.prototype.once = function once (name, fn, el) {
  var self = this
  function handler (evt) {
    self.off(name, handler, el)
    return fn(evt)
  }
  return this.on(name, handler, el)
}

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

DualEmitter.prototype._isDom = function isDom (obj) {
  obj = Object.prototype.toString.call(obj).slice(8, -1)
  return /(?:HTML)?(?:.*)Element/.test(obj)
}

DualEmitter.prototype._hasOwn = function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

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

module.exports = DualEmitter
