/* eslint-disable */
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// --- Configuración ---
// En producción cambiar esto por tu URL real (ej: 'https://aura-pms.vercel.app')
const DASHBOARD_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://aura-dashboard-rho.vercel.app/'; 

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Aura Dashboard",
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // Quitar el menú por defecto para que parezca una app nativa
    Menu.setApplicationMenu(null);

    win.loadURL(DASHBOARD_URL);

    // Abrir DevTools solo en desarrollo si quieres
    // if (process.env.NODE_ENV === 'development') {
    //     win.webContents.openDevTools();
    // }

    win.on('page-title-updated', (e) => {
        e.preventDefault();
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
