import PaymeErrors from "../../../constants/errors";
import { PaymentSessionStatus } from "@medusajs/medusa";
import PaymeProviderService from "../../../services/payme-provider";

export default async (req, res) => {
    const {
        body: { method, params },
    } = req;
    const cartService = req.scope.resolve("cartService");
    const orderService = req.scope.resolve("orderService");
    const manager = req.scope.resolve("manager");

    switch (method) {
        case "CheckPerformTransaction": {
            const cart_id = params.account.cart_id;
            let cart = null;

            try {
                cart = await cartService.retrieveWithTotals(cart_id, {
                    relations: ["payment_sessions"],
                });
            } catch (error) {
                return res.jsonrpc(PaymeErrors.CartNotFound);
            }

            if (!cart) return res.jsonrpc(PaymeErrors.CartNotFound);

            if (cart.payment_session?.status == PaymentSessionStatus.AUTHORIZED)
                return res.jsonrpc(PaymeErrors.UnexpectedTransactionState);

            // TODO: remove or fix this
            if (cart.total * 100 != params.amount)
                return res.jsonrpc(PaymeErrors.IncorrectAmount);

            return res.jsonrpc(null, {
                allow: true,
            });
        }

        case "CreateTransaction": {
            const cart_id = params.account.cart_id;
            let cart = null;

            try {
                cart = await cartService.retrieveWithTotals(cart_id, {
                    relations: ["payment_sessions"],
                });
            } catch (error) {
                return res.jsonrpc(PaymeErrors.CartNotFound);
            }

            if (!cart) return res.jsonrpc(PaymeErrors.CartNotFound);

            // TODO: remove or fix this
            if (cart.total * 100 != params.amount)
                return res.jsonrpc(PaymeErrors.IncorrectAmount);

            if (cart.payment_session.status == "pending") {
                const create_time = new Date(
                    cart.payment_session.created_at
                ).getTime();
                if (create_time > params.time) {
                    await cartService.refreshPaymentSession(
                        cart_id,
                        PaymeProviderService.identifier
                    );
                    return res.jsonrpc(PaymeErrors.UnexpectedTransactionState);
                }

                if (
                    cart.metadata?.payme_transaction_id &&
                    params.id != cart.metadata?.payme_transaction_id
                ) {
                    return res.jsonrpc(PaymeErrors.IncorrectTransaction);
                }

                await cartService.setMetadata(
                    cart_id,
                    "payme_transaction_id",
                    params.id
                );
                return res.jsonrpc(null, {
                    transaction: cart.payment_session.id,
                    create_time,
                    state: 1,
                });
            } else {
                return res.jsonrpc(PaymeErrors.UnexpectedTransactionState);
            }
        }

        case "PerformTransaction": {
            const payme_transaction_id = params.id;

            let cart = (
                await cartService.list({
                    metadata: JSON.stringify({
                        payme_transaction_id: payme_transaction_id,
                    }),
                })
            )?.[0];

            if (!cart) return res.jsonrpc(PaymeErrors.CartNotFound);

            const cart_id = cart.id;

            try {
                cart = await cartService.retrieveWithTotals(cart_id, {
                    relations: ["payment_sessions"],
                });
            } catch (error) {
                return res.jsonrpc(PaymeErrors.CartNotFound);
            }

            if (cart.payment_session.status == PaymentSessionStatus.PENDING) {
                const create_time = new Date(
                    cart.payment_session.created_at
                ).getTime();

                if (create_time > params.time) {
                    await cartService.refreshPaymentSession(
                        cart_id,
                        PaymeProviderService.identifier
                    );
                    return res.jsonrpc(PaymeErrors.UnexpectedTransactionState);
                }

                res.jsonrpc(null, {
                    perform_time: new Date().getTime(),
                    transaction: cart.payment_session.id,
                    state: 2,
                });

                try {
                    await manager.transaction(async (manager) => {
                        await cartService
                            .withTransaction(manager)
                            .setPaymentSession(
                                cart_id,
                                PaymeProviderService.identifier
                            );

                        await cartService
                            .withTransaction(manager)
                            .authorizePayment(cart_id);
                    });
                } catch (error) {
                    console.log("ERROR: [AUTHORIZE PAYMENT] ", error);
                }
            } else if (
                cart.payment_session.status == PaymentSessionStatus.AUTHORIZED
            ) {
                return res.jsonrpc(null, {
                    perform_time: new Date(
                        cart.payment_authorized_at
                    ).getTime(),
                    transaction: cart.payment_session.id,
                    state: 2,
                });
            } else {
                return res.jsonrpc(PaymeErrors.CanNotPerformTransaction);
            }
        }

        case "CheckTransaction": {
            const payme_transaction_id = params.id;

            let cart = (
                await cartService.list({
                    metadata: JSON.stringify({ payme_transaction_id }),
                })
            )?.[0];

            if (!cart) return res.jsonrpc(PaymeErrors.CartNotFound);

            try {
                cart = await cartService.retrieveWithTotals(cart.id, {
                    relations: ["payment_sessions"],
                });
            } catch (error) {
                return res.jsonrpc(PaymeErrors.CartNotFound);
            }

            const create_time = new Date(
                cart.payment_session.created_at
            ).getTime();

            return res.jsonrpc(null, {
                perform_time: 0,
                cancel_time: 0,
                reason: null,
                transaction: cart.payment_session.id,
                create_time,
                state: 1,
            });
        }

        case "CancelTransaction": {
            const payme_transaction_id = params.id;

            let cart = (
                await cartService.list({
                    metadata: JSON.stringify({ payme_transaction_id }),
                })
            )?.[0];

            if (!cart) return res.jsonrpc(PaymeErrors.CartNotFound);

            try {
                cart = await cartService.retrieveWithTotals(cart.id, {
                    relations: ["payment_sessions"],
                });
            } catch (error) {
                return res.jsonrpc(PaymeErrors.CartNotFound);
            }

            if (cart.payment_session.status == PaymentSessionStatus.PENDING) {
                res.jsonrpc(null, {
                    cencel_time: new Date().getTime(),
                    transaction: cart.payment_session.id,
                    state: -1,
                });
            } else if (
                cart.payment_session.status == PaymentSessionStatus.AUTHORIZED
            ) {
                return res.jsonrpc(PaymeErrors.CanNotCancel);
            } else {
                res.jsonrpc(null, {
                    cencel_time: cart.payment_session?.data?.cancel_time,
                    transaction: cart.payment_session?.id,
                    state: -1,
                });
            }
        }
        default:
            return res.jsonrpc(PaymeErrors.TransportError);
    }
};
