'use strict';

var objectsLabel = $('#label_objects');
var versionsLabel = $('#label_versions');
var bucketsSelectList = $('#buckets_list');
var objectsContainer = $('#list_objects');
var versionsContainer = $('#list_versions');
var objectsSelectList = $('#objects_list');
var versionsSelectList = $('#versions_list');
var versionsCompareButton = $('#button_compare');
var selectedVersions, color = '';


function onSelectingBucket() {
    var selectedBucket = bucketsSelectList.find('option:selected');
    objectsLabel.text(selectedBucket.text());
    if (selectedBucket.val() === 'bucket') {
        // objectsContainer.show();
        getObjectsList(selectedBucket.text(), 1000).then(createListToDisplay).then(updateObjectsSelectList);
    }
}

function onSelectingObject() {
    var selectedBucket = bucketsSelectList.find('option:selected');
    var selectedObject = objectsSelectList.find('option:selected');
    versionsLabel.text(selectedObject.text());
    if (selectedObject.val() === 'file') {
        // versionsContainer.show();
        getObjectVersionsList(selectedBucket.text(), 1000, selectedObject.text()).then(createListToDisplay).then(updateVersionsSelectList);
    }
}


function validateSelection(e) {
    selectedVersions = versionsSelectList.find('option:selected');
    if(selectedVersions.length > 2){
        selectedVersions.removeAttr('selected');
    }

}

function initialize() {
    getBucketsList().then(createListToDisplay).then(updateBucketSelectList);
    bucketsSelectList.bind('change', onSelectingBucket);
    objectsSelectList.bind('change', onSelectingObject);
    versionsSelectList.bind('click', validateSelection);
    versionsCompareButton.bind('click', onComparing);
}

function updateBucketSelectList(objectsData) {
    bucketsSelectList.empty();
    var text = 'Updating List..';
    var option = new Option(text, text);
    bucketsSelectList.append($(option));
    bucketsSelectList.empty();

    bucketsSelectList.innerHTML = "";
    objectsData.forEach(function (object) {
        option = new Option(object.name, object.type);
        bucketsSelectList.append($(option));
    })
}

function updateObjectsSelectList(objectsData) {
    objectsSelectList.empty();
    var text = 'Updating List..';
    var option = new Option(text, text);
    objectsSelectList.append($(option));
    objectsSelectList.empty();

    objectsSelectList.innerHTML = "";
    objectsData.forEach(function (object) {
        option = new Option(object.name, object.type);
        objectsSelectList.append($(option));
    })
}

function updateVersionsSelectList(objectsData) {
    versionsSelectList.empty();
    var text = 'Updating List..';
    var option = new Option(text, text);
    versionsSelectList.append($(option));
    versionsSelectList.empty();

    versionsSelectList.innerHTML = "";
    objectsData.forEach(function (object) {
        option = new Option(object.name, object.type);
        versionsSelectList.append($(option));
    })
}

function createListToDisplay(objectsList) {
    var listToDisplay = [];
    if (objectsList.Buckets !== undefined) {
        extractSingleProperty(objectsList.Buckets, 'Name').forEach(function (bucket) {
            listToDisplay.push({name: bucket, type: 'bucket'});
        });
    }
    else if (objectsList.Contents !== undefined) {
        extractSingleProperty(objectsList.Contents, 'Key').forEach(function (object) {
            listToDisplay.push({name: object, type: 'file'});
        });
    }
    else {
        extractSingleProperty(objectsList.Versions, 'VersionId').forEach(function (object) {
            listToDisplay.push({name: object, type: object});
        });
    }
    return listToDisplay;
}

function extractSingleProperty(arrayOfObjects, keyToExtract) {
    var singlePropertyArray = arrayOfObjects.map(function (bucket) {
        return bucket[keyToExtract]
    });
    return singlePropertyArray;
}

function onComparing() {
    var selectedBucket = bucketsSelectList.find('option:selected');
    var selectedObject = objectsSelectList.find('option:selected');

    var versions = versionsSelectList.find('option:selected').map(function () {
        return this.innerText
    }).get().slice(0, 2);
    var version0FileName = createFileVersionName(selectedObject.text()) + '0';
    var version1FileName = createFileVersionName(selectedObject.text()) + '1';
    var fileTextVersions = [];

    getObjectByVersionId(selectedBucket.text(), selectedObject.text(), versions[0], version0FileName);
    getObjectByVersionId(selectedBucket.text(), selectedObject.text(), versions[1], version1FileName);
    setTimeout(function () {
        fileTextVersions.push(fs.readFileSync(version0FileName, 'utf8'));
        fileTextVersions.push(fs.readFileSync(version1FileName, 'utf8'));

        comparing(fileTextVersions);
    }, 5000);

}

function comparing(fileTextVersions) {

    var jsdiff = require('diff');

    var diffs = jsdiff.diffLines(fileTextVersions[1], fileTextVersions[0], false, true);


    var display = document.getElementById('display'), fragment = document.createDocumentFragment(), span = null, p = null;
    display.innerHTML = '';
    diffs.forEach(function (part) {
        // green for additions, red for deletions
        // grey for common parts
        color = part.added ? 'green' :
            part.removed ? 'red' : 'grey';
        p = document.createElement('p');
        span = document.createElement('span');
        span.style.color = color;
        span.appendChild(document
            .createTextNode(part.value));
        p.appendChild(span);
        fragment.appendChild(p);
        fragment.appendChild(document.createElement('br'));
    });

    display.appendChild(fragment);

}

function createFileVersionName(fileKey) {
    return path.join(__dirname, '..', 'compare_files', new Date().getTime().toString() + fileKey.split('/').pop());
}

initialize();