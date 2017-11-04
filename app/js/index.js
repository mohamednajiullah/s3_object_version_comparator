'use strict';

var displayBreadCrumbs = $('#current_folder');
var displayList = $('#buckets');

function onSelectingItem() {
    var selectedOption = displayList.find('option:selected');
    displayBreadCrumbs.text(selectedOption.text());
    if(selectedOption.val() === 'bucket')
        getObjectsList(selectedOption.text(), 1000).then(createListToDisplay).then(updateSelectList);

}

function initialize(){
    displayBreadCrumbs.text("Buckets");

    getBucketsList().then(createListToDisplay).then(updateSelectList);
    displayList.bind('change', onSelectingItem);
}

function updateSelectList(objectsData) {
    displayList.empty();
    var text = 'Updating List..';
    var option = new Option(text, text);
    displayList.append($(option));
    displayList.empty();

    displayList.innerHTML = "";
    objectsData.forEach(function (object) {
        option = new Option(object.name, object.type);
        displayList.append($(option));
    })
}

function createListToDisplay(objectsList){
    var listToDisplay = [];
    if(objectsList.Buckets !== undefined){
        extractSingleProperty(objectsList.Buckets, 'Name').forEach(function(bucket){
            listToDisplay.push({name: bucket, type: 'bucket'});
        });
    }
    else{
        extractSingleProperty(objectsList.Contents, 'Key').forEach(function(object){
            listToDisplay.push({name: object, type: 'file'});
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

initialize();