'use strict';

function checkIfFolderExists(foldersArray, key) {
    for(var i = 0;i <foldersArray.length;i++){
        if (typeof (foldersArray[i]) == 'object' && foldersArray[i].hasOwnProperty(key))
            return true;
    }
    return false;
}

function createFolderStructure(listOfObjects) {
    var files = [];
    listOfObjects.forEach(function (object) {
        var folders = files;
        var file_name_parts = object.split('/');

        for (var i = 0; i < file_name_parts.length - 1; i++) {
            if (!checkIfFolderExists(folders, file_name_parts[i])) {
                folders.push({[file_name_parts[i]]: []})
            }
            folders = folders.find(function (folder) {
                return typeof (folder) == 'object' && folder.hasOwnProperty(file_name_parts[i])
            })[file_name_parts[i]];
        }
        folders.push(file_name_parts[file_name_parts.length - 1]);
    });
    console.log(files);
}
