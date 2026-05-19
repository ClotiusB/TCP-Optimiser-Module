let callbackCounter = 0;
function getUniqueCallbackName(prefix) {
  return `${prefix}_callback_${Date.now()}_${callbackCounter++}`;
}

// Framework detection - supports both KernelSU and APatch
function getFramework() {
  if (typeof ksu !== 'undefined') {
    return 'ksu';
  } else if (typeof apatch !== 'undefined') {
    return 'apatch';
  }
  return null;
}

// Get the appropriate API object
function getAPI() {
  const framework = getFramework();
  if (framework === 'ksu' && typeof ksu !== 'undefined') {
    return ksu;
  } else if (framework === 'apatch' && typeof apatch !== 'undefined') {
    return apatch;
  }
  return null;
}

export function exec(command, options) {
  if (typeof options === "undefined") {
    options = {};
  }

  return new Promise((resolve, reject) => {
    const callbackFuncName = getUniqueCallbackName("exec");
    
    window[callbackFuncName] = (errno, stdout, stderr) => {
      resolve({ errno, stdout, stderr });
      cleanup(callbackFuncName);
    };

    function cleanup(successName) {
      delete window[successName];
    }

    try {
      const api = getAPI();
      
      if (!api) {
        reject(new Error("No supported framework detected (KSU/APatch)"));
        cleanup(callbackFuncName);
        return;
      }

      // Both KSU and APatch use the same exec signature
      api.exec(command, JSON.stringify(options), callbackFuncName);
    } catch (error) {
      console.error("Exec error:", error);
      reject(error);
      cleanup(callbackFuncName);
    }
  });
}

function Stdio() {
  this.listeners = {};
}

Stdio.prototype.on = function (event, listener) {
  if (!this.listeners[event]) {
    this.listeners[event] = [];
  }
  this.listeners[event].push(listener);
};

Stdio.prototype.emit = function (event, ...args) {
  if (this.listeners[event]) {
    this.listeners[event].forEach((listener) => listener(...args));
  }
};

function ChildProcess() {
  this.listeners = {};
  this.stdin = new Stdio();
  this.stdout = new Stdio();
  this.stderr = new Stdio();
}

ChildProcess.prototype.on = function (event, listener) {
  if (!this.listeners[event]) {
    this.listeners[event] = [];
  }
  this.listeners[event].push(listener);
};

ChildProcess.prototype.emit = function (event, ...args) {
  if (this.listeners[event]) {
    this.listeners[event].forEach((listener) => listener(...args));
  }
};

export function spawn(command, args, options) {
  if (typeof args === "undefined") {
    args = [];
  } else if (!(args instanceof Array)) {
    options = args;
    args = [];
  }
  
  if (typeof options === "undefined") {
    options = {};
  }

  const child = new ChildProcess();
  const childCallbackName = getUniqueCallbackName("spawn");
  window[childCallbackName] = child;

  function cleanup(name) {
    delete window[name];
  }

  child.on("exit", code => {
    cleanup(childCallbackName);
  });

  try {
    const api = getAPI();
    
    if (!api) {
      child.emit("error", new Error("No supported framework detected (KSU/APatch)"));
      cleanup(childCallbackName);
      return child;
    }

    // Both KSU and APatch use the same spawn signature
    api.spawn(
      command,
      JSON.stringify(args),
      JSON.stringify(options),
      childCallbackName
    );
  } catch (error) {
    console.error("Spawn error:", error);
    child.emit("error", error);
    cleanup(childCallbackName);
  }
  
  return child;
}

export function fullScreen(isFullScreen) {
  const api = getAPI();
  if (api && api.fullScreen) {
    api.fullScreen(isFullScreen);
  }
}

export function toast(message) {
  const api = getAPI();
  if (api && api.toast) {
    api.toast(message);
  }
}

export function moduleInfo() {
  const api = getAPI();
  if (api && api.moduleInfo) {
    try {
      return api.moduleInfo();
    } catch (error) {
      console.error("moduleInfo error:", error);
      return "{}";
    }
  }
  return "{}";
}
