const { contextBridge, ipcRenderer } = require("electron");

const desktopCapturer = {
  getSources: (opts) =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts),
};

contextBridge.exposeInMainWorld("electron", {
  getSources: (opts) =>
    ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts),

  send: (channel, data) => {
    console.log(`preload.js: Sending IPC message to ${channel}`);
    ipcRenderer.send(channel, data);
  },
  receive: (channel, callback) => {
    console.log(`preload.js: Receiving IPC message from ${channel}`);
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  removeListener: (channel, callback) => {
    console.log(`preload.js: Removing listener for ${channel}`);
    ipcRenderer.removeListener(channel, callback);
  },
});
