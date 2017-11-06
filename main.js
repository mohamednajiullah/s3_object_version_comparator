'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;


var mainWindow = null;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 960
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.openDevTools();
});