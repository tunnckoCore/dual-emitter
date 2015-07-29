(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DualEmitter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdmVyc2lvbnMvaW8uanMvdjIuNC4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIGR1YWwtZW1pdHRlciA8aHR0cHM6Ly9naXRodWIuY29tL3R1bm5ja29Db3JlL2R1YWwtZW1pdHRlcj5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgQ2hhcmxpa2UgTWlrZSBSZWFnZW50IDxAdHVubmNrb0NvcmU+IChodHRwOi8vd3d3LnR1bm5ja29jb3JlLnRrKVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0J1xuXG5mdW5jdGlvbiBEdWFsRW1pdHRlciAoZXZlbnRzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBEdWFsRW1pdHRlcikpIHtcbiAgICByZXR1cm4gbmV3IER1YWxFbWl0dGVyKGV2ZW50cylcbiAgfVxuXG4gIHRoaXMuX2V2ZW50cyA9IGV2ZW50cyAmJiB0eXBlb2YgZXZlbnRzID09PSAnb2JqZWN0JyA/IGV2ZW50cyA6IHt9XG59XG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uIChuYW1lLCBmbiwgZWwpIHtcbiAgdGhpcy5fZXZlbnRzW25hbWVdID0gdGhpcy5faGFzT3duKHRoaXMuX2V2ZW50cywgbmFtZSkgPyB0aGlzLl9ldmVudHNbbmFtZV0gOiBbXVxuICB0aGlzLl9ldmVudHNbbmFtZV0ucHVzaChmbilcblxuICBpZiAoZWwgJiYgdGhpcy5faXNEb20oZWwpKSB7XG4gICAgZm4ub3V0ZXJIVE1MID0gZWwub3V0ZXJIVE1MXG4gICAgdGhpcy5fZWxlbWVudCA9IGVsXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lclxuICAgICAgPyBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZuLCBmYWxzZSlcbiAgICAgIDogZWwuYXR0YWNoRXZlbnQoJ29uJyArIG5hbWUsIGZuKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiBvZmYgKG5hbWUsIGZuLCBlbCkge1xuICBpZiAoIXRoaXMuX2hhc093bih0aGlzLl9ldmVudHMsIG5hbWUpICYmICF0aGlzLl9ldmVudHNbbmFtZV0pIHJldHVybiB0aGlzXG4gIHRoaXMuX2V2ZW50c1tuYW1lXS5zcGxpY2UodGhpcy5fZXZlbnRzW25hbWVdLmluZGV4T2YoZm4pLCAxKVxuXG4gIGlmIChlbCAmJiB0aGlzLl9pc0RvbShlbCkpIHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyXG4gICAgICA/IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZm4sIGZhbHNlKVxuICAgICAgOiBlbC5kZXRhY2hFdmVudCgnb24nICsgbmFtZSwgZm4pXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuRHVhbEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlIChuYW1lLCBmbiwgZWwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGZ1bmN0aW9uIGhhbmRsZXIgKGV2dCkge1xuICAgIHNlbGYub2ZmKG5hbWUsIGhhbmRsZXIsIGVsKVxuICAgIHJldHVybiBmbihldnQpXG4gIH1cbiAgcmV0dXJuIHRoaXMub24obmFtZSwgaGFuZGxlciwgZWwpXG59XG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCAobmFtZSkge1xuICBpZiAoIXRoaXMuX2hhc093bih0aGlzLl9ldmVudHMsIG5hbWUpICYmICF0aGlzLl9ldmVudHNbbmFtZV0pIHJldHVybiB0aGlzXG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICB2YXIgZWwgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV1cbiAgdmFyIGlzZG9tID0gdGhpcy5faXNEb20oZWwpXG4gIGVsID0gaXNkb20gPyBlbCA6IHRoaXNcbiAgYXJncyA9IGlzZG9tID8gYXJncy5zbGljZSgwLCAtMSkgOiBhcmdzXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9ldmVudHNbbmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZm4gPSB0aGlzLl9ldmVudHNbbmFtZV1baV1cbiAgICBpZiAoaXNkb20gJiYgZm4ub3V0ZXJIVE1MICE9PSBlbC5vdXRlckhUTUwpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuICAgIGZuLmFwcGx5KGVsLCBhcmdzKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkR1YWxFbWl0dGVyLnByb3RvdHlwZS5faXNEb20gPSBmdW5jdGlvbiBpc0RvbSAob2JqKSB7XG4gIG9iaiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopLnNsaWNlKDgsIC0xKVxuICByZXR1cm4gLyg/OkhUTUwpPyg/Oi4qKUVsZW1lbnQvLnRlc3Qob2JqKVxufVxuXG5EdWFsRW1pdHRlci5wcm90b3R5cGUuX2hhc093biA9IGZ1bmN0aW9uIGhhc093biAob2JqLCBrZXkpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSlcbn1cblxuRHVhbEVtaXR0ZXIubWl4aW4gPSBmdW5jdGlvbiBtaXhpbiAocmVjZWl2ZXIsIHByb3ZpZGVyKSB7XG4gIHByb3ZpZGVyID0gcHJvdmlkZXIgfHwgdGhpc1xuICBmb3IgKHZhciBrZXkgaW4gcHJvdmlkZXIpIHtcbiAgICByZWNlaXZlci5jb25zdHJ1Y3RvcltrZXldID0gcHJvdmlkZXJba2V5XVxuICB9XG4gIHJlY2VpdmVyLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocHJvdmlkZXIucHJvdG90eXBlKVxuICBmb3IgKHZhciBwcm9wIGluIHJlY2VpdmVyKSB7XG4gICAgcmVjZWl2ZXIuY29uc3RydWN0b3IucHJvdG90eXBlW3Byb3BdID0gcmVjZWl2ZXJbcHJvcF1cbiAgfVxuICByZWNlaXZlci5jb25zdHJ1Y3Rvci5fX3N1cGVyX18gPSBwcm92aWRlci5wcm90b3R5cGVcbiAgcmV0dXJuIHJlY2VpdmVyLmNvbnN0cnVjdG9yXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRHVhbEVtaXR0ZXJcbiJdfQ==
