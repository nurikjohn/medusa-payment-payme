import axios from "axios";
import { AbstractPaymentService, PaymentSessionStatus } from "@medusajs/medusa";

class PaymeProviderService extends AbstractPaymentService {
    static identifier = "payme";

    constructor(
        { customerService, totalsService, regionService, cartService, manager },
        options
    ) {
        super(
            {
                customerService,
                totalsService,
                regionService,
                cartService,
                manager,
            },
            options
        );

        /**
         * Required Payme options:
         * url
         * merchantId
         * key
         */

        this.options_ = {
            url: options.url,
            token: `${options.merchantId}:${options.key}`,
            merchantId: options.merchantId,
            paycomPassword: options.key,
            paycomLogin: "Paycom",
        };

        /** @private @const {Payme} */
        this.payme_ = axios.create({
            baseURL: `${options.url}/api`,
            headers: { "X-Auth": this.options_.token },
        });

        this.paymeMethods_ = {
            get: "receipts.get",
            create: "receipts.create",
            send: "receipts.send",
            check: "receipts.check",
            cancel: "receipts.cancel",
            pay: "receipts.pay",
        };

        this.cartService_ = cartService;
        this.manager_ = manager;
    }

    /**
     * Status for Payme receipt.
     * @param {Object} payment - payment method data from cart
     * @returns {string} the status of the Payme receipt
     */
    async getStatus(payment) {
        const receipt = await this.retrievePayment(payment);

        switch (receipt.state) {
            case 0:
                return PaymentSessionStatus.PENDING;
            case 4:
            case 30:
                return PaymentSessionStatus.AUTHORIZED;
            case 5:
            case 6:
            case 20:
                return PaymentSessionStatus.REQUIRES_MORE;
            case 21:
            case 50:
                return PaymentSessionStatus.CANCELED;
            default:
                return PaymentSessionStatus.PENDING;
        }
    }

    /**
     * Creates Payme receipt.
     * @param {string} cart - the cart to create a payment for
     * @returns {object} payment receipt
     */
    async createPayment(cart) {
        try {
            return {
                status: PaymentSessionStatus.PENDING,
            };
        } catch (error) {
            console.log("ERROR: [CREATE PAYMENT] ", error);
            throw error;
        }
    }

    async createReceipt(cart) {
        try {
            const {
                data: { error, result },
            } = await this.payme_.post(
                "/",
                {
                    method: this.paymeMethods_.create,
                    params: {
                        amount: cart.total * 100,
                        account: {
                            cart_id: cart.id,
                        },
                    },
                },
                {
                    headers: { "X-Auth": this.options_.merchantId },
                }
            );

            if (error) throw error;

            return result?.receipt;
        } catch (error) {
            console.log("ERROR: [CREATE RECEIPT] ", error);
            throw error;
        }
    }

    /**
     * Retrieves Payme receipt.
     * @param {string} data - the data stored with the payment
     * @returns {Object} Payme receipt object
     */
    async retrievePayment(data) {
        try {
            const {
                data: { error, result },
            } = await this.payme_.post("/", {
                method: this.paymeMethods_.get,
                params: {
                    id: data._id,
                },
            });

            if (error) throw error;

            return result?.receipt;
        } catch (error) {
            console.log("ERROR: [RETRIEVE PAYMENT] ", error);
            throw error;
        }
    }

    /**
     * Gets the payment data from a payment session
     * @param {object} session - the session to fetch payment data for.
     * @returns {Promise<object>} Payme receipt object
     */
    async getPaymentData(session) {
        try {
            return this.retrievePayment(session.data);
        } catch (error) {
            console.log("ERROR: [GET PAYMENT DATA] ", error);
            throw error;
        }
    }

    /**
     * This method does not call the Payme authorize function, but fetches the
     * status of the payment as it is expected to have been authorized client side.
     * @param {object} session - payment session
     * @param {object} context - properties relevant to current context
     * @returns {Promise<{ status: string, data: object }>} result with data and status
     */
    async authorizePayment(session, context = {}) {
        try {
            const status = await this.getStatus(session.data);

            return {
                data: session.data,
                status,
            };
        } catch (error) {
            console.log("ERROR: [AUTHORIZE PAYMENT] ", error);
            throw error;
        }
    }

    /**
     * Updates the data stored with the payment session.
     * @param {object} data - the currently stored data.
     * @param {object} update - the update data to store.
     * @returns {object} the merged data of the two arguments.
     */
    async updatePaymentData(sessionData, update) {
        try {
            return { ...sessionData, ...update };
        } catch (error) {
            console.log("ERROR: [UPDATE PAYMENT DATA] ", error);
            throw error;
        }
    }

    /**
     * Not suported
     */
    async updatePayment(data) {
        return data;
    }

    /**
     * Not suported
     */
    async capturePayment(payment) {
        try {
            return this.retrievePayment(payment.data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Not suported
     */
    async refundPayment(payment) {
        try {
            return payment;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Cancels Payme receipt.
     * @param {Object} payment - payment method data from cart
     * @returns {string} id of cancelled order
     */
    async cancelPayment(payment) {
        const { id } = payment.data;

        try {
            await this.payme_.post("/", {
                method: this.paymeMethods_.cancel,
                params: {
                    id,
                },
            });

            return this.getPaymentData(payment.data);
        } catch (error) {
            console.log("ERROR: [CANCEL PAYMENT] ", error);
            throw error;
        }
    }

    /**
     * Not suported
     */
    async deletePayment(_) {
        return;
    }

    authProtect(login, password) {
        if (
            login == this.options_.paycomLogin &&
            password == this.options_.paycomPassword
        )
            return true;

        return false;
    }

    async payReceipt(receipt, card) {
        try {
            const {
                data: { error, result },
            } = await this.payme_.post("/", {
                method: this.paymeMethods_.pay,
                params: {
                    id: receipt?._id,
                    token: card.token,
                },
            });

            if (error) throw error;

            return result.receipt;
        } catch (error) {
            console.log("ERROR: [PAY RECEIPT] ", error);
            throw error;
        }
    }
}

export default PaymeProviderService;
