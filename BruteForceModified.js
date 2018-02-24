/** Beatriz Manrique
 * CSE 3353
 * Project 1: Protect the Planes
 * February 22, 2018
 */
'use strict';

// read from json file
const fs = require('fs');
fs.readFileSync('airline_map.json', (err, data) => {
    if(err){
        console.log(err); 
        return;
    }
});
const flightData = require('./airline_map.json');

// variables used
// empty array will hold the pair of closest flights and their individual data
const closestData = [];
// sorted version of flightData array
var flightSort = [];

// bruteForce method
function modForce(flightData){
    if(flightData.length === 1){
        console.log("Cannot find closest flight with only one flight.");
        return;
    }
    flightSort = sortFlights(flightData);

    // variable will hold x position of flight 1
    var x1 = 0
    // variable will hold x position of flight 2
    var x2 = 0;
    // variable will hold y position of flight 1
    var y1 = 0;
    // variable will hold y position of flight 2
    var y2 = 0;
    // variable will hold distance between two current flights
    var distance = 0;
    // variable will hold the smallest distance found so far
    var minDistance = 30;

    // run through rest of array comparing distances of every possible flight combination
    for (var i =0; i < flightSort.length - 1; i++){
        for (var j = i+1; j < flightSort.length && (flightSort[j].y - flightSort[i].y) < minDistance; j++)
        {
            x1 = flightSort[i].x;
            x2 = flightSort[j].x;
            y1 = flightSort[i].y;
            y2 = flightSort[j].y;

            distance = getDistance(x1, x2, y1, y2);
            // will replace only element of closestPair array is distance is less than the current minDistance
            if (distance < minDistance){
                minDistance = distance;
                closestData[0] = flightSort[i];
                closestData[1] = flightSort[j];
                closestData[2] = minDistance;
            }
        }
    };
    finalResult(closestData);
};

// sort flightData array
// divide step
function sortFlights(flightData){
    if(flightData.length === 1){
        return flightData;
    }
    const  middle = Math.floor(flightData.length/2);
    const left = flightData.slice(0, middle);
    const right = flightData.slice(middle);
   
    return mergeMethod(sortFlights(left), sortFlights(right));
};

// conquer step
function mergeMethod(left, right){
    var result = [];
    var indexL = 0;
    var indexR = 0;
    while(indexL < left.length && indexR < right.length){
        if(left[indexL].y < right[indexR].y){
            result.push(left[indexL]);
            indexL++;
        }
        else{
            result.push(right[indexR]);
            indexR++;
        }
    }
    return result.concat(left.slice(indexL)).concat(right.slice(indexR));
;}

// calculate distance between flights
function getDistance(x1, x2, y1, y2){
    var xVal = Math.pow((x2-x1),2);
    var yVal = Math.pow((y2-y1),2);
    var distance = Math.sqrt(xVal + yVal);
    return distance;
};

// Structures result in a cleaner, nicer way to read
function finalResult(closestData){
    console.log("Flight One: " + closestData[0].flightNumber + " is located at X:" + closestData[0].x + ", Y:" + closestData[0].y +".");
    console.log("Flight Two: " + closestData[1].flightNumber + " is located at X:" + closestData[1].x + ", Y:" + closestData[1].y +".");
    console.log("Distance between flights: " + closestData[2]);
};

// executes brute force algorithm
modForce(flightData);
