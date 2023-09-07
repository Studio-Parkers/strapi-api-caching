"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes"));
const middlewares_1 = __importDefault(require("./middlewares"));
const controllers_1 = __importDefault(require("./controllers"));
const services_1 = __importDefault(require("./services"));
exports.default = {
    controllers: controllers_1.default,
    routes: routes_1.default,
    services: services_1.default,
    middlewares: middlewares_1.default
};
