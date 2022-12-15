"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = function _default(req, res, next) {
  var id = req.body.id;
  res.jsonrpc = function sendJsonRpcResponse(error, result) {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });
    res.end(JSON.stringify({
      jsonrpc: "2.0",
      id: id,
      error: error,
      result: result
    }));
  };
  next();
};
exports["default"] = _default;