/** Beatriz Manrique
 * CSE 3353
 * Project 1: Protect the Planes
 * February 24, 2018
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

// empty array will hold the pair of closest flights and their individual data
const closestData = [];
const diffClose = [];
const leftClose = [0, 0, 30];
const rightClose = [0, 0, 30];
const crossClose = [];

// sorted version of flightData array
var sortY = [];

// recursive solution
function recursiveSol(flightData){
    if(flightData.length === 1){
        console.log("Cannot find closest flight with only one flight.");
        return;
    };

    sortY = sortFlights(flightData, 1);
    //console.log(sortY);
    var small = recursive(sortY, sortY.length, 'last');   
    console.log(small);
    //console.log(leftClose);
    //console.log(rightClose);
    //console.log(diffClose);
    //console.log(crossClose);
    //console.log(closestData);
};

function recursive(section, length, mode){
    //console.log("Mode: " + mode);
    if(length <= 3){
        return bruteForce(section, length, mode);
    };

    var mid = Math.floor(length/2);
    var midFlight = section[mid].y;

    var left = section.slice(0, mid);
    var right = section.slice(mid);

    //console.log("FIRST recursive call Mode: " + mode);
    var diffLeft = recursive(left, left.length, 'l');
    //console.log("SECOND recursive call Mode: " + mode);
    var diffRight = recursive(right, right.length, 'r');

    var diff = findSmallest(diffLeft, diffRight, mode);

    var cross = [];
    var j = 0;
    for (var i = 0; i < length; i++){
        if((Math.abs(section[i].y) - Math.abs(midFlight)) < diff){
            cross[j] = section[i];
            j++;
        };
    };

    return findSmallestFin(diff, crossFind(cross, cross.length, diff, mode), mode);
};

// sort flightData array
// divide step
function sortFlights(flightData, code){
    if(flightData.length === 1){
        return flightData;
    }
    const  middle = Math.floor(flightData.length/2);
    const left = flightData.slice(0, middle);
    const right = flightData.slice(middle);
   
    return mergeMethod(sortFlights(left,code), sortFlights(right,code), code);
};

// conquer step
function mergeMethod(left, right, code){
    var result = [];
    var indexL = 0;
    var indexR = 0;

    var sort;

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
};

function findSmallest(diffLeft, diffRight, mode){
    if(diffLeft < diffRight){
        diffClose[0] = leftClose[0];
        diffClose[1] = leftClose[1];
        diffClose[2] = leftClose[2];
        return diffLeft;
    }
    diffClose[0] = rightClose[0];
    diffClose[1] = rightClose[1];
    diffClose[2] = rightClose[2];
    return diffRight;
};

function findSmallestFin(diffMin, crossMin, mode){
    if(diffMin < crossMin){
        closestData[0] = diffClose[0];
        closestData[1] = diffClose[1];
        closestData[2] = diffClose[2];
        return diffMin;
    }
    closestData[0] = crossClose[0];
    closestData[1] = crossClose[1];
    closestData[2] = crossClose[2];
    return crossMin;
 };

function crossFind(cross, size, diff, mode){
    var min = diff;
    //console.log(diff);

    // variable will hold x position of flight 1
    var x1 = 0
    // variable will hold x position of flight 2
    var x2 = 0;
    // variable will hold y position of flight 1
    var y1 = 0;
    // variable will hold y position of flight 2
    var y2 = 0;

    var distance = 0;

    for (var i = 0; i < size - 1; i++){
        for (var j = i+1; j < size && (cross[j].x - cross[i].x) < min; j++){
            x1 = cross[i].x;
            x2 = cross[j].x;
            y1 = cross[i].y;
            y2 = cross[j].y;

            distance = getDistance(x1, x2, y1, y2);
            // will replace only element of closestPair array is distance is less than the current minDistance
            if (distance < min){
                min = distance;
                crossClose[0] = cross[i];
                crossClose[1] = cross[j];
                crossClose[2] = min;
            };
        };
    };
    return min;
};

function bruteForce(section, length, mode){
    //console.log("BruteForce Mode: " + mode);
    if(section.length === 1){
        console.log("Cannot find closest flight with only one flight.");
        return;
    };
    
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
    for (var i = 0; i < length - 1; i++){
        for (var j = i+1; j < length && (section[j].y - section[i].y) < minDistance; j++){
            x1 = section[i].x;
            x2 = section[j].x;
            y1 = section[i].y;
            y2 = section[j].y;

            distance = getDistance(x1, x2, y1, y2);
            // will replace only element of closestPair array is distance is less than the current minDistance
            if (distance < minDistance){
                minDistance = distance;
                if (mode === 'l'){
                    leftClose[0] = section[i];
                    leftClose[1] = section[j];
                    leftClose[2] = minDistance;
                }
                if (mode === 'r'){
                    rightClose[0] = section[i];
                    rightClose[1] = section[j];
                    rightClose[2] = minDistance;
                }
            }
        };
    };
    return minDistance;
    //finalResult(closestData);
};

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

recursiveSol(flightData);
