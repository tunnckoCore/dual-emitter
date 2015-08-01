/*!
 * dual-emitter <https://github.com/tunnckoCore/dual-emitter>
 *
 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var DualEmitter = require('./index')

test('dual-emitter:', function () {
  test('constructor should accept only object', function (done) {
    var emitter = new DualEmitter(12345)

    test.deepEqual(emitter._events, {})
    done()
  })
})
