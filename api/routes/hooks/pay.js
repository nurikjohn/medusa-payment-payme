"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, cart_id, card, cartService, customerService, paymentProviderService, cart, _customer$metadata, customer, payme_cards;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$body = req.body, cart_id = _req$body.cart_id, card = _req$body.card;
            if (card) {
              _context.next = 4;
              break;
            }
            return _context.abrupt("return", res.status(400).json({
              success: false,
              error: "Card is required"
            }));
          case 4:
            cartService = req.scope.resolve("cartService");
            customerService = req.scope.resolve("customerService");
            paymentProviderService = req.scope.resolve("pp_payme");
            _context.next = 9;
            return cartService.retrieveWithTotals(cart_id, {
              relations: ["payment_sessions"]
            });
          case 9:
            cart = _context.sent;
            if (cart) {
              _context.next = 12;
              break;
            }
            return _context.abrupt("return", res.status(404).json({
              success: false,
              data: "Cart not found"
            }));
          case 12:
            if (!card.recurrent) {
              _context.next = 20;
              break;
            }
            _context.next = 15;
            return customerService.retrieve(cart.customer_id);
          case 15:
            customer = _context.sent;
            payme_cards = ((_customer$metadata = customer.metadata) === null || _customer$metadata === void 0 ? void 0 : _customer$metadata.payme_cards) || [];
            if (!payme_cards.find(function (_ref2) {
              var number = _ref2.number;
              return number == card.number;
            })) {
              payme_cards.push(card);
            }
            _context.next = 20;
            return customerService.update(customer.id, {
              metadata: {
                payme_cards: payme_cards
              }
            });
          case 20:
            // let receipt = await paymentProviderService.createReceipt(cart);

            // await cartService.updatePaymentSession(cart.id, receipt);

            // receipt = await paymentProviderService.payReceipt(receipt, card);

            res.status(200).json({
              success: true
              // data: receipt,
            });
            _context.next = 27;
            break;
          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](0);
            console.log("ERROR: [PAY ROUTE] ", _context.t0);
            res.status(500).json({
              error: _context.t0
            });
          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 23]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports["default"] = _default;