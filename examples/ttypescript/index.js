"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_transformer_keys_1 = require("ts-transformer-keys");
[];
var fooKeys = ["foo"];
console.log(fooKeys[0]);
console.log(["foo", "bar"][1]);
var fooBarOrBarBazKeys = ["bar"];
fooBarOrBarBazKeys.forEach(function (key) { return console.log(key); });
