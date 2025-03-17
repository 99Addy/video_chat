const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");
let isDev = require("electron-is-dev");

let mainWindow;
let popupX, popupY, popupSize, mainWindowWidth, height, width;

function logCursorPosition() {
  const cursorPosition = screen.getCursorScreenPoint();
  ({ width, height } = screen.getPrimaryDisplay().workAreaSize);
  if (cursorPosition.x >= width - 50) {
    if (!(mainWindow && mainWindow.isVisible())) {
      mainWindow.setAlwaysOnTop(true, "screen-saver");
      mainWindow.showInactive();
    }
  } else {
    if (
      mainWindow &&
      mainWindow.isVisible() &&
      mainWindow.getSize()[1] < popupSize + 100
    ) {
      const [x, y] = mainWindow.getPosition();
      const [w, h] = mainWindow.getSize();
      if (
        cursorPosition.x < x ||
        cursorPosition.x > x + w ||
        cursorPosition.y < y ||
        cursorPosition.y > y + h
      ) {
        mainWindow.hide();
      }
    }
  }
}

function createWindow() {
  ({ width, height } = screen.getPrimaryDisplay().workAreaSize);
  popupSize = 60;
  mainWindowWidth = 400;
  mainWindowX = width - mainWindowWidth - 10;
  popupX = width ? width - popupSize - 10 : 1300;
  popupY = height ? Math.floor((height - popupSize) / 2) : 540;

  mainWindow = new BrowserWindow({
    width: popupSize,
    height: popupSize,
    x: popupX,
    y: popupY,
    alwaysOnTop: true,
    frame: false,
    transparent: false,
    resizable: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Ensure correct path to preload.js
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: true, // Ensure nodeIntegration is false
    },
  });

  mainWindow.setContentProtection(true);

  if (false) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
  }

  mainWindow.on("blur", () => {
    // mainWindow.setContentProtection(false);
    console.log("electron: Main window is blurred");
    mainWindow.setMinimumSize(popupSize, popupSize);
    mainWindow.setSize(popupSize, popupSize);
    mainWindow.setPosition(popupX, popupY);
    mainWindow.hide();
    mainWindow.webContents.send("main-window-blur"); // Send IPC message
  });

  mainWindow.on("focus", () => {
    // mainWindow.setContentProtection(true);
    console.log("electron: Main window is focused");
    mainWindow.setSize(mainWindowWidth, height);
    mainWindow.setPosition(mainWindowX, 0); // Restore original position
    mainWindow.webContents.send("window-focus");
  });

  // Start logging cursor position every 500ms
  setInterval(logCursorPosition, 300);
}

// Listen for the 'open-main-window' event from the renderer process
ipcMain.on("open-main-window", () => {
  console.log("electron: Received open-main-window event");
  if (mainWindow && !mainWindow.isFocused()) {
    mainWindow.focus();
  }
});

ipcMain.handle("DESKTOP_CAPTURER_GET_SOURCES", (event, opts) =>
  electron.desktopCapturer.getSources(opts)
);

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
