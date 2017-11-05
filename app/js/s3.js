'use strict';
var Q = require('q');

// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list current buckets
var deferred;

function getBucketsList() {
    deferred = Q.defer();
    s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            deferred.resolve(data)
        }
    });
    return deferred.promise;
}

function getObjectsList(bucketName, maxItemsToReturn, prefixKey){
    deferred = Q.defer();
    prefixKey = prefixKey || '';
    var params = {
        Bucket: bucketName,
        MaxKeys: maxItemsToReturn,
        Prefix: prefixKey
    };
    s3.listObjects(params,function(err, objects_data) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else
            deferred.resolve(objects_data)
    });
    return deferred.promise;
}