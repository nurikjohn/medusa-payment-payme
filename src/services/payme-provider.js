import axios from "axios";
import { AbstractPaymentService } from "@medusajs/medusa";

class PaymeProviderService extends AbstractPaymentService {
    static identifier = "payme";

    constructor(
        { customerService, totalsService, regionService, manager },
        options
    ) {
        super(
            { customerService, totalsService, regionService, manager },
            options
        );

        /**
         * Required Payme options:
         * url
         * token
         * charge_id
         */

        this.options_ = options;

        /** @private @const {Payme} */
        this.payme_ = axios.create({
            baseURL: `${options.url}/api`,
            headers: { "X-Auth": options.token },
        });

        this.paymeMethods_ = {
            get: "receipts.get",
            create: "receipts.create",
            send: "receipts.send",
            check: "receipts.check",
            cancel: "receipts.cancel",
        };
    }

    /**
     * Status for Payme receipt.
     * @param {Object} payment - payment method data from cart
     * @returns {string} the status of the Payme receipt
     */
    async getStatus(payment) {
        return "pending";

        const { order_id } = payment;
        const { data: receipt } = await this.payme_.post("/", {
            method: this.paymeMethods_.check,
            params: {
                id: order_id,
            },
        });

        switch (receipt.state) {
            case 0:
                return "pending";
            case 4:
                return "authorized";
            case 5:
            case 6:
            case 20:
                return "requires_more";
            case 21:
            case 30:
            case 50:
                return "canceled";
            default:
                return "pending";
        }
    }

    /**
     * Creates Payme receipt.
     * @param {string} cart - the cart to create a payment for
     * @returns {string} id of payment intent
     */
    async createPayment(cart) {
        return "payme-payment-intent";

        try {
            // TODO: tax rate
            // TODO: discounts

            const { data: receipt } = await this.payme_.post("/", {
                method: this.paymeMethods_.create,
                params: {
                    account: {
                        charge_id: this.options_.charge_id,
                    },
                    amount: cart.total * 100,
                    detail: {
                        items: cart.items.map((item) => ({
                            title: item.title, //нааименование товара или услуги
                            price: item.total * 1000, //цена за единицу товара или услуги, сумма указана в тийинах
                            count: item.quantity, //кол-во товаров или услуг
                            code: "00702001001000001", // код *ИКПУ обязательное поле
                            units: Math.round(
                                item.original_total / item.quantity
                            ), //значение изменится в зависимости от вида товара
                            vat_percent: 15, //обязательное поле, процент уплачиваемого НДС для данного товара или услуги
                            package_code: "123456", //Код упаковки для конкретного товара или услуги, содержится на сайте в деталях найденного ИКПУ
                        })),
                    },
                    description: "",
                },
            });

            return receipt;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves Payme receipt.
     * @param {string} data - the data stored with the payment
     * @returns {Object} Payme receipt object
     */
    async retrievePayment(data) {
        return "payme-payment-intent";

        try {
            const receipt = await this.payme_.post("/", {
                method: this.paymeMethods_.get,
                params: {
                    id: data.order_id,
                },
            });

            return receipt;
        } catch (error) {
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
        const status = await this.getStatus(session.data);

        try {
            return { data: session.data, status };
        } catch (error) {
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
            throw error;
        }
    }

    /**
     * Not suported
     */
    async updatePayment(data) {
        throw new Error("Method not implemented.");

        return data;
    }

    /**
     * Not suported
     */
    async capturePayment(payment) {
        throw new Error("Method not implemented.");

        try {
            return payment;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Not suported
     */
    async refundPayment(payment) {
        throw new Error("Method not implemented.");

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
        throw new Error("Method not implemented.");

        const { order_id } = payment.data;

        try {
            await this.payme_.post("/", {
                method: this.paymeMethods_.cancel,
                params: {
                    id: order_id,
                },
            });

            return this.getPaymentData(payment.data);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Not suported
     */
    async deletePayment(_) {
        throw new Error("Method not implemented.");
        return;
    }
}

export default PaymeProviderService;
