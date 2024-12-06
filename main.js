const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

require("./index.js");

const globalData = require('./info.json');
const puerto = globalData.port;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL(`http://localhost:${puerto}`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    ipcMain.on('show-alert', (event, message) => {
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Información',
            message: message,
            buttons: ['OK'],
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
