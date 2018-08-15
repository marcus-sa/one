"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("@nuclei/electron");
const electron_2 = require("electron");
const core_1 = require("@nuclei/core");
let MainWindow = class MainWindow {
    onReady() { }
};
__decorate([
    core_1.Inject(electron_1.WindowRef),
    __metadata("design:type", electron_2.BrowserWindow)
], MainWindow.prototype, "windowRef", void 0);
MainWindow = __decorate([
    electron_1.Window()
], MainWindow);
exports.MainWindow = MainWindow;
//# sourceMappingURL=main.window.js.map