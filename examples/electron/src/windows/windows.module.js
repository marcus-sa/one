"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@nuclei/core");
var electron_1 = require("@nuclei/electron");
var main_window_1 = require("./main.window");
var WindowsModule = /** @class */ (function () {
    function WindowsModule() {
    }
    WindowsModule = __decorate([
        core_1.Module({
            imports: [
                electron_1.ElectronModule.forFeature([
                    main_window_1.MainWindow,
                ]),
            ]
        })
    ], WindowsModule);
    return WindowsModule;
}());
exports.WindowsModule = WindowsModule;
