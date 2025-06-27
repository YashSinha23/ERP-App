const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')
const isDev = !app.isPackaged

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false
        },
        icon: path.join(__dirname, 'public/icon.ico')
    })

    if (isDev) {
        // ✅ Dev mode: use Vite dev server
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        // ✅ Prod mode: use local file in asar
        win.loadFile(path.join(__dirname, 'dist', 'index.html'))
    }
}

app.whenReady().then(() => {
    createWindow()

    autoUpdater.checkForUpdatesAndNotify()

    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update Available',
            message: 'A new version is available. It will be downloaded in the background.',
        })
    })

    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'question',
            buttons: ['Restart', 'Later'],
            defaultId: 0,
            message: 'Update Ready',
            detail: 'An update has been downloaded. Restart now to apply it?',
        }, (response) => {
            if (response === 0) autoUpdater.quitAndInstall()
        })
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
