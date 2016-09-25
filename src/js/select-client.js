// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron');
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const currentWindow = electron.remote.getCurrentWindow()

var loki = require('lokijs');
var database = new loki('app', {
    autoload: true,
    autoloadCallback : onDatabaseLoad
});

var buttons = document.querySelectorAll('.action-buttons');

for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    var action = button.attributes['action'].value;
    prepareButton(button, action);
}

function prepareButton(button, action) {
    button.addEventListener('click', function () {
        if (action == 'cancel') {
            currentWindow.loadURL(`file://${__dirname}/../html/index.html`);
        }
    });
}


function onDatabaseLoad() {
    var clientList = database.getCollection('clients').where(function(obj) {return true;});
    ipcRenderer.send('clientList', clientList);
}

