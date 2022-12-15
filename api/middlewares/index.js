"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _jsonRpc = _interopRequireDefault(require("./json-rpc"));
var _awaitMiddleware = _interopRequireDefault(require("./await-middleware"));
var _authMiddleware = _interopRequireDefault(require("./auth-middleware"));
var _default = {
  wrap: _awaitMiddleware["default"],
  jsonrpc: _jsonRpc["default"],
  auth: _authMiddleware["default"]
};
exports["default"] = _default;