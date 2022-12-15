"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _axios = _interopRequireDefault(require("axios"));
var _medusa = require("@medusajs/medusa");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var PaymeProviderService = /*#__PURE__*/function (_AbstractPaymentServi) {
  (0, _inherits2["default"])(PaymeProviderService, _AbstractPaymentServi);
  var _super = _createSuper(PaymeProviderService);
  function PaymeProviderService(_ref, options) {
    var _this;
    var customerService = _ref.customerService,
      totalsService = _ref.totalsService,
      regionService = _ref.regionService,
      cartService = _ref.cartService,
      manager = _ref.manager;
    (0, _classCallCheck2["default"])(this, PaymeProviderService);
    _this = _super.call(this, {
      customerService: customerService,
      totalsService: totalsService,
      regionService: regionService,
      cartService: cartService,
      manager: manager
    }, options);

    /**
     * Required Payme options:
     * url
     * merchantId
     * key
     */

    _this.options_ = {
      url: options.url,
      token: "".concat(options.merchantId, ":").concat(options.key),
      merchantId: options.merchantId,
      paycomPassword: options.key,
      paycomLogin: "Paycom"
    };

    /** @private @const {Payme} */
    _this.payme_ = _axios["default"].create({
      baseURL: "".concat(options.url, "/api"),
      headers: {
        "X-Auth": _this.options_.token
      }
    });
    _this.paymeMethods_ = {
      get: "receipts.get",
      create: "receipts.create",
      send: "receipts.send",
      check: "receipts.check",
      cancel: "receipts.cancel",
      pay: "receipts.pay"
    };
    _this.cartService_ = cartService;
    _this.manager_ = manager;
    return _this;
  }

  /**
   * Status for Payme receipt.
   * @param {Object} payment - payment method data from cart
   * @returns {string} the status of the Payme receipt
   */
  (0, _createClass2["default"])(PaymeProviderService, [{
    key: "getStatus",
    value: function () {
      var _getStatus = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(payment) {
        var receipt;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.retrievePayment(payment);
              case 2:
                receipt = _context.sent;
                _context.t0 = receipt.state;
                _context.next = _context.t0 === 0 ? 6 : _context.t0 === 4 ? 7 : _context.t0 === 30 ? 7 : _context.t0 === 5 ? 8 : _context.t0 === 6 ? 8 : _context.t0 === 20 ? 8 : _context.t0 === 21 ? 9 : _context.t0 === 50 ? 9 : 10;
                break;
              case 6:
                return _context.abrupt("return", _medusa.PaymentSessionStatus.PENDING);
              case 7:
                return _context.abrupt("return", _medusa.PaymentSessionStatus.AUTHORIZED);
              case 8:
                return _context.abrupt("return", _medusa.PaymentSessionStatus.REQUIRES_MORE);
              case 9:
                return _context.abrupt("return", _medusa.PaymentSessionStatus.CANCELED);
              case 10:
                return _context.abrupt("return", _medusa.PaymentSessionStatus.PENDING);
              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function getStatus(_x) {
        return _getStatus.apply(this, arguments);
      }
      return getStatus;
    }()
    /**
     * Creates Payme receipt.
     * @param {string} cart - the cart to create a payment for
     * @returns {object} payment receipt
     */
  }, {
    key: "createPayment",
    value: function () {
      var _createPayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(cart) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                return _context2.abrupt("return", {
                  status: _medusa.PaymentSessionStatus.PENDING
                });
              case 4:
                _context2.prev = 4;
                _context2.t0 = _context2["catch"](0);
                console.log("ERROR: [CREATE PAYMENT] ", _context2.t0);
                throw _context2.t0;
              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 4]]);
      }));
      function createPayment(_x2) {
        return _createPayment.apply(this, arguments);
      }
      return createPayment;
    }()
  }, {
    key: "createReceipt",
    value: function () {
      var _createReceipt = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(cart) {
        var _yield$this$payme_$po, _yield$this$payme_$po2, error, result;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.payme_.post("/", {
                  method: this.paymeMethods_.create,
                  params: {
                    amount: cart.total * 100,
                    account: {
                      cart_id: cart.id
                    }
                  }
                }, {
                  headers: {
                    "X-Auth": this.options_.merchantId
                  }
                });
              case 3:
                _yield$this$payme_$po = _context3.sent;
                _yield$this$payme_$po2 = _yield$this$payme_$po.data;
                error = _yield$this$payme_$po2.error;
                result = _yield$this$payme_$po2.result;
                if (!error) {
                  _context3.next = 9;
                  break;
                }
                throw error;
              case 9:
                return _context3.abrupt("return", result === null || result === void 0 ? void 0 : result.receipt);
              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](0);
                console.log("ERROR: [CREATE RECEIPT] ", _context3.t0);
                throw _context3.t0;
              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 12]]);
      }));
      function createReceipt(_x3) {
        return _createReceipt.apply(this, arguments);
      }
      return createReceipt;
    }()
    /**
     * Retrieves Payme receipt.
     * @param {string} data - the data stored with the payment
     * @returns {Object} Payme receipt object
     */
  }, {
    key: "retrievePayment",
    value: function () {
      var _retrievePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
        var _yield$this$payme_$po3, _yield$this$payme_$po4, error, result;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.payme_.post("/", {
                  method: this.paymeMethods_.get,
                  params: {
                    id: data._id
                  }
                });
              case 3:
                _yield$this$payme_$po3 = _context4.sent;
                _yield$this$payme_$po4 = _yield$this$payme_$po3.data;
                error = _yield$this$payme_$po4.error;
                result = _yield$this$payme_$po4.result;
                if (!error) {
                  _context4.next = 9;
                  break;
                }
                throw error;
              case 9:
                return _context4.abrupt("return", result === null || result === void 0 ? void 0 : result.receipt);
              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](0);
                console.log("ERROR: [RETRIEVE PAYMENT] ", _context4.t0);
                throw _context4.t0;
              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 12]]);
      }));
      function retrievePayment(_x4) {
        return _retrievePayment.apply(this, arguments);
      }
      return retrievePayment;
    }()
    /**
     * Gets the payment data from a payment session
     * @param {object} session - the session to fetch payment data for.
     * @returns {Promise<object>} Payme receipt object
     */
  }, {
    key: "getPaymentData",
    value: function () {
      var _getPaymentData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(session) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                return _context5.abrupt("return", this.retrievePayment(session.data));
              case 4:
                _context5.prev = 4;
                _context5.t0 = _context5["catch"](0);
                console.log("ERROR: [GET PAYMENT DATA] ", _context5.t0);
                throw _context5.t0;
              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 4]]);
      }));
      function getPaymentData(_x5) {
        return _getPaymentData.apply(this, arguments);
      }
      return getPaymentData;
    }()
    /**
     * This method does not call the Payme authorize function, but fetches the
     * status of the payment as it is expected to have been authorized client side.
     * @param {object} session - payment session
     * @param {object} context - properties relevant to current context
     * @returns {Promise<{ status: string, data: object }>} result with data and status
     */
  }, {
    key: "authorizePayment",
    value: function () {
      var _authorizePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(session) {
        var context,
          status,
          _args6 = arguments;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                context = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
                _context6.prev = 1;
                _context6.next = 4;
                return this.getStatus(session.data);
              case 4:
                status = _context6.sent;
                return _context6.abrupt("return", {
                  data: session.data,
                  status: status
                });
              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](1);
                console.log("ERROR: [AUTHORIZE PAYMENT] ", _context6.t0);
                throw _context6.t0;
              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[1, 8]]);
      }));
      function authorizePayment(_x6) {
        return _authorizePayment.apply(this, arguments);
      }
      return authorizePayment;
    }()
    /**
     * Updates the data stored with the payment session.
     * @param {object} data - the currently stored data.
     * @param {object} update - the update data to store.
     * @returns {object} the merged data of the two arguments.
     */
  }, {
    key: "updatePaymentData",
    value: function () {
      var _updatePaymentData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(sessionData, update) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                return _context7.abrupt("return", _objectSpread(_objectSpread({}, sessionData), update));
              case 4:
                _context7.prev = 4;
                _context7.t0 = _context7["catch"](0);
                console.log("ERROR: [UPDATE PAYMENT DATA] ", _context7.t0);
                throw _context7.t0;
              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 4]]);
      }));
      function updatePaymentData(_x7, _x8) {
        return _updatePaymentData.apply(this, arguments);
      }
      return updatePaymentData;
    }()
    /**
     * Not suported
     */
  }, {
    key: "updatePayment",
    value: function () {
      var _updatePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(data) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", data);
              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));
      function updatePayment(_x9) {
        return _updatePayment.apply(this, arguments);
      }
      return updatePayment;
    }()
    /**
     * Not suported
     */
  }, {
    key: "capturePayment",
    value: function () {
      var _capturePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(payment) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                return _context9.abrupt("return", this.retrievePayment(payment.data));
              case 4:
                _context9.prev = 4;
                _context9.t0 = _context9["catch"](0);
                throw _context9.t0;
              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 4]]);
      }));
      function capturePayment(_x10) {
        return _capturePayment.apply(this, arguments);
      }
      return capturePayment;
    }()
    /**
     * Not suported
     */
  }, {
    key: "refundPayment",
    value: function () {
      var _refundPayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(payment) {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                return _context10.abrupt("return", payment);
              case 4:
                _context10.prev = 4;
                _context10.t0 = _context10["catch"](0);
                throw _context10.t0;
              case 7:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 4]]);
      }));
      function refundPayment(_x11) {
        return _refundPayment.apply(this, arguments);
      }
      return refundPayment;
    }()
    /**
     * Cancels Payme receipt.
     * @param {Object} payment - payment method data from cart
     * @returns {string} id of cancelled order
     */
  }, {
    key: "cancelPayment",
    value: function () {
      var _cancelPayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(payment) {
        var id;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                id = payment.data.id;
                _context11.prev = 1;
                _context11.next = 4;
                return this.payme_.post("/", {
                  method: this.paymeMethods_.cancel,
                  params: {
                    id: id
                  }
                });
              case 4:
                return _context11.abrupt("return", this.getPaymentData(payment.data));
              case 7:
                _context11.prev = 7;
                _context11.t0 = _context11["catch"](1);
                console.log("ERROR: [CANCEL PAYMENT] ", _context11.t0);
                throw _context11.t0;
              case 11:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 7]]);
      }));
      function cancelPayment(_x12) {
        return _cancelPayment.apply(this, arguments);
      }
      return cancelPayment;
    }()
    /**
     * Not suported
     */
  }, {
    key: "deletePayment",
    value: function () {
      var _deletePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(_) {
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return");
              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));
      function deletePayment(_x13) {
        return _deletePayment.apply(this, arguments);
      }
      return deletePayment;
    }()
  }, {
    key: "authProtect",
    value: function authProtect(login, password) {
      if (login == this.options_.paycomLogin && password == this.options_.paycomPassword) return true;
      return false;
    }
  }, {
    key: "payReceipt",
    value: function () {
      var _payReceipt = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(receipt, card) {
        var _yield$this$payme_$po5, _yield$this$payme_$po6, error, result;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                _context13.next = 3;
                return this.payme_.post("/", {
                  method: this.paymeMethods_.pay,
                  params: {
                    id: receipt === null || receipt === void 0 ? void 0 : receipt._id,
                    token: card.token
                  }
                });
              case 3:
                _yield$this$payme_$po5 = _context13.sent;
                _yield$this$payme_$po6 = _yield$this$payme_$po5.data;
                error = _yield$this$payme_$po6.error;
                result = _yield$this$payme_$po6.result;
                if (!error) {
                  _context13.next = 9;
                  break;
                }
                throw error;
              case 9:
                return _context13.abrupt("return", result.receipt);
              case 12:
                _context13.prev = 12;
                _context13.t0 = _context13["catch"](0);
                console.log("ERROR: [PAY RECEIPT] ", _context13.t0);
                throw _context13.t0;
              case 16:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[0, 12]]);
      }));
      function payReceipt(_x14, _x15) {
        return _payReceipt.apply(this, arguments);
      }
      return payReceipt;
    }()
  }]);
  return PaymeProviderService;
}(_medusa.AbstractPaymentService);
(0, _defineProperty2["default"])(PaymeProviderService, "identifier", "payme");
var _default = PaymeProviderService;
exports["default"] = _default;