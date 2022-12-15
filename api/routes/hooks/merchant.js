"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _errors = _interopRequireDefault(require("../../../constants/errors"));
var _medusa = require("@medusajs/medusa");
var _paymeProvider = _interopRequireDefault(require("../../../services/payme-provider"));
var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body, method, params, cartService, orderService, manager, _cart$payment_session, cart_id, cart, _cart_id, _cart, _cart$metadata, _cart$metadata2, create_time, _yield$cartService$li, payme_transaction_id, _cart2, _cart_id2, _create_time, _yield$cartService$li2, _payme_transaction_id, _cart3, _create_time2, _yield$cartService$li3, _payme_transaction_id2, _cart4, _cart4$payment_sessio, _cart4$payment_sessio2, _cart4$payment_sessio3;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, method = _req$body.method, params = _req$body.params;
            cartService = req.scope.resolve("cartService");
            orderService = req.scope.resolve("orderService");
            manager = req.scope.resolve("manager");
            _context2.t0 = method;
            _context2.next = _context2.t0 === "CheckPerformTransaction" ? 7 : _context2.t0 === "CreateTransaction" ? 25 : _context2.t0 === "PerformTransaction" ? 54 : _context2.t0 === "CheckTransaction" ? 101 : _context2.t0 === "CancelTransaction" ? 127 : 160;
            break;
          case 7:
            cart_id = params.account.cart_id;
            cart = null;
            _context2.prev = 9;
            _context2.next = 12;
            return cartService.retrieveWithTotals(cart_id, {
              relations: ["payment_sessions"]
            });
          case 12:
            cart = _context2.sent;
            _context2.next = 18;
            break;
          case 15:
            _context2.prev = 15;
            _context2.t1 = _context2["catch"](9);
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 18:
            if (cart) {
              _context2.next = 20;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 20:
            if (!(((_cart$payment_session = cart.payment_session) === null || _cart$payment_session === void 0 ? void 0 : _cart$payment_session.status) == _medusa.PaymentSessionStatus.AUTHORIZED)) {
              _context2.next = 22;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].UnexpectedTransactionState));
          case 22:
            if (!(cart.total * 100 != params.amount)) {
              _context2.next = 24;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].IncorrectAmount));
          case 24:
            return _context2.abrupt("return", res.jsonrpc(null, {
              allow: true
            }));
          case 25:
            _cart_id = params.account.cart_id;
            _cart = null;
            _context2.prev = 27;
            _context2.next = 30;
            return cartService.retrieveWithTotals(_cart_id, {
              relations: ["payment_sessions"]
            });
          case 30:
            _cart = _context2.sent;
            _context2.next = 36;
            break;
          case 33:
            _context2.prev = 33;
            _context2.t2 = _context2["catch"](27);
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 36:
            if (_cart) {
              _context2.next = 38;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 38:
            if (!(_cart.total * 100 != params.amount)) {
              _context2.next = 40;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].IncorrectAmount));
          case 40:
            if (!(_cart.payment_session.status == "pending")) {
              _context2.next = 53;
              break;
            }
            create_time = new Date(_cart.payment_session.created_at).getTime();
            if (!(create_time > params.time)) {
              _context2.next = 46;
              break;
            }
            _context2.next = 45;
            return cartService.refreshPaymentSession(_cart_id, _paymeProvider["default"].identifier);
          case 45:
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].UnexpectedTransactionState));
          case 46:
            if (!((_cart$metadata = _cart.metadata) !== null && _cart$metadata !== void 0 && _cart$metadata.payme_transaction_id && params.id != ((_cart$metadata2 = _cart.metadata) === null || _cart$metadata2 === void 0 ? void 0 : _cart$metadata2.payme_transaction_id))) {
              _context2.next = 48;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].IncorrectTransaction));
          case 48:
            _context2.next = 50;
            return cartService.setMetadata(_cart_id, "payme_transaction_id", params.id);
          case 50:
            return _context2.abrupt("return", res.jsonrpc(null, {
              transaction: _cart.payment_session.id,
              create_time: create_time,
              state: 1
            }));
          case 53:
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].UnexpectedTransactionState));
          case 54:
            payme_transaction_id = params.id;
            _context2.next = 57;
            return cartService.list({
              metadata: JSON.stringify({
                payme_transaction_id: payme_transaction_id
              })
            });
          case 57:
            _context2.t4 = _yield$cartService$li = _context2.sent;
            _context2.t3 = _context2.t4 === null;
            if (_context2.t3) {
              _context2.next = 61;
              break;
            }
            _context2.t3 = _yield$cartService$li === void 0;
          case 61:
            if (!_context2.t3) {
              _context2.next = 65;
              break;
            }
            _context2.t5 = void 0;
            _context2.next = 66;
            break;
          case 65:
            _context2.t5 = _yield$cartService$li[0];
          case 66:
            _cart2 = _context2.t5;
            if (_cart2) {
              _context2.next = 69;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 69:
            _cart_id2 = _cart2.id;
            _context2.prev = 70;
            _context2.next = 73;
            return cartService.retrieveWithTotals(_cart_id2, {
              relations: ["payment_sessions"]
            });
          case 73:
            _cart2 = _context2.sent;
            _context2.next = 79;
            break;
          case 76:
            _context2.prev = 76;
            _context2.t6 = _context2["catch"](70);
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 79:
            if (!(_cart2.payment_session.status == _medusa.PaymentSessionStatus.PENDING)) {
              _context2.next = 96;
              break;
            }
            _create_time = new Date(_cart2.payment_session.created_at).getTime();
            if (!(_create_time > params.time)) {
              _context2.next = 85;
              break;
            }
            _context2.next = 84;
            return cartService.refreshPaymentSession(_cart_id2, _paymeProvider["default"].identifier);
          case 84:
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].UnexpectedTransactionState));
          case 85:
            res.jsonrpc(null, {
              perform_time: new Date().getTime(),
              transaction: _cart2.payment_session.id,
              state: 2
            });
            _context2.prev = 86;
            _context2.next = 89;
            return manager.transaction( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(manager) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return cartService.withTransaction(manager).setPaymentSession(_cart_id2, _paymeProvider["default"].identifier);
                      case 2:
                        _context.next = 4;
                        return cartService.withTransaction(manager).authorizePayment(_cart_id2);
                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());
          case 89:
            _context2.next = 94;
            break;
          case 91:
            _context2.prev = 91;
            _context2.t7 = _context2["catch"](86);
            console.log("ERROR: [AUTHORIZE PAYMENT] ", _context2.t7);
          case 94:
            _context2.next = 101;
            break;
          case 96:
            if (!(_cart2.payment_session.status == _medusa.PaymentSessionStatus.AUTHORIZED)) {
              _context2.next = 100;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(null, {
              perform_time: new Date(_cart2.payment_authorized_at).getTime(),
              transaction: _cart2.payment_session.id,
              state: 2
            }));
          case 100:
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CanNotPerformTransaction));
          case 101:
            _payme_transaction_id = params.id;
            _context2.next = 104;
            return cartService.list({
              metadata: JSON.stringify({
                payme_transaction_id: _payme_transaction_id
              })
            });
          case 104:
            _context2.t9 = _yield$cartService$li2 = _context2.sent;
            _context2.t8 = _context2.t9 === null;
            if (_context2.t8) {
              _context2.next = 108;
              break;
            }
            _context2.t8 = _yield$cartService$li2 === void 0;
          case 108:
            if (!_context2.t8) {
              _context2.next = 112;
              break;
            }
            _context2.t10 = void 0;
            _context2.next = 113;
            break;
          case 112:
            _context2.t10 = _yield$cartService$li2[0];
          case 113:
            _cart3 = _context2.t10;
            if (_cart3) {
              _context2.next = 116;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 116:
            _context2.prev = 116;
            _context2.next = 119;
            return cartService.retrieveWithTotals(_cart3.id, {
              relations: ["payment_sessions"]
            });
          case 119:
            _cart3 = _context2.sent;
            _context2.next = 125;
            break;
          case 122:
            _context2.prev = 122;
            _context2.t11 = _context2["catch"](116);
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 125:
            _create_time2 = new Date(_cart3.payment_session.created_at).getTime();
            return _context2.abrupt("return", res.jsonrpc(null, {
              perform_time: 0,
              cancel_time: 0,
              reason: null,
              transaction: _cart3.payment_session.id,
              create_time: _create_time2,
              state: 1
            }));
          case 127:
            _payme_transaction_id2 = params.id;
            _context2.next = 130;
            return cartService.list({
              metadata: JSON.stringify({
                payme_transaction_id: _payme_transaction_id2
              })
            });
          case 130:
            _context2.t13 = _yield$cartService$li3 = _context2.sent;
            _context2.t12 = _context2.t13 === null;
            if (_context2.t12) {
              _context2.next = 134;
              break;
            }
            _context2.t12 = _yield$cartService$li3 === void 0;
          case 134:
            if (!_context2.t12) {
              _context2.next = 138;
              break;
            }
            _context2.t14 = void 0;
            _context2.next = 139;
            break;
          case 138:
            _context2.t14 = _yield$cartService$li3[0];
          case 139:
            _cart4 = _context2.t14;
            if (_cart4) {
              _context2.next = 142;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 142:
            _context2.prev = 142;
            _context2.next = 145;
            return cartService.retrieveWithTotals(_cart4.id, {
              relations: ["payment_sessions"]
            });
          case 145:
            _cart4 = _context2.sent;
            _context2.next = 151;
            break;
          case 148:
            _context2.prev = 148;
            _context2.t15 = _context2["catch"](142);
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CartNotFound));
          case 151:
            if (!(_cart4.payment_session.status == _medusa.PaymentSessionStatus.PENDING)) {
              _context2.next = 155;
              break;
            }
            res.jsonrpc(null, {
              cencel_time: new Date().getTime(),
              transaction: _cart4.payment_session.id,
              state: -1
            });
            _context2.next = 160;
            break;
          case 155:
            if (!(_cart4.payment_session.status == _medusa.PaymentSessionStatus.AUTHORIZED)) {
              _context2.next = 159;
              break;
            }
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].CanNotCancel));
          case 159:
            res.jsonrpc(null, {
              cencel_time: (_cart4$payment_sessio = _cart4.payment_session) === null || _cart4$payment_sessio === void 0 ? void 0 : (_cart4$payment_sessio2 = _cart4$payment_sessio.data) === null || _cart4$payment_sessio2 === void 0 ? void 0 : _cart4$payment_sessio2.cancel_time,
              transaction: (_cart4$payment_sessio3 = _cart4.payment_session) === null || _cart4$payment_sessio3 === void 0 ? void 0 : _cart4$payment_sessio3.id,
              state: -1
            });
          case 160:
            return _context2.abrupt("return", res.jsonrpc(_errors["default"].TransportError));
          case 161:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[9, 15], [27, 33], [70, 76], [86, 91], [116, 122], [142, 148]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports["default"] = _default;