"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WatchFilterPlugin = /** @class */ (function () {
    function WatchFilterPlugin(filter, debug) {
        this.filter = filter;
        this.debug = debug;
    }
    WatchFilterPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.afterEnvironment.tap("WatchFilterPlugin", function () {
            compiler.watchFileSystem = new IgnoringWatchFileSystem(compiler.watchFileSystem, _this.filter, _this.debug);
        });
    };
    return WatchFilterPlugin;
}());
exports.WatchFilterPlugin = WatchFilterPlugin;
var IgnoringWatchFileSystem = /** @class */ (function () {
    function IgnoringWatchFileSystem(wfs, filter, debug) {
        this.wfs = wfs;
        this.filter = filter;
        this.debug = debug;
    }
    IgnoringWatchFileSystem.prototype.watch = function (files, dirs, missing, startTime, options, callback, callbackUndelayed) {
        var includedFiles = [];
        var includedDirs = [];
        var excludedFiles = [];
        var excludedDirs = [];
        separate(this.filter, files, includedFiles, excludedFiles);
        separate(this.filter, dirs, includedDirs, excludedDirs);
        if (this.debug.enabled) {
            this.debug("files:" + stringifyList(files) + "\ndirs:" + stringifyList(dirs) + "\nmissing:" + stringifyList(missing));
            this.debug("includedFiles:" + stringifyList(includedFiles) + "\nincludedDirs:" + stringifyList(includedDirs) + "\nexcludedFiles:" + stringifyList(excludedFiles) + "\nexcludedDirs:" + stringifyList(excludedDirs));
        }
        return this.wfs.watch(includedFiles, includedDirs, missing, startTime, options, function (error, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps) {
            if (error != null) {
                callback(error);
                return;
            }
            for (var _i = 0, excludedFiles_1 = excludedFiles; _i < excludedFiles_1.length; _i++) {
                var p = excludedFiles_1[_i];
                fileTimestamps[p] = 1;
            }
            for (var _a = 0, excludedDirs_1 = excludedDirs; _a < excludedDirs_1.length; _a++) {
                var p = excludedDirs_1[_a];
                dirTimestamps[p] = 1;
            }
            callback(null, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps);
        }, callbackUndelayed);
    };
    return IgnoringWatchFileSystem;
}());
function separate(filter, list, included, excluded) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var file = list_1[_i];
        (filter(file) ? included : excluded).push(file);
    }
}
function stringifyList(list) {
    return "\n  " + list.map(function (it) { return it.startsWith(process.cwd()) ? it.substring(process.cwd().length + 1) : it; }).join(",\n  ");
}
//# sourceMappingURL=WebpackMatchPlugin.js.map