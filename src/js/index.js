// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron');
const currentWindow = electron.remote.getCurrentWindow()

var buttons = document.querySelectorAll('.nav-buttons');

for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    var link = button.attributes['link'].value;
    prepareButton(button, link);
}

function prepareButton(button, link) {
    button.addEventListener('click', function () {
        currentWindow.loadURL(`file://${__dirname}/../html/${link}.html`);
    });
}