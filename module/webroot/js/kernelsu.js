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

export function exec(command, options) {
  if (typeof options === "undefined") {
    options = {};
  }

  return new Promise((resolve, reject) => {
    // Generate a unique callback function name
    const callbackFuncName = getUniqueCallbackName("exec");

    // Define the success callback function
    window[callbackFuncName] = (errno, stdout, stderr) => {
      resolve({ errno, stdout, stderr });
      cleanup(callbackFuncName);
    };

    function cleanup(successName) {
      delete window[successName];
    }

    try {
      const framework = getFramework();
      
      if (framework === 'ksu') {
        ksu.exec(command, JSON.stringify(options), callbackFuncName);
      } else if (framework === 'apatch') {
        apatch.exec(command, JSON.stringify(options), callbackFuncName);
      } else {
        reject(new Error("No supported framework detected (KSU/APatch)"));
        cleanup(callbackFuncName);
      }
    } catch (error) {
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
        // allow for (command, options) signature
        options = args;
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
      const framework = getFramework();
      
      if (framework === 'ksu') {
        ksu.spawn(
          command,
          JSON.stringify(args),
          JSON.stringify(options),
          childCallbackName
        );
      } else if (framework === 'apatch') {
        apatch.spawn(
          command,
          JSON.stringify(args),
          JSON.stringify(options),
          childCallbackName
        );
      } else {
        child.emit("error", new Error("No supported framework detected (KSU/APatch)"));
        cleanup(childCallbackName);
      }
    } catch (error) {
      child.emit("error", error);
      cleanup(childCallbackName);
    }
    return child;
  }

export function fullScreen(isFullScreen) {
  const framework = getFramework();
  if (framework === 'ksu') {
    ksu.fullScreen(isFullScreen);
  } else if (framework === 'apatch') {
    apatch.fullScreen(isFullScreen);
  }
}

export function toast(message) {
  const framework = getFramework();
  if (framework === 'ksu') {
    ksu.toast(message);
  } else if (framework === 'apatch') {
    apatch.toast(message);
  }
}

export function moduleInfo() {
  const framework = getFramework();
  if (framework === 'ksu') {
    return ksu.moduleInfo();
  } else if (framework === 'apatch') {
    return apatch.moduleInfo();
  }
  return "{}";
}
