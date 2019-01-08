(function () {
  'use strict';

  var fooKeys = ["foo"];
  console.log(fooKeys[0]);
  console.log(["foo", "bar"][1]);
  var fooBarOrBarBazKeys = ["bar"];
  fooBarOrBarBazKeys.forEach(function (key) { return console.log(key); });

}());
