"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _middlewares = _interopRequireDefault(require("../../middlewares"));
var route = (0, _express.Router)();
var _default = function _default(app) {
  app.use("/payme", route);
  route.use(_bodyParser["default"].json());
  route.use(_middlewares["default"].jsonrpc);
  route.post("/merchant",
  // middlewares.auth,
  _middlewares["default"].wrap(require("./merchant")["default"]));
  route.options("/pay", (0, _cors["default"])({
    origin: ["http://localhost:8000"],
    credentials: true
  }));
  route.post("/pay", (0, _cors["default"])({
    origin: ["http://localhost:8000"],
    credentials: true
  }), _middlewares["default"].wrap(require("./pay")["default"]));
  return app;
};
exports["default"] = _default;