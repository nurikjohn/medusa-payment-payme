"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _errors = _interopRequireDefault(require("../../constants/errors"));
var _default = function _default(req, res, next) {
  var paymeProviderService = req.scope.resolve("paymeProviderService");
  var auth = req.headers["authorization"];
  if (!auth) return res.jsonrpc(_errors["default"].AccessDenied);
  var _auth$trim$split = auth.trim().split(/ +/),
    _auth$trim$split2 = (0, _slicedToArray2["default"])(_auth$trim$split, 2),
    authMethod = _auth$trim$split2[0],
    token = _auth$trim$split2[1];
  if (authMethod !== "Basic" || !token) return res.jsonrpc(_errors["default"].AccessDenied);
  var decodedToken = Buffer.from(token, "base64").toString("utf-8");
  var _decodedToken$trim$sp = decodedToken.trim().split(/ *: */),
    _decodedToken$trim$sp2 = (0, _slicedToArray2["default"])(_decodedToken$trim$sp, 2),
    login = _decodedToken$trim$sp2[0],
    password = _decodedToken$trim$sp2[1];
  if (!paymeProviderService.authProtect(login, password)) return res.jsonrpc(_errors["default"].AccessDenied);
  next();
};
exports["default"] = _default;