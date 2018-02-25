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
// sorted version of flightData array
var sortX = [];
var sortY = [];

// recursive solution
function recursiveSol(flightData){
    if(flightData.length === 1){
        console.log("Cannot find closest flight with only one flight.");
        return;
    };

    sortY = sortFlights(flightData, 1);
    //console.log(sortY[0].y);
    var small = recursive(sortY, sortY.length);   
    console.log(small);
};

function recursive(section, length){
    if(section.length <= 3){
        return bruteForce(section, length);
    };

    //console.log(section);
    
    //console.log(section[3].y);
    var mid = Math.floor(length/2);
    var midFlight = section[mid].y;

    let left = section.slice(0, mid);
    let right = section.slice(mid);

    //console.log(left);
    //console.log(right);
    var diffLeft = recursive(left, left.length);
    var diffRight = recursive(right, right.length);

    var diff = findSmallest(diffLeft, diffRight);
    //console.log(diff);

    var cross = [length];
    var j = 0;
    for (var i = 0; i < length; i++){
        if(Math.abs(section[i].y - midFlight) < diff){
            cross[j] = section[i];
            j++;
        }
    }

    return findSmallest(diff, crossClose(cross, cross.length, diff));

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
    if (code === 0){
        sort = 'x';
    }
    if (code === 1){
        sort = 'y';
    }

    while(indexL < left.length && indexR < right.length){
        if(left[indexL].sort < right[indexR].sort){
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

function findSmallest(diffLeft, diffRight){
    if(diffLeft < diffRight){
        return diffLeft;
    }
    return diffRight;
};

function crossClose(cross, size, diff){
    var min = diff;
    sortX = sortFlights(cross, 0);

    // variable will hold x position of flight 1
    var x1 = 0
    // variable will hold x position of flight 2
    var x2 = 0;
    // variable will hold y position of flight 1
    var y1 = 0;
    // variable will hold y position of flight 2
    var y2 = 0;

    var distance = 0;

    for (var i = 0; i < size; i++){
        for (var j = i+1; j < size && (sortX[j].x - sortX[i].x) < min; j++){
            x1 = sortX[i].x;
            x2 = sortX[j].x;
            y1 = sortX[i].y;
            y2 = sortX[j].y;

            distance = getDistance(x1, x2, y1, y2);
            // will replace only element of closestPair array is distance is less than the current minDistance
            if (distance < min){
                min = distance;
                //closestData[0] = smallSect[i];
                //closestData[1] = smallSect[j];
                //closestData[2] = min;
            };
        };
    };
    console.log(min);
    return min;
};

function bruteForce(section, length){
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
        for (var j = i+1; j < length; j++){
            x1 = section[i].x;
            x2 = section[j].x;
            y1 = section[i].y;
            y2 = section[j].y;

            distance = getDistance(x1, x2, y1, y2);
            // will replace only element of closestPair array is distance is less than the current minDistance
            if (distance < minDistance){
                minDistance = distance;
                //closestData[0] = section[i];
                //closestData[1] = section[j];
                //closestData[2] = minDistance;
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
