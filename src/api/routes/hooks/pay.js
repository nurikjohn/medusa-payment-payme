export default async (req, res) => {
    try {
        const { cart_id, card } = req.body;

        if (!card)
            return res.status(400).json({
                success: false,
                error: "Card is required",
            });

        const cartService = req.scope.resolve("cartService");
        const customerService = req.scope.resolve("customerService");
        const paymentProviderService = req.scope.resolve("pp_payme");

        const cart = await cartService.retrieveWithTotals(cart_id, {
            relations: ["payment_sessions"],
        });

        if (!cart)
            return res
                .status(404)
                .json({ success: false, data: "Cart not found" });

        if (card.recurrent) {
            const customer = await customerService.retrieve(cart.customer_id);

            const payme_cards = customer.metadata?.payme_cards || [];

            if (!payme_cards.find(({ number }) => number == card.number)) {
                payme_cards.push(card);
            }

            await customerService.update(customer.id, {
                metadata: {
                    payme_cards,
                },
            });
        }

        let receipt = await paymentProviderService.createReceipt(cart);

        await cartService.updatePaymentSession(cart.id, receipt);

        receipt = await paymentProviderService.payReceipt(receipt, card);

        res.status(200).json({
            success: true,
            data: receipt,
        });
    } catch (error) {
        console.log("ERROR: [PAY ROUTE] ", error);
        res.status(500).json({
            error,
        });
    }
};
