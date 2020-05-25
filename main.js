const /* Electron library */
  electron = require("electron"),
  app = electron.app,
  protocol = electron.protocol,
  BrowserWindow = electron.BrowserWindow;

const url = require("url");
const path = require("path");

function createWindow() {
  window = new BrowserWindow({ width: 800, height: 600 });
  window.loadURL(
    url.format({
      pathname: "main.html",
      protocol: "file",
      slashes: true,
    })
  );
  window.openDevTools();
  window.on("closed", () => {
    window = null;
  });
}

app.on("ready", () => {
  protocol.interceptFileProtocol(
    "file",
    (request, callback) => {
      let target_url = request.url.substr(7);
      if (target_url.endsWith("/")) {
        target_url = target_url.slice(0, -1);
      }
      callback({ path: path.normalize(`${__dirname}/${target_url}`) });
    },
    (err) => {
      if (err) console.error("Failed to register protocol");
    }
  );
  createWindow();
});
