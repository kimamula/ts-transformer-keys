(function () {
  'use strict';

  var fooKeys = ["foo"];
  console.log(fooKeys[0]);
  var fooBarBazKeys = ["bar"];
  fooBarBazKeys.forEach(function (key) { return console.log(key); });

}());
