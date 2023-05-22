const electron = require("electron");

// 控制应用生命周期的模块
const { app, ipcMain, dialog, shell, nativeTheme } = electron;

// 创建本地浏览器窗口的模块
const { BrowserWindow } = electron;
const Store = require("electron-store");
const constants = require("constants");
const fs = require("fs");
const path = require("path");

// 指向窗口对象的一个全局引用，如果没有这个引用，那么当该javascript对象被垃圾回收的
// 时候该窗口将会自动关闭
let win;
let willQuitApp = false;
const store = new Store();
let isMaximized = false;

function createWindow(key) {
  // 创建一个新的浏览器窗口
  // nativeTheme.themeSource = "dark"
  //const Menu = electron.Menu
  // Menu.setApplicationMenu(null)
  const darkMode = store.get("dark-mode") ?? "system";
  switch (darkMode) {
    case "dark":
      nativeTheme.themeSource = "dark";
      break;
    case "light":
      nativeTheme.themeSource = "light";
      break;
    case "system":
      nativeTheme.themeSource = "system";
      break;
  }

  win = new BrowserWindow({
    //解决Electronjs window.require 不是一个函数
    //#202020 dark
    width: 1080,
    height: 700,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#202020" : "#ffffff",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webSecurity: false,
    },
    autoHideMenuBar: true,
    allowRunningInsecureContent: true,
    experimentalCanvasFeatures: true,
    titleBarStyle: "hidden",
    webSecurity: false,
    maximizable: false,
    // transparent: true,
    show: false,
    trafficLightPosition: { x: 16, y: 12 },
  });
  //win.setShape([0, 0, 0, 0, 20, 20, 20, 20])
  app.dock.bounce("critical");
  // trafficLightPosition控制三个点的位置
  // 并且装载应用的index.html页面
  win.loadFile(`./web/index.html`);

  // 打开开发工具页面
  //win.webContents.openDevTools();
  //记下窗口大小
  let contentBoundsStr = store.get("size") ?? "";
  if (contentBoundsStr !== "") {
    let contentBounds = JSON.parse(contentBoundsStr);
    win.setContentBounds(contentBounds);
  }
  //窗口大小变化
  win.on("resize", (e) => {
    if (!isMaximized) {
      let contentBounds = win.getContentBounds();
      store.set("size", JSON.stringify(contentBounds));
    }
  });
  //窗口移动
  win.on("moved", (e) => {
    if (!isMaximized) {
      let contentBounds = win.getContentBounds();
      store.set("size", JSON.stringify(contentBounds));
    }
  });

  // 当窗口关闭时调用的方法
  win.on("closed", () => {
    // 解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里
    // 存放窗口对象，在窗口关闭的时候应当删除相应的元素。
    win = null;
  });

  win.on("close", (e) => {
    if (willQuitApp) {
      win = null;
    } else {
      e.preventDefault();
      win.hide();
    }
  });

  //选择路径
  ipcMain.on("select_path", (event) => {
    dialog
      .showOpenDialog(win, {
        properties: ["openDirectory", "openFile"],
      })
      .then((result) => {
        if (result.canceled) {
          event.returnValue = "";
        } else {
          event.returnValue = result.filePaths[0];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ipcMain.on("select_directory", (event) => {
    dialog
      .showOpenDialog(win, {
        properties: ["openDirectory"],
      })
      .then((result) => {
        if (result.canceled) {
          event.returnValue = "";
        } else {
          event.returnValue = result.filePaths[0];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ipcMain.on("showItemInFolder", (event, args) => {
    shell.showItemInFolder(args.path);
  });

  ipcMain.handle("dark-mode:dark", () => {
    nativeTheme.themeSource = "dark";
    store.set("dark-mode", "dark");
  });
  ipcMain.handle("dark-mode:light", () => {
    nativeTheme.themeSource = "light";
    store.set("dark-mode", "light");
    return nativeTheme.shouldUseDarkColors;
  });
  ipcMain.handle("dark-mode", () => {
    return nativeTheme.themeSource;
  });
  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system";
    store.set("dark-mode", "system");
  });

  ipcMain.on("openDevTools", (event) => {
    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  });

  ipcMain.on("openFile", (event) => {
    dialog
      .showOpenDialog(win, {
        properties: ["openFile"],
      })
      .then((result) => {
        console.log(result.canceled);
        console.log(result.filePaths);
        if (result.canceled) {
          event.returnValue = "";
        } else {
          event.returnValue = result.filePaths[0];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  ipcMain.on("saveKey", (event, args) => {
    store.set(args.key, args.value);
    event.returnValue = args.value;
  });
  ipcMain.on("readKey", (event, args) => {
    event.returnValue = store.get(args.key);
  });

  // ipcMain.on('maximize-window', () => {
  //   if (win.maximizable){
  //     win.unmaximize()
  //   }else {
  //     win.maximize()
  //   }
  // });

  ipcMain.on("maximize-window", (event, args) => {
    if (isMaximized) {
      isMaximized = false;
      let contentBoundsStr = store.get("size") ?? "";
      win.unmaximize();
      if (contentBoundsStr !== "") {
        let contentBounds = JSON.parse(contentBoundsStr);
        win.setContentBounds(contentBounds, true);
      }
    } else {
      isMaximized = true;
      win.maximize();
    }
  });
  win.webContents.on("dom-ready", () => {
    //console.log('HTML DOM ready.');
    /*延迟400ms,打开就能看到页面*/
    setTimeout(function () {
      win.show();
    }, 400);
  });
}

function getResPath() {
  if (process.env.FAVOR === "debug") {
    return "./extraResources";
  } else {
    return process.resourcesPath + "/extraResources";
  }
}

// 当Electron完成初始化并且已经创建了浏览器窗口，则该方法将会被调用。
// 有些API只能在该事件发生后才能被使用。
app.on("ready", createWindow);
/* var mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false
  }
}); */
app.on("before-quit", () => (willQuitApp = true));

// 当所有的窗口被关闭后退出应用
app.on("window-all-closed", () => {
  // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
  app.exit();
});

app.on("activate", () => {
  // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他
  // 窗口打开

  if (win === null) {
    createWindow();
  } else {
    try {
      win.show();
    } catch (e) {}
  }
});
