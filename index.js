/**
 * dual-emitter <https://github.com/tunnckoCore/dual-emitter>
 *
 * Copyright (c) 2014 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

module.exports = function DualEmitter($) {
  $ = $ || this;
  $.events = $.events || {};
  $.inherit = function inherit(obj) {
    $ = obj || $;
    return $;
  }
  $.hasEvent = function hasEvent(name) {
    return (name in $.events) ? $.events[name] : 0;
  };
  $.isDom = function isDom(obj) {
    obj = Object.prototype.toString.call(obj).slice(8, -1);
    return /HTML(?:.*)Element/.test(obj);
  }
  $.on = function on(name, fn, func) {
    if (typeof name !== 'string' || $.isDom(name)) {
      if (name.attachListener) {
        name.attachListener('on' + fn, func, false);
        return $;
      }
      name.addEventListener(fn, func, false);

      $.events['i:' + fn] = func;
      return $;
    }
    $.events[name] = fn;
    return $;
  };
  $.off = function off(name) {
    if (!$.hasEvent(name)) {delete $.events[name];}
    return $;
  };
  $.emit = function emit(args) {
    args = [].slice.call(arguments);
    args.shift().split(' ').forEach(function(e) {
      $.hasEvent(e).apply(this, args);
    });
    return $;
  };
  return $;
};
