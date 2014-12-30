/**
 * dual-emitter <https://github.com/tunnckoCore/dual-emitter>
 *
 * Copyright (c) 2014 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var DualEmitter = require('../index');
var dualEmitter = new DualEmitter();

dualEmitter
  .on('custom', function(one, two, arr, obj) {
    console.log('test', one, two, arr, obj);
    console.log('------------');
  })
  .emit('custom', 1, 2, [3, 4, 5], {six: 'seven'})
