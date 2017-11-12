'use strict';

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

function getObjectsList(bucketName, maxItemsToReturn, prefixKey) {
    deferred = Q.defer();
    prefixKey = prefixKey || '';
    var params = {
        Bucket: bucketName,
        MaxKeys: maxItemsToReturn,
        Prefix: prefixKey
    };
    s3.listObjectsV2(params, function (err, objectsData) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else
            deferred.resolve(objectsData)
    });
    return deferred.promise;
}

function getObjectVersionsList(bucketName, maxItemsToReturn, prefixKey) {
    deferred = Q.defer();
    prefixKey = prefixKey || '';
    var params = {
        Bucket: bucketName,
        MaxKeys: maxItemsToReturn,
        Prefix: prefixKey
    };
    s3.listObjectVersions(params, function (err, objectVersionsData) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else
            deferred.resolve(objectVersionsData)
    });
    return deferred.promise;
}

function getObjectByVersionId(bucketName, key, versionId, fileNameToStore) {
    var file = fs.createWriteStream(fileNameToStore);
    var params = {
        Bucket: bucketName,
        Key: key,
        VersionId: versionId
    };
    s3.getObject(params).createReadStream().pipe(file);
}