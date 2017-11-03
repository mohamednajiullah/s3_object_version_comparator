'use strict';

var displayBreadCrumbs = document.getElementById('current_folder');
var displayList = document.getElementById('buckets');
var AWS = require('aws-sdk');


// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

displayBreadCrumbs.textContent = "Buckets";

displayList.addEventListener('change', function () {
    var selectedIndex = displayList.selectedIndex;
    displayBreadCrumbs.textContent = displayList[selectedIndex].value;
    getObjectsList(displayList[selectedIndex].value, 1000).then(function (objects_data) {
        displayList.innerHTML = "";
        objects_data.Contents.forEach(function (object) {
           displayList.options.add(new Option(object.Key, object.Key))
        })
    });
});
// console.log(displayBreadCrumbs);


// var bucketList;
getBucketsList().then(function (data) {
    displayList.options.remove(0);
    data.forEach(function (bucket) {
        displayList.options.add(new Option(bucket.Name, bucket.Name));
    });
    return displayList;
// }).then(function (list){
//     list.addEventListener('change',function(){
//         var selectedIndex = list.selectedIndex;
//         displayBreadCrumbs.textContent = list[selectedIndex].value;
//     });

});

// console.log(bucketList);


