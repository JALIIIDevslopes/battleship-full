var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/readline-sync/lib/readline-sync.js
var require_readline_sync = __commonJS({
  "node_modules/readline-sync/lib/readline-sync.js"(exports2) {
    "use strict";
    var IS_WIN = process.platform === "win32";
    var ALGORITHM_CIPHER = "aes-256-cbc";
    var ALGORITHM_HASH = "sha256";
    var DEFAULT_ERR_MSG = "The current environment doesn't support interactive reading from TTY.";
    var fs = require("fs");
    var TTY = process.binding("tty_wrap").TTY;
    var childProc = require("child_process");
    var pathUtil = require("path");
    var defaultOptions = {
      /* eslint-disable key-spacing */
      prompt: "> ",
      hideEchoBack: false,
      mask: "*",
      limit: [],
      limitMessage: "Input another, please.$<( [)limit(])>",
      defaultInput: "",
      trueValue: [],
      falseValue: [],
      caseSensitive: false,
      keepWhitespace: false,
      encoding: "utf8",
      bufferSize: 1024,
      print: void 0,
      history: true,
      cd: false,
      phContent: void 0,
      preCheck: void 0
      /* eslint-enable key-spacing */
    };
    var fdR = "none";
    var isRawMode = false;
    var salt = 0;
    var lastInput = "";
    var inputHistory = [];
    var _DBG_useExt = false;
    var _DBG_checkOptions = false;
    var _DBG_checkMethod = false;
    var fdW;
    var ttyR;
    var extHostPath;
    var extHostArgs;
    var tempdir;
    var rawInput;
    function getHostArgs(options) {
      function encodeArg(arg) {
        return arg.replace(/[^\w\u0080-\uFFFF]/g, function(chr) {
          return "#" + chr.charCodeAt(0) + ";";
        });
      }
      return extHostArgs.concat((function(conf) {
        var args = [];
        Object.keys(conf).forEach(function(optionName) {
          if (conf[optionName] === "boolean") {
            if (options[optionName]) {
              args.push("--" + optionName);
            }
          } else if (conf[optionName] === "string") {
            if (options[optionName]) {
              args.push("--" + optionName, encodeArg(options[optionName]));
            }
          }
        });
        return args;
      })({
        /* eslint-disable key-spacing */
        display: "string",
        displayOnly: "boolean",
        keyIn: "boolean",
        hideEchoBack: "boolean",
        mask: "string",
        limit: "string",
        caseSensitive: "boolean"
        /* eslint-enable key-spacing */
      }));
    }
    function _execFileSync(options, execOptions) {
      function getTempfile(name) {
        var suffix = "", filepath, fd;
        tempdir = tempdir || require("os").tmpdir();
        while (true) {
          filepath = pathUtil.join(tempdir, name + suffix);
          try {
            fd = fs.openSync(filepath, "wx");
          } catch (e) {
            if (e.code === "EEXIST") {
              suffix++;
              continue;
            } else {
              throw e;
            }
          }
          fs.closeSync(fd);
          break;
        }
        return filepath;
      }
      var res = {}, pathStdout = getTempfile("readline-sync.stdout"), pathStderr = getTempfile("readline-sync.stderr"), pathExit = getTempfile("readline-sync.exit"), pathDone = getTempfile("readline-sync.done"), crypto = require("crypto"), hostArgs, shellPath, shellArgs, exitCode, extMessage, shasum, decipher, password;
      shasum = crypto.createHash(ALGORITHM_HASH);
      shasum.update("" + process.pid + salt++ + Math.random());
      password = shasum.digest("hex");
      decipher = crypto.createDecipher(ALGORITHM_CIPHER, password);
      hostArgs = getHostArgs(options);
      if (IS_WIN) {
        shellPath = process.env.ComSpec || "cmd.exe";
        process.env.Q = '"';
        shellArgs = [
          "/V:ON",
          "/S",
          "/C",
          "(%Q%" + shellPath + "%Q% /V:ON /S /C %Q%%Q%" + extHostPath + "%Q%" + hostArgs.map(function(arg) {
            return " %Q%" + arg + "%Q%";
          }).join("") + " & (echo !ERRORLEVEL!)>%Q%" + pathExit + "%Q%%Q%) 2>%Q%" + pathStderr + "%Q% |%Q%" + process.execPath + "%Q% %Q%" + __dirname + "\\encrypt.js%Q% %Q%" + ALGORITHM_CIPHER + "%Q% %Q%" + password + "%Q% >%Q%" + pathStdout + "%Q% & (echo 1)>%Q%" + pathDone + "%Q%"
        ];
      } else {
        shellPath = "/bin/sh";
        shellArgs = [
          "-c",
          // Use `()`, not `{}` for `-c` (text param)
          '("' + extHostPath + '"' + /* ESLint bug? */
          // eslint-disable-line no-path-concat
          hostArgs.map(function(arg) {
            return " '" + arg.replace(/'/g, "'\\''") + "'";
          }).join("") + '; echo $?>"' + pathExit + '") 2>"' + pathStderr + '" |"' + process.execPath + '" "' + __dirname + '/encrypt.js" "' + ALGORITHM_CIPHER + '" "' + password + '" >"' + pathStdout + '"; echo 1 >"' + pathDone + '"'
        ];
      }
      if (_DBG_checkMethod) {
        _DBG_checkMethod("_execFileSync", hostArgs);
      }
      try {
        childProc.spawn(shellPath, shellArgs, execOptions);
      } catch (e) {
        res.error = new Error(e.message);
        res.error.method = "_execFileSync - spawn";
        res.error.program = shellPath;
        res.error.args = shellArgs;
      }
      while (fs.readFileSync(pathDone, { encoding: options.encoding }).trim() !== "1") {
      }
      if ((exitCode = fs.readFileSync(pathExit, { encoding: options.encoding }).trim()) === "0") {
        res.input = decipher.update(
          fs.readFileSync(pathStdout, { encoding: "binary" }),
          "hex",
          options.encoding
        ) + decipher.final(options.encoding);
      } else {
        extMessage = fs.readFileSync(pathStderr, { encoding: options.encoding }).trim();
        res.error = new Error(DEFAULT_ERR_MSG + (extMessage ? "\n" + extMessage : ""));
        res.error.method = "_execFileSync";
        res.error.program = shellPath;
        res.error.args = shellArgs;
        res.error.extMessage = extMessage;
        res.error.exitCode = +exitCode;
      }
      fs.unlinkSync(pathStdout);
      fs.unlinkSync(pathStderr);
      fs.unlinkSync(pathExit);
      fs.unlinkSync(pathDone);
      return res;
    }
    function readlineExt(options) {
      var res = {}, execOptions = { env: process.env, encoding: options.encoding }, hostArgs, extMessage;
      if (!extHostPath) {
        if (IS_WIN) {
          if (process.env.PSModulePath) {
            extHostPath = "powershell.exe";
            extHostArgs = [
              "-ExecutionPolicy",
              "Bypass",
              "-File",
              __dirname + "\\read.ps1"
            ];
          } else {
            extHostPath = "cscript.exe";
            extHostArgs = ["//nologo", __dirname + "\\read.cs.js"];
          }
        } else {
          extHostPath = "/bin/sh";
          extHostArgs = [__dirname + "/read.sh"];
        }
      }
      if (IS_WIN && !process.env.PSModulePath) {
        execOptions.stdio = [process.stdin];
      }
      if (childProc.execFileSync) {
        hostArgs = getHostArgs(options);
        if (_DBG_checkMethod) {
          _DBG_checkMethod("execFileSync", hostArgs);
        }
        try {
          res.input = childProc.execFileSync(extHostPath, hostArgs, execOptions);
        } catch (e) {
          extMessage = e.stderr ? (e.stderr + "").trim() : "";
          res.error = new Error(DEFAULT_ERR_MSG + (extMessage ? "\n" + extMessage : ""));
          res.error.method = "execFileSync";
          res.error.program = extHostPath;
          res.error.args = hostArgs;
          res.error.extMessage = extMessage;
          res.error.exitCode = e.status;
          res.error.code = e.code;
          res.error.signal = e.signal;
        }
      } else {
        res = _execFileSync(options, execOptions);
      }
      if (!res.error) {
        res.input = res.input.replace(/^\s*'|'\s*$/g, "");
        options.display = "";
      }
      return res;
    }
    function _readlineSync(options) {
      var input = "", displaySave = options.display, silent = !options.display && options.keyIn && options.hideEchoBack && !options.mask;
      function tryExt() {
        var res = readlineExt(options);
        if (res.error) {
          throw res.error;
        }
        return res.input;
      }
      if (_DBG_checkOptions) {
        _DBG_checkOptions(options);
      }
      (function() {
        var fsB, constants, verNum;
        function getFsB() {
          if (!fsB) {
            fsB = process.binding("fs");
            constants = process.binding("constants");
            constants = constants && constants.fs && typeof constants.fs.O_RDWR === "number" ? constants.fs : constants;
          }
          return fsB;
        }
        if (typeof fdR !== "string") {
          return;
        }
        fdR = null;
        if (IS_WIN) {
          verNum = (function(ver) {
            var nums = ver.replace(/^\D+/, "").split(".");
            var verNum2 = 0;
            if (nums[0] = +nums[0]) {
              verNum2 += nums[0] * 1e4;
            }
            if (nums[1] = +nums[1]) {
              verNum2 += nums[1] * 100;
            }
            if (nums[2] = +nums[2]) {
              verNum2 += nums[2];
            }
            return verNum2;
          })(process.version);
          if (!(verNum >= 20302 && verNum < 40204 || verNum >= 5e4 && verNum < 50100 || verNum >= 50600 && verNum < 60200) && process.stdin.isTTY) {
            process.stdin.pause();
            fdR = process.stdin.fd;
            ttyR = process.stdin._handle;
          } else {
            try {
              fdR = getFsB().open("CONIN$", constants.O_RDWR, parseInt("0666", 8));
              ttyR = new TTY(fdR, true);
            } catch (e) {
            }
          }
          if (process.stdout.isTTY) {
            fdW = process.stdout.fd;
          } else {
            try {
              fdW = fs.openSync("\\\\.\\CON", "w");
            } catch (e) {
            }
            if (typeof fdW !== "number") {
              try {
                fdW = getFsB().open("CONOUT$", constants.O_RDWR, parseInt("0666", 8));
              } catch (e) {
              }
            }
          }
        } else {
          if (process.stdin.isTTY) {
            process.stdin.pause();
            try {
              fdR = fs.openSync("/dev/tty", "r");
              ttyR = process.stdin._handle;
            } catch (e) {
            }
          } else {
            try {
              fdR = fs.openSync("/dev/tty", "r");
              ttyR = new TTY(fdR, false);
            } catch (e) {
            }
          }
          if (process.stdout.isTTY) {
            fdW = process.stdout.fd;
          } else {
            try {
              fdW = fs.openSync("/dev/tty", "w");
            } catch (e) {
            }
          }
        }
      })();
      (function() {
        var isCooked = !options.hideEchoBack && !options.keyIn, atEol, limit, buffer, reqSize, readSize, chunk, line;
        rawInput = "";
        function setRawMode(mode) {
          if (mode === isRawMode) {
            return true;
          }
          if (ttyR.setRawMode(mode) !== 0) {
            return false;
          }
          isRawMode = mode;
          return true;
        }
        if (_DBG_useExt || !ttyR || typeof fdW !== "number" && (options.display || !isCooked)) {
          input = tryExt();
          return;
        }
        if (options.display) {
          fs.writeSync(fdW, options.display);
          options.display = "";
        }
        if (options.displayOnly) {
          return;
        }
        if (!setRawMode(!isCooked)) {
          input = tryExt();
          return;
        }
        reqSize = options.keyIn ? 1 : options.bufferSize;
        buffer = Buffer.allocUnsafe && Buffer.alloc ? Buffer.alloc(reqSize) : new Buffer(reqSize);
        if (options.keyIn && options.limit) {
          limit = new RegExp(
            "[^" + options.limit + "]",
            "g" + (options.caseSensitive ? "" : "i")
          );
        }
        while (true) {
          readSize = 0;
          try {
            readSize = fs.readSync(fdR, buffer, 0, reqSize);
          } catch (e) {
            if (e.code !== "EOF") {
              setRawMode(false);
              input += tryExt();
              return;
            }
          }
          if (readSize > 0) {
            chunk = buffer.toString(options.encoding, 0, readSize);
            rawInput += chunk;
          } else {
            chunk = "\n";
            rawInput += String.fromCharCode(0);
          }
          if (chunk && typeof (line = (chunk.match(/^(.*?)[\r\n]/) || [])[1]) === "string") {
            chunk = line;
            atEol = true;
          }
          if (chunk) {
            chunk = chunk.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
          }
          if (chunk && limit) {
            chunk = chunk.replace(limit, "");
          }
          if (chunk) {
            if (!isCooked) {
              if (!options.hideEchoBack) {
                fs.writeSync(fdW, chunk);
              } else if (options.mask) {
                fs.writeSync(fdW, new Array(chunk.length + 1).join(options.mask));
              }
            }
            input += chunk;
          }
          if (!options.keyIn && atEol || options.keyIn && input.length >= reqSize) {
            break;
          }
        }
        if (!isCooked && !silent) {
          fs.writeSync(fdW, "\n");
        }
        setRawMode(false);
      })();
      if (options.print && !silent) {
        options.print(
          displaySave + (options.displayOnly ? "" : (options.hideEchoBack ? new Array(input.length + 1).join(options.mask) : input) + "\n"),
          options.encoding
        );
      }
      return options.displayOnly ? "" : lastInput = options.keepWhitespace || options.keyIn ? input : input.trim();
    }
    function flattenArray(array, validator) {
      var flatArray = [];
      function _flattenArray(array2) {
        if (array2 == null) {
          return;
        }
        if (Array.isArray(array2)) {
          array2.forEach(_flattenArray);
        } else if (!validator || validator(array2)) {
          flatArray.push(array2);
        }
      }
      _flattenArray(array);
      return flatArray;
    }
    function escapePattern(pattern) {
      return pattern.replace(
        /[\x00-\x7f]/g,
        // eslint-disable-line no-control-regex
        function(s) {
          return "\\x" + ("00" + s.charCodeAt().toString(16)).substr(-2);
        }
      );
    }
    function margeOptions() {
      var optionsList = Array.prototype.slice.call(arguments), optionNames, fromDefault;
      if (optionsList.length && typeof optionsList[0] === "boolean") {
        fromDefault = optionsList.shift();
        if (fromDefault) {
          optionNames = Object.keys(defaultOptions);
          optionsList.unshift(defaultOptions);
        }
      }
      return optionsList.reduce(function(options, optionsPart) {
        if (optionsPart == null) {
          return options;
        }
        if (optionsPart.hasOwnProperty("noEchoBack") && !optionsPart.hasOwnProperty("hideEchoBack")) {
          optionsPart.hideEchoBack = optionsPart.noEchoBack;
          delete optionsPart.noEchoBack;
        }
        if (optionsPart.hasOwnProperty("noTrim") && !optionsPart.hasOwnProperty("keepWhitespace")) {
          optionsPart.keepWhitespace = optionsPart.noTrim;
          delete optionsPart.noTrim;
        }
        if (!fromDefault) {
          optionNames = Object.keys(optionsPart);
        }
        optionNames.forEach(function(optionName) {
          var value;
          if (!optionsPart.hasOwnProperty(optionName)) {
            return;
          }
          value = optionsPart[optionName];
          switch (optionName) {
            //                    _readlineSync <- *    * -> defaultOptions
            // ================ string
            case "mask":
            // *    *
            case "limitMessage":
            //      *
            case "defaultInput":
            //      *
            case "encoding":
              value = value != null ? value + "" : "";
              if (value && optionName !== "limitMessage") {
                value = value.replace(/[\r\n]/g, "");
              }
              options[optionName] = value;
              break;
            // ================ number(int)
            case "bufferSize":
              if (!isNaN(value = parseInt(value, 10)) && typeof value === "number") {
                options[optionName] = value;
              }
              break;
            // ================ boolean
            case "displayOnly":
            // *
            case "keyIn":
            // *
            case "hideEchoBack":
            // *    *
            case "caseSensitive":
            // *    *
            case "keepWhitespace":
            // *    *
            case "history":
            //      *
            case "cd":
              options[optionName] = !!value;
              break;
            // ================ array
            case "limit":
            // *    *     to string for readlineExt
            case "trueValue":
            //      *
            case "falseValue":
              options[optionName] = flattenArray(value, function(value2) {
                var type = typeof value2;
                return type === "string" || type === "number" || type === "function" || value2 instanceof RegExp;
              }).map(function(value2) {
                return typeof value2 === "string" ? value2.replace(/[\r\n]/g, "") : value2;
              });
              break;
            // ================ function
            case "print":
            // *    *
            case "phContent":
            //      *
            case "preCheck":
              options[optionName] = typeof value === "function" ? value : void 0;
              break;
            // ================ other
            case "prompt":
            //      *
            case "display":
              options[optionName] = value != null ? value : "";
              break;
          }
        });
        return options;
      }, {});
    }
    function isMatched(res, comps, caseSensitive) {
      return comps.some(function(comp) {
        var type = typeof comp;
        return type === "string" ? caseSensitive ? res === comp : res.toLowerCase() === comp.toLowerCase() : type === "number" ? parseFloat(res) === comp : type === "function" ? comp(res) : comp instanceof RegExp ? comp.test(res) : false;
      });
    }
    function replaceHomePath(path, expand) {
      var homePath = pathUtil.normalize(
        IS_WIN ? (process.env.HOMEDRIVE || "") + (process.env.HOMEPATH || "") : process.env.HOME || ""
      ).replace(/[/\\]+$/, "");
      path = pathUtil.normalize(path);
      return expand ? path.replace(/^~(?=\/|\\|$)/, homePath) : path.replace(new RegExp("^" + escapePattern(homePath) + "(?=\\/|\\\\|$)", IS_WIN ? "i" : ""), "~");
    }
    function replacePlaceholder(text, generator) {
      var PTN_INNER = "(?:\\(([\\s\\S]*?)\\))?(\\w+|.-.)(?:\\(([\\s\\S]*?)\\))?", rePlaceholder = new RegExp("(\\$)?(\\$<" + PTN_INNER + ">)", "g"), rePlaceholderCompat = new RegExp("(\\$)?(\\$\\{" + PTN_INNER + "\\})", "g");
      function getPlaceholderText(s, escape, placeholder, pre, param, post) {
        var text2;
        return escape || typeof (text2 = generator(param)) !== "string" ? placeholder : text2 ? (pre || "") + text2 + (post || "") : "";
      }
      return text.replace(rePlaceholder, getPlaceholderText).replace(rePlaceholderCompat, getPlaceholderText);
    }
    function array2charlist(array, caseSensitive, collectSymbols) {
      var group = [], groupClass = -1, charCode = 0, symbols = "", values, suppressed;
      function addGroup(groups, group2) {
        if (group2.length > 3) {
          groups.push(group2[0] + "..." + group2[group2.length - 1]);
          suppressed = true;
        } else if (group2.length) {
          groups = groups.concat(group2);
        }
        return groups;
      }
      values = array.reduce(function(chars, value) {
        return chars.concat((value + "").split(""));
      }, []).reduce(function(groups, curChar) {
        var curGroupClass, curCharCode;
        if (!caseSensitive) {
          curChar = curChar.toLowerCase();
        }
        curGroupClass = /^\d$/.test(curChar) ? 1 : /^[A-Z]$/.test(curChar) ? 2 : /^[a-z]$/.test(curChar) ? 3 : 0;
        if (collectSymbols && curGroupClass === 0) {
          symbols += curChar;
        } else {
          curCharCode = curChar.charCodeAt(0);
          if (curGroupClass && curGroupClass === groupClass && curCharCode === charCode + 1) {
            group.push(curChar);
          } else {
            groups = addGroup(groups, group);
            group = [curChar];
            groupClass = curGroupClass;
          }
          charCode = curCharCode;
        }
        return groups;
      }, []);
      values = addGroup(values, group);
      if (symbols) {
        values.push(symbols);
        suppressed = true;
      }
      return { values, suppressed };
    }
    function joinChunks(chunks, suppressed) {
      return chunks.join(chunks.length > 2 ? ", " : suppressed ? " / " : "/");
    }
    function getPhContent(param, options) {
      var resCharlist = {}, text, values, arg;
      if (options.phContent) {
        text = options.phContent(param, options);
      }
      if (typeof text !== "string") {
        switch (param) {
          case "hideEchoBack":
          case "mask":
          case "defaultInput":
          case "caseSensitive":
          case "keepWhitespace":
          case "encoding":
          case "bufferSize":
          case "history":
          case "cd":
            text = !options.hasOwnProperty(param) ? "" : typeof options[param] === "boolean" ? options[param] ? "on" : "off" : options[param] + "";
            break;
          // case 'prompt':
          // case 'query':
          // case 'display':
          //   text = options.hasOwnProperty('displaySrc') ? options.displaySrc + '' : '';
          //   break;
          case "limit":
          case "trueValue":
          case "falseValue":
            values = options[options.hasOwnProperty(param + "Src") ? param + "Src" : param];
            if (options.keyIn) {
              resCharlist = array2charlist(values, options.caseSensitive);
              values = resCharlist.values;
            } else {
              values = values.filter(function(value) {
                var type = typeof value;
                return type === "string" || type === "number";
              });
            }
            text = joinChunks(values, resCharlist.suppressed);
            break;
          case "limitCount":
          case "limitCountNotZero":
            text = options[options.hasOwnProperty("limitSrc") ? "limitSrc" : "limit"].length;
            text = text || param !== "limitCountNotZero" ? text + "" : "";
            break;
          case "lastInput":
            text = lastInput;
            break;
          case "cwd":
          case "CWD":
          case "cwdHome":
            text = process.cwd();
            if (param === "CWD") {
              text = pathUtil.basename(text);
            } else if (param === "cwdHome") {
              text = replaceHomePath(text);
            }
            break;
          case "date":
          case "time":
          case "localeDate":
          case "localeTime":
            text = (/* @__PURE__ */ new Date())["to" + param.replace(/^./, function(str) {
              return str.toUpperCase();
            }) + "String"]();
            break;
          default:
            if (typeof (arg = (param.match(/^history_m(\d+)$/) || [])[1]) === "string") {
              text = inputHistory[inputHistory.length - arg] || "";
            }
        }
      }
      return text;
    }
    function getPhCharlist(param) {
      var matches = /^(.)-(.)$/.exec(param), text = "", from, to, code, step;
      if (!matches) {
        return null;
      }
      from = matches[1].charCodeAt(0);
      to = matches[2].charCodeAt(0);
      step = from < to ? 1 : -1;
      for (code = from; code !== to + step; code += step) {
        text += String.fromCharCode(code);
      }
      return text;
    }
    function parseCl(cl) {
      var reToken = new RegExp(/(\s*)(?:("|')(.*?)(?:\2|$)|(\S+))/g), taken = "", args = [], matches, part;
      cl = cl.trim();
      while (matches = reToken.exec(cl)) {
        part = matches[3] || matches[4] || "";
        if (matches[1]) {
          args.push(taken);
          taken = "";
        }
        taken += part;
      }
      if (taken) {
        args.push(taken);
      }
      return args;
    }
    function toBool(res, options) {
      return options.trueValue.length && isMatched(res, options.trueValue, options.caseSensitive) ? true : options.falseValue.length && isMatched(res, options.falseValue, options.caseSensitive) ? false : res;
    }
    function getValidLine(options) {
      var res, forceNext, limitMessage, matches, histInput, args, resCheck;
      function _getPhContent(param) {
        return getPhContent(param, options);
      }
      function addDisplay(text) {
        options.display += (/[^\r\n]$/.test(options.display) ? "\n" : "") + text;
      }
      options.limitSrc = options.limit;
      options.displaySrc = options.display;
      options.limit = "";
      options.display = replacePlaceholder(options.display + "", _getPhContent);
      while (true) {
        res = _readlineSync(options);
        forceNext = false;
        limitMessage = "";
        if (options.defaultInput && !res) {
          res = options.defaultInput;
        }
        if (options.history) {
          if (matches = /^\s*!(?:!|-1)(:p)?\s*$/.exec(res)) {
            histInput = inputHistory[0] || "";
            if (matches[1]) {
              forceNext = true;
            } else {
              res = histInput;
            }
            addDisplay(histInput + "\n");
            if (!forceNext) {
              options.displayOnly = true;
              _readlineSync(options);
              options.displayOnly = false;
            }
          } else if (res && res !== inputHistory[inputHistory.length - 1]) {
            inputHistory = [res];
          }
        }
        if (!forceNext && options.cd && res) {
          args = parseCl(res);
          switch (args[0].toLowerCase()) {
            case "cd":
              if (args[1]) {
                try {
                  process.chdir(replaceHomePath(args[1], true));
                } catch (e) {
                  addDisplay(e + "");
                }
              }
              forceNext = true;
              break;
            case "pwd":
              addDisplay(process.cwd());
              forceNext = true;
              break;
          }
        }
        if (!forceNext && options.preCheck) {
          resCheck = options.preCheck(res, options);
          res = resCheck.res;
          if (resCheck.forceNext) {
            forceNext = true;
          }
        }
        if (!forceNext) {
          if (!options.limitSrc.length || isMatched(res, options.limitSrc, options.caseSensitive)) {
            break;
          }
          if (options.limitMessage) {
            limitMessage = replacePlaceholder(options.limitMessage, _getPhContent);
          }
        }
        addDisplay((limitMessage ? limitMessage + "\n" : "") + replacePlaceholder(options.displaySrc + "", _getPhContent));
      }
      return toBool(res, options);
    }
    exports2._DBG_set_useExt = function(val) {
      _DBG_useExt = val;
    };
    exports2._DBG_set_checkOptions = function(val) {
      _DBG_checkOptions = val;
    };
    exports2._DBG_set_checkMethod = function(val) {
      _DBG_checkMethod = val;
    };
    exports2._DBG_clearHistory = function() {
      lastInput = "";
      inputHistory = [];
    };
    exports2.setDefaultOptions = function(options) {
      defaultOptions = margeOptions(true, options);
      return margeOptions(true);
    };
    exports2.question = function(query, options) {
      return getValidLine(margeOptions(margeOptions(true, options), {
        display: query
      }));
    };
    exports2.prompt = function(options) {
      var readOptions = margeOptions(true, options);
      readOptions.display = readOptions.prompt;
      return getValidLine(readOptions);
    };
    exports2.keyIn = function(query, options) {
      var readOptions = margeOptions(margeOptions(true, options), {
        display: query,
        keyIn: true,
        keepWhitespace: true
      });
      readOptions.limitSrc = readOptions.limit.filter(function(value) {
        var type = typeof value;
        return type === "string" || type === "number";
      }).map(function(text) {
        return replacePlaceholder(text + "", getPhCharlist);
      });
      readOptions.limit = escapePattern(readOptions.limitSrc.join(""));
      ["trueValue", "falseValue"].forEach(function(optionName) {
        readOptions[optionName] = readOptions[optionName].reduce(function(comps, comp) {
          var type = typeof comp;
          if (type === "string" || type === "number") {
            comps = comps.concat((comp + "").split(""));
          } else {
            comps.push(comp);
          }
          return comps;
        }, []);
      });
      readOptions.display = replacePlaceholder(
        readOptions.display + "",
        function(param) {
          return getPhContent(param, readOptions);
        }
      );
      return toBool(_readlineSync(readOptions), readOptions);
    };
    exports2.questionEMail = function(query, options) {
      if (query == null) {
        query = "Input e-mail address: ";
      }
      return exports2.question(query, margeOptions({
        // -------- default
        hideEchoBack: false,
        // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address
        limit: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        limitMessage: "Input valid e-mail address, please.",
        trueValue: null,
        falseValue: null
      }, options, {
        // -------- forced
        keepWhitespace: false,
        cd: false
      }));
    };
    exports2.questionNewPassword = function(query, options) {
      var resCharlist, min, max, readOptions = margeOptions({
        // -------- default
        hideEchoBack: true,
        mask: "*",
        limitMessage: "It can include: $<charlist>\nAnd the length must be: $<length>",
        trueValue: null,
        falseValue: null,
        caseSensitive: true
      }, options, {
        // -------- forced
        history: false,
        cd: false,
        // limit (by charlist etc.),
        phContent: function(param) {
          return param === "charlist" ? resCharlist.text : param === "length" ? min + "..." + max : null;
        }
      }), charlist, confirmMessage, unmatchMessage, limit, limitMessage, res1, res2;
      options = options || {};
      charlist = replacePlaceholder(
        options.charlist ? options.charlist + "" : "$<!-~>",
        getPhCharlist
      );
      if (isNaN(min = parseInt(options.min, 10)) || typeof min !== "number") {
        min = 12;
      }
      if (isNaN(max = parseInt(options.max, 10)) || typeof max !== "number") {
        max = 24;
      }
      limit = new RegExp("^[" + escapePattern(charlist) + "]{" + min + "," + max + "}$");
      resCharlist = array2charlist([charlist], readOptions.caseSensitive, true);
      resCharlist.text = joinChunks(resCharlist.values, resCharlist.suppressed);
      confirmMessage = options.confirmMessage != null ? options.confirmMessage : "Reinput a same one to confirm it: ";
      unmatchMessage = options.unmatchMessage != null ? options.unmatchMessage : "It differs from first one. Hit only the Enter key if you want to retry from first one.";
      if (query == null) {
        query = "Input new password: ";
      }
      limitMessage = readOptions.limitMessage;
      while (!res2) {
        readOptions.limit = limit;
        readOptions.limitMessage = limitMessage;
        res1 = exports2.question(query, readOptions);
        readOptions.limit = [res1, ""];
        readOptions.limitMessage = unmatchMessage;
        res2 = exports2.question(confirmMessage, readOptions);
      }
      return res1;
    };
    function _questionNum(query, options, parser) {
      var validValue;
      function getValidValue(value) {
        validValue = parser(value);
        return !isNaN(validValue) && typeof validValue === "number";
      }
      exports2.question(query, margeOptions({
        // -------- default
        limitMessage: "Input valid number, please."
      }, options, {
        // -------- forced
        limit: getValidValue,
        cd: false
        // trueValue, falseValue, caseSensitive, keepWhitespace don't work.
      }));
      return validValue;
    }
    exports2.questionInt = function(query, options) {
      return _questionNum(query, options, function(value) {
        return parseInt(value, 10);
      });
    };
    exports2.questionFloat = function(query, options) {
      return _questionNum(query, options, parseFloat);
    };
    exports2.questionPath = function(query, options) {
      var error = "", validPath, readOptions = margeOptions({
        // -------- default
        hideEchoBack: false,
        limitMessage: "$<error(\n)>Input valid path, please.$<( Min:)min>$<( Max:)max>",
        history: true,
        cd: true
      }, options, {
        // -------- forced
        keepWhitespace: false,
        limit: function(value) {
          var exists, stat, res;
          value = replaceHomePath(value, true);
          error = "";
          function mkdirParents(dirPath) {
            dirPath.split(/\/|\\/).reduce(function(parents, dir) {
              var path = pathUtil.resolve(parents += dir + pathUtil.sep);
              if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
              } else if (!fs.statSync(path).isDirectory()) {
                throw new Error("Non directory already exists: " + path);
              }
              return parents;
            }, "");
          }
          try {
            exists = fs.existsSync(value);
            validPath = exists ? fs.realpathSync(value) : pathUtil.resolve(value);
            if (!options.hasOwnProperty("exists") && !exists || typeof options.exists === "boolean" && options.exists !== exists) {
              error = (exists ? "Already exists" : "No such file or directory") + ": " + validPath;
              return false;
            }
            if (!exists && options.create) {
              if (options.isDirectory) {
                mkdirParents(validPath);
              } else {
                mkdirParents(pathUtil.dirname(validPath));
                fs.closeSync(fs.openSync(validPath, "w"));
              }
              validPath = fs.realpathSync(validPath);
            }
            if (exists && (options.min || options.max || options.isFile || options.isDirectory)) {
              stat = fs.statSync(validPath);
              if (options.isFile && !stat.isFile()) {
                error = "Not file: " + validPath;
                return false;
              } else if (options.isDirectory && !stat.isDirectory()) {
                error = "Not directory: " + validPath;
                return false;
              } else if (options.min && stat.size < +options.min || options.max && stat.size > +options.max) {
                error = "Size " + stat.size + " is out of range: " + validPath;
                return false;
              }
            }
            if (typeof options.validate === "function" && (res = options.validate(validPath)) !== true) {
              if (typeof res === "string") {
                error = res;
              }
              return false;
            }
          } catch (e) {
            error = e + "";
            return false;
          }
          return true;
        },
        // trueValue, falseValue, caseSensitive don't work.
        phContent: function(param) {
          return param === "error" ? error : param !== "min" && param !== "max" ? null : options.hasOwnProperty(param) ? options[param] + "" : "";
        }
      });
      options = options || {};
      if (query == null) {
        query = 'Input path (you can "cd" and "pwd"): ';
      }
      exports2.question(query, readOptions);
      return validPath;
    };
    function getClHandler(commandHandler, options) {
      var clHandler = {}, hIndex = {};
      if (typeof commandHandler === "object") {
        Object.keys(commandHandler).forEach(function(cmd) {
          if (typeof commandHandler[cmd] === "function") {
            hIndex[options.caseSensitive ? cmd : cmd.toLowerCase()] = commandHandler[cmd];
          }
        });
        clHandler.preCheck = function(res) {
          var cmdKey;
          clHandler.args = parseCl(res);
          cmdKey = clHandler.args[0] || "";
          if (!options.caseSensitive) {
            cmdKey = cmdKey.toLowerCase();
          }
          clHandler.hRes = cmdKey !== "_" && hIndex.hasOwnProperty(cmdKey) ? hIndex[cmdKey].apply(res, clHandler.args.slice(1)) : hIndex.hasOwnProperty("_") ? hIndex._.apply(res, clHandler.args) : null;
          return { res, forceNext: false };
        };
        if (!hIndex.hasOwnProperty("_")) {
          clHandler.limit = function() {
            var cmdKey = clHandler.args[0] || "";
            if (!options.caseSensitive) {
              cmdKey = cmdKey.toLowerCase();
            }
            return hIndex.hasOwnProperty(cmdKey);
          };
        }
      } else {
        clHandler.preCheck = function(res) {
          clHandler.args = parseCl(res);
          clHandler.hRes = typeof commandHandler === "function" ? commandHandler.apply(res, clHandler.args) : true;
          return { res, forceNext: false };
        };
      }
      return clHandler;
    }
    exports2.promptCL = function(commandHandler, options) {
      var readOptions = margeOptions({
        // -------- default
        hideEchoBack: false,
        limitMessage: "Requested command is not available.",
        caseSensitive: false,
        history: true
      }, options), clHandler = getClHandler(commandHandler, readOptions);
      readOptions.limit = clHandler.limit;
      readOptions.preCheck = clHandler.preCheck;
      exports2.prompt(readOptions);
      return clHandler.args;
    };
    exports2.promptLoop = function(inputHandler, options) {
      var readOptions = margeOptions({
        // -------- default
        hideEchoBack: false,
        trueValue: null,
        falseValue: null,
        caseSensitive: false,
        history: true
      }, options);
      while (true) {
        if (inputHandler(exports2.prompt(readOptions))) {
          break;
        }
      }
    };
    exports2.promptCLLoop = function(commandHandler, options) {
      var readOptions = margeOptions({
        // -------- default
        hideEchoBack: false,
        limitMessage: "Requested command is not available.",
        caseSensitive: false,
        history: true
      }, options), clHandler = getClHandler(commandHandler, readOptions);
      readOptions.limit = clHandler.limit;
      readOptions.preCheck = clHandler.preCheck;
      while (true) {
        exports2.prompt(readOptions);
        if (clHandler.hRes) {
          break;
        }
      }
    };
    exports2.promptSimShell = function(options) {
      return exports2.prompt(margeOptions({
        // -------- default
        hideEchoBack: false,
        history: true
      }, options, {
        // -------- forced
        prompt: (function() {
          return IS_WIN ? "$<cwd>>" : (
            // 'user@host:cwd$ '
            (process.env.USER || "") + (process.env.HOSTNAME ? "@" + process.env.HOSTNAME.replace(/\..*$/, "") : "") + ":$<cwdHome>$ "
          );
        })()
      }));
    };
    function _keyInYN(query, options, limit) {
      var res;
      if (query == null) {
        query = "Are you sure? ";
      }
      if ((!options || options.guide !== false) && (query += "")) {
        query = query.replace(/\s*:?\s*$/, "") + " [y/n]: ";
      }
      res = exports2.keyIn(query, margeOptions(options, {
        // -------- forced
        hideEchoBack: false,
        limit,
        trueValue: "y",
        falseValue: "n",
        caseSensitive: false
        // mask doesn't work.
      }));
      return typeof res === "boolean" ? res : "";
    }
    exports2.keyInYN = function(query, options) {
      return _keyInYN(query, options);
    };
    exports2.keyInYNStrict = function(query, options) {
      return _keyInYN(query, options, "yn");
    };
    exports2.keyInPause = function(query, options) {
      if (query == null) {
        query = "Continue...";
      }
      if ((!options || options.guide !== false) && (query += "")) {
        query = query.replace(/\s+$/, "") + " (Hit any key)";
      }
      exports2.keyIn(query, margeOptions({
        // -------- default
        limit: null
      }, options, {
        // -------- forced
        hideEchoBack: true,
        mask: ""
      }));
    };
    exports2.keyInSelect = function(items, query, options) {
      var readOptions = margeOptions({
        // -------- default
        hideEchoBack: false
      }, options, {
        // -------- forced
        trueValue: null,
        falseValue: null,
        caseSensitive: false,
        // limit (by items),
        phContent: function(param) {
          return param === "itemsCount" ? items.length + "" : param === "firstItem" ? (items[0] + "").trim() : param === "lastItem" ? (items[items.length - 1] + "").trim() : null;
        }
      }), keylist = "", key2i = {}, charCode = 49, display = "\n";
      if (!Array.isArray(items) || !items.length || items.length > 35) {
        throw "`items` must be Array (max length: 35).";
      }
      items.forEach(function(item, i) {
        var key = String.fromCharCode(charCode);
        keylist += key;
        key2i[key] = i;
        display += "[" + key + "] " + (item + "").trim() + "\n";
        charCode = charCode === 57 ? 97 : charCode + 1;
      });
      if (!options || options.cancel !== false) {
        keylist += "0";
        key2i["0"] = -1;
        display += "[0] " + (options && options.cancel != null && typeof options.cancel !== "boolean" ? (options.cancel + "").trim() : "CANCEL") + "\n";
      }
      readOptions.limit = keylist;
      display += "\n";
      if (query == null) {
        query = "Choose one from list: ";
      }
      if (query += "") {
        if (!options || options.guide !== false) {
          query = query.replace(/\s*:?\s*$/, "") + " [$<limit>]: ";
        }
        display += query;
      }
      return key2i[exports2.keyIn(display, readOptions).toLowerCase()];
    };
    exports2.getRawInput = function() {
      return rawInput;
    };
    function _setOption(optionName, args) {
      var options;
      if (args.length) {
        options = {};
        options[optionName] = args[0];
      }
      return exports2.setDefaultOptions(options)[optionName];
    }
    exports2.setPrint = function() {
      return _setOption("print", arguments);
    };
    exports2.setPrompt = function() {
      return _setOption("prompt", arguments);
    };
    exports2.setEncoding = function() {
      return _setOption("encoding", arguments);
    };
    exports2.setMask = function() {
      return _setOption("mask", arguments);
    };
    exports2.setBufferSize = function() {
      return _setOption("bufferSize", arguments);
    };
  }
});

// game.js
var import_readline_sync = __toESM(require_readline_sync(), 1);

// ships.js
var Ship = class {
  constructor(size, icon, x, y, direction, name) {
    this.size = size;
    this.icon = icon;
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.damage = 0;
    this.name = name;
  }
  changeLocation(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
  changeDirection(newDirection) {
    this.direction = newDirection;
  }
  Hit() {
    this.damage++;
  }
  isSunk() {
    return this.damage == this.size;
  }
};
var Carrier = class extends Ship {
  constructor(x, y, direction) {
    super(5, process.platform == "linux" ? "\u{1F535}" : "A", x, y, direction, "carrier");
  }
};
var BattleShip = class extends Ship {
  constructor(x, y, direction) {
    super(4, process.platform == "linux" ? "\u{1F7E3}" : "B", x, y, direction, "battleship");
  }
};
var Destroyer = class extends Ship {
  constructor(x, y, direction) {
    super(3, process.platform == "linux" ? "\u{1F7E2}" : "C", x, y, direction, "destroyer");
  }
};
var Submarine = class extends Ship {
  constructor(x, y, direction) {
    super(3, process.platform == "linux" ? "\u{1F7E1}" : "D", x, y, direction, "submarine");
  }
};
var PatrolBoat = class extends Ship {
  constructor(x, y, direction) {
    super(2, process.platform == "linux" ? "\u{1F7E0}" : "E", x, y, direction, "patrolboat");
  }
};

// board.js
var Cell = class {
  constructor() {
    this.icon = "-";
    this.struct = false;
    this.ship = null;
  }
  isEmpty() {
    return this.icon == "-";
  }
  changeIcon(icon) {
    this.icon = icon;
  }
  isSunk() {
    return this.ship == null ? false : this.ship.isSunk();
  }
  name() {
    return this.ship == null ? "" : this.ship.name;
  }
  remove() {
    this.icon = "-";
    this.struct = false;
    this.ship = null;
  }
  setShip(ship) {
    this.ship = ship;
  }
  showIcon(revealMe, bId) {
    return this.isHit() && this.isSunk() && bId == 0 || revealMe || !this.isHit() && bId == 1;
  }
  showX(bId) {
    return this.isHit() && !this.isSunk() && bId == 0 || this.isHit() && bId == 1;
  }
  strike() {
    this.struct = true;
    if (!this.isEmpty()) {
      this.ship.Hit();
    }
  }
  isHit() {
    return this.struct;
  }
  printCell(revealIt, bId) {
    return this.isEmpty() && !this.isHit() ? "-" : this.isEmpty() ? "\u2757" : this.showIcon(revealIt, bId) ? this.icon : this.showX(bId) ? "\u274C" : "-";
  }
};
var Board = class {
  constructor(size, id) {
    this.size = size;
    this.id = id;
    this.contents = Array.from({ length: size }, () => new Array(size));
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        this.contents[y][x] = new Cell();
      }
    }
    this.id = id;
    this.hits = 0;
    this.neededHits = 0;
  }
  isHit(x, y) {
    return this.contents[y][x].isHit();
  }
  isSunk(x, y) {
    return this.contents[y][x].isSunk();
  }
  canPlace(myShip) {
    if (myShip.x == 45 && myShip.y == 45) {
      return false;
    }
    if (myShip.x > 9 || myShip.y > 9) {
      console.log("Invalid Input");
      return false;
    } else if (myShip.x + (myShip.direction == 0 ? myShip.size - 1 : 0) > this.size - 1 || myShip.y + (myShip.direction == 1 ? myShip.size - 1 : 0) > this.size - 1) {
      if (this.id == 1) {
        console.log(`Your ${myShip.name} can't go there`);
      }
      return false;
    }
    for (let i = 0; i < myShip.size; i++) {
      if (!this.contents[myShip.y + i * (myShip.direction == 1 ? 1 : 0)][myShip.x + i * (myShip.direction == 0 ? 1 : 0)].isEmpty()) {
        if (this.id == 1) {
          console.log("That area is occupied");
        }
        return false;
      }
    }
    return true;
  }
  place(myShip) {
    for (let i = 0; i < myShip.size; i++) {
      this.contents[myShip.y + i * (myShip.direction == 1 ? 1 : 0)][myShip.x + i * (myShip.direction == 0 ? 1 : 0)].changeIcon(myShip.icon);
      this.contents[myShip.y + i * (myShip.direction == 1 ? 1 : 0)][myShip.x + i * (myShip.direction == 0 ? 1 : 0)].setShip(myShip);
    }
    this.neededHits = this.neededHits + myShip.size;
  }
  remove(myShip) {
    for (let i = 0; i < myShip.size; i++) {
      this.contents[myShip.y + i * (myShip.direction == 1 ? 1 : 0)][myShip.x + i * (myShip.direction == 0 ? 1 : 0)].remove();
    }
    this.neededHits = this.neededHits - myShip.size;
  }
  showRow(row, reveala) {
    let temp = [];
    for (let i = 0; i < this.size; i++) {
      temp.push(this.contents[row][i].printCell(reveala, this.id));
    }
    return temp;
  }
  printBoard(revealZ) {
    let temp = {};
    for (let i = 0; i < this.size; i++) {
      temp[String.fromCharCode(65 + i)] = this.showRow(i, revealZ);
    }
    return temp;
  }
  isValidGuess(x, y) {
    if (x == 45 && y == 45) {
      return false;
    } else if (x < 0 || x > this.size - 1 || y < 0 || y > this.size) {
      console.log("Sorry but that is not a valid input");
      return false;
    } else if (this.contents[y][x].isHit()) {
      if (this.id == 0) {
        console.log("You already picked there");
      }
      return false;
    } else {
      return true;
    }
  }
  guess(x, y) {
    this.contents[y][x].strike();
    if (!this.contents[y][x].isEmpty()) {
      this.hits++;
    }
    let sunkLiteral = ` and sunk ${this.id == 0 ? "my " : "your "}${this.contents[y][x].name()}`;
    console.log(`${this.id == 0 ? "You" : "I"} ${this.contents[y][x].isEmpty() ? "missed" : "hit"}${this.contents[y][x].isSunk() ? sunkLiteral : "."}`);
  }
  gameWon() {
    let revealMe = this.hits == this.neededHits;
    {
      return revealMe;
    }
  }
};

// game.js
var reveal = false;
var guessX = 45;
var guessY = 45;
var shipType = 7;
var guess = [];
var answer = "P";
var firstPrompt = "";
var secondPrompt = "";
var lastSuccessX = 45;
var lastSuccessY = 45;
var created = [false, false, false, false, false];
var placed = [false, false, false, false, false];
var myShips = [null, null, null, null, null, null];
var shipClasses = [Carrier, BattleShip, Destroyer, Submarine, PatrolBoat];
var myregEx1 = /^([A-Z])([0,1,2,3,4,5,6,7,8,9])$/;
var myregEx2 = /^([A-Z])([0,1,2,3,4,5,6,7,8,9]),([0,1])$/;
var myregEx3 = /^([0,1,2,3,4])$/;
var myregEx4 = /^([y,n])$/i;
var bsize = 10;
function placeShip(ShipClass) {
  let ship = new ShipClass(Math.floor(Math.random() * bsize), Math.floor(Math.random() * bsize), Math.floor(Math.random() * 2));
  while (!gameBoard.canPlace(ship)) {
    ship.changeLocation(Math.floor(Math.random() * bsize), Math.floor(Math.random() * bsize));
    ship.changeDirection(Math.floor(Math.random() * 2));
  }
  gameBoard.place(ship);
}
function createShip(ShipClass, i) {
  let ship = new ShipClass(45, 45, 0);
  created[i] = true;
  return ship;
}
console.clear();
var gameBoard = new Board(bsize, 0);
shipClasses.forEach(placeShip);
var playerBoard = new Board(bsize, 1);
while (!placed.every((x) => x)) {
  shipType = 7;
  firstPrompt = "";
  console.clear();
  console.log("Welcome to Battleship");
  console.log("Place your ships");
  console.table(playerBoard.printBoard(true));
  while (shipType > 4 && firstPrompt.trim().length == 0) {
    firstPrompt = import_readline_sync.default.question("Pick  a ship type to place 0=Carrier 1=Battleship 2=Destroyer 3=Submarine 4=PatrolBoat").toUpperCase();
    if (!myregEx3.test(firstPrompt)) {
      console.log("Invalid entry");
      shipType = 7;
      firstPrompt = "";
    } else {
      shipType = Number(firstPrompt);
    }
  }
  if (!created[shipType]) {
    myShips[shipType] = createShip(shipClasses[shipType], shipType);
  }
  if (placed[shipType]) {
    answer = "P";
    firstPrompt = "";
    while (answer == "P" && firstPrompt.trim().length == 0) {
      firstPrompt = import_readline_sync.default.question("You already placed that do you want to change it Y or N?").toUpperCase();
      if (!myregEx4.test(firstPrompt)) {
        answer = "P";
        firstPrompt = "";
      } else {
        answer = firstPrompt;
      }
    }
    if (answer == "Y") {
      placed[shipType] = false;
      playerBoard.remove(myShips[shipType]);
      myShips[shipType].changeLocation(45, 45);
      myShips[shipType].changeDirection(2);
    } else {
      shipType = 7;
      firstPrompt = "";
    }
  }
  if (shipType < 5) {
    while (!placed[shipType]) {
      firstPrompt = "";
      while (myShips[shipType].x > bsize && myShips[shipType].y > bsize && firstPrompt.trim().length == 0) {
        firstPrompt = import_readline_sync.default.question("Pick a location A0-J9 and direction 0 horizontal 1 vertical (A3,1 C3,0)").toUpperCase();
        if (!myregEx2.test(firstPrompt)) {
          myShips[shipType].changeLocation(43, 43);
        } else {
          guess = firstPrompt.split("");
          myShips[shipType].changeLocation(Number(guess[1]), guess[0].charCodeAt(0) - 65);
          myShips[shipType].changeDirection(Number(guess[3]));
        }
        if (!playerBoard.canPlace(myShips[shipType])) {
          myShips[shipType].changeLocation(45, 45);
          firstPrompt = "";
        }
      }
      playerBoard.place(myShips[shipType]);
      placed[shipType] = true;
    }
  }
}
console.clear();
console.log("Your Board");
console.table(playerBoard.printBoard(true));
import_readline_sync.default.question("Hit Enter to continue");
while (!reveal) {
  console.clear();
  console.log("Computer's Board");
  console.table(gameBoard.printBoard(reveal));
  guessX = 45;
  guessY = 45;
  while (!gameBoard.isValidGuess(guessX, guessY) && secondPrompt.trim().length == 0) {
    secondPrompt = import_readline_sync.default.question(`Make a guess eg.. A1, B2, etc... `).toUpperCase();
    if (myregEx1.test(secondPrompt)) {
      guess = secondPrompt.split("");
      guessY = guess[0].charCodeAt(0) - 65;
      guessX = Number(guess[1]);
    } else {
      guessX = 43;
      guessY = 43;
    }
    if (!gameBoard.isValidGuess(guessX, guessY)) {
      guessX = 45;
      guessY = 45;
      secondPrompt = "";
    }
  }
  gameBoard.guess(guessX, guessY);
  reveal = gameBoard.gameWon();
  guessX = 45;
  guessY = 45;
  secondPrompt = "";
  import_readline_sync.default.question("Hit Enter to continue");
  if (!reveal) {
    console.clear();
    console.log("Your Board");
    console.table(playerBoard.printBoard(reveal));
    if (lastSuccessX == 45 && lastSuccessY == 45) {
      guessX = Math.floor(Math.random() * bsize);
      guessY = Math.floor(Math.random() * bsize);
      while (!playerBoard.isValidGuess(guessX, guessY)) {
        guessX = Math.floor(Math.random() * bsize);
        guessY = Math.floor(Math.random() * bsize);
      }
    } else {
      guessX = Math.floor(Math.random() * 6) + lastSuccessX - 3;
      guessX = Math.max(0, Math.min(9, guessX));
      guessY = Math.floor(Math.random() * 6) + lastSuccessY - 3;
      guessY = Math.max(0, Math.min(9, guessY));
      while (!playerBoard.isValidGuess(guessX, guessY)) {
        guessX = Math.floor(Math.random() * 6) + lastSuccessX - 3;
        guessX = Math.max(0, Math.min(9, guessX));
        guessY = Math.floor(Math.random() * 6) + lastSuccessY - 3;
        guessY = Math.max(0, Math.min(9, guessY));
      }
    }
    playerBoard.guess(guessX, guessY);
    if (playerBoard.isHit(guessX, guessY)) {
      lastSuccessX = guessX;
      lastSuccessY = guessY;
    }
    if (playerBoard.isSunk(guessX, guessY)) {
      lastSuccessX = 45;
      lastSuccessY = 45;
    }
    reveal = playerBoard.gameWon();
    import_readline_sync.default.question("Hit Enter to continue");
  }
}
console.clear();
console.log("Computer Board");
console.table(gameBoard.printBoard(reveal));
console.log("Your Board");
console.table(playerBoard.printBoard(true));
if (gameBoard.gameWon()) {
  console.log(`
========
__   _______ _   _   _    _ _____ _   _
\\ \\ / /  _  | | | | | |  | |_   _| \\ | |
 \\ V /| | | | | | | | |  | | | | |  \\| |
  \\ / | | | | | | | | |/\\| | | | | . ' |
  | | \\ \\_/ / |_| | \\  /\\  /_| |_| |\\  |
  \\_/  \\___/ \\___/   \\/  \\/ \\___/\\_| \\_/
========
`);
} else {
  console.log(`
  ========
__   _______ _   _   _    _____  _____  _____ 
\\ \\ / /  _  | | | | | |  /  _  || ____||_   _| 
 \\ V /| | | | | | | | |  | | | || |___   | |   
  \\ / | | | | | | | | |  | | | ||____ |  | |  
  | | \\ \\_/ / |_| | | |__\\ \\_/ / ___| |  | |
  \\_/  \\___/ \\___/  \\____|\\___/ |_____|  |_|
========
    `);
}
