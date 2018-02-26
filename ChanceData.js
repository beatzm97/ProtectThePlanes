/** Beatriz Manrique
 * CSE 3353
 * Project 1: Protect the Planes
 * February 15, 2018
 */
'use strict';

 // load chance
 var Chance = require('chance');

 // instantiate chance
 var chance = new Chance();

 // use chance
var flightData = [];

 for (var i = 0; i < 15; i++){
     var fNumber = (chance.string({length:2, pool:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'})) 
        + (chance.integer({min:0, max:9})) 
        + (chance.integer({min:0, max:9})) 
        + (chance.integer({min:0, max:9})) 
        + (chance.integer({min:0, max:9}));
     var xPos = chance.floating({min:-10, max:10});
     var yPos = chance.floating({min:-10, max: 10});

     var singleFlight = {
        flightNumber: fNumber,
        x: xPos,
        y: yPos
    };
     flightData.push(singleFlight);
 }

 // write to json file
 var output = JSON.stringify(flightData, null, "\t");
 const fs = require('fs');
 fs.writeFile('airline_map.json', output, 'utf-8', function(err){
     if(err){
         return console.log(err);
     }
 });
 