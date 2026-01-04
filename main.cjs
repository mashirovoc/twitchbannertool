const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    const startUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, 'dist/index.html')}`;

    win.loadURL(startUrl);
}

ipcMain.handle('save-image', async (event, url, gameName) => {
    const win = BrowserWindow.getFocusedWindow();

    const { filePath } = await dialog.showSaveDialog(win, {
        title: '画像を保存',
        defaultPath: path.join(app.getPath('downloads'), `${gameName.replace(/[/\\?%*:|"<>]/g, '-')}.jpg`),
        filters: [{ name: 'Images', extensions: ['jpg'] }]
    });

    if (!filePath) return { success: false };

    return new Promise((resolve) => {
        https.get(url, (response) => {
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve({ success: true });
            });
        }).on('error', (err) => {
            resolve({ success: false, error: err.message });
        });
    });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});