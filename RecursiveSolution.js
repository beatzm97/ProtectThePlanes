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

    if(flightData.length < 3){
        bruteForce(flightData);
        return;
    };

    sortY = sortFlights(flightData, 1);
    recursive(sortY, sortY.length);   
};

function recursive(section, length){
    var mid = section.length/2;
    var midFlight = section[mid];

    if (section.length > 2){
        var diffLeft = recursive(section, mid);
        var diffRight = recursive(section + mid, length - mid);
    }

    var diff = findSmallest(diffLeft, diffRight);

    var smallSect = [];
    var j = 0;
    for (var i = 0; i < length; i++){
        if(abs(section[i].y - midFlight.x) < diff){
            smallSect[j] = section[i], j++;
        }
    }

    return findSmallest(diff, sectClose(smallSect, j, diff));

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

    if(code === 0){
        while(indexL < left.length && indexR < right.length){
            if(left[indexL].x < right[indexR].x){
                result.push(left[indexL]);
                indexL++;
            }
            else{
                result.push(right[indexR]);
                indexR++;
            }
        }
        return result.concat(left.slice(indexL)).concat(right.slice(indexR));
    }
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

function findSmallest(diffLeft, diffRight){
    if(diffLeft < diffRight){
        return diffLeft;
    }
    return diffRight;
};

function sectClose(smallSect, size, diff){
    var min = diff;
    sortX = sortFlights(flightData, 0);

    for (var i = 0; i < size; ++i){
        for (var j = i+1; j < size && (smallSect[j].x - smallSect[i].x) < min; ++j){
            x1 = smallSect[i].x;
            x2 = smallSect[j].x;
            y1 = smallSect[i].y;
            y2 = smallSect[j].y;

            distance = getDistance(x1, x2, y1, y2);
            // will replace only element of closestPair array is distance is less than the current minDistance
            if (distance < min){
                min = diff;
                closestData[0] = smallSect[i];
                closestData[1] = smallSect[j];
                closestData[2] = min;
            };
        };
    };
    return min;
};

function bruteForce(flightData){
    if(flightData.length === 1){
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
    for (var i = 0; i < flightData.length - 1; i++){
        for (var j = i+1; j < flightData.length; j++){
            x1 = flightData[i].x;
            x2 = flightData[j].x;
            y1 = flightData[i].y;
            y2 = flightData[j].y;

            distance = getDistance(x1, x2, y1, y2);
            // will replace only element of closestPair array is distance is less than the current minDistance
            if (distance < minDistance){
                minDistance = distance;
                closestData[0] = flightData[i];
                closestData[1] = flightData[j];
                closestData[2] = minDistance;
            }
        };
    };
    finalResult(closestData);
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
