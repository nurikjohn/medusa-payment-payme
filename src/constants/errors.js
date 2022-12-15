export default {
    TransportError: {
        code: -32300,
        message: {
            ru: "Ошибка транспорта",
            uz: "Transport xatosi",
            en: "Transport error",
        },
        data: null,
    },
    AccessDenied: {
        code: -32504,
        message: {
            ru: "Доступ запрещен",
            uz: "Murojaat rad etildi",
            en: "Access denied",
        },
        data: null,
    },
    TransactionNotFound: {
        code: -31003,
        message: {
            ru: "Транзакция не найден",
            uz: "Transaktsiya topilmadi",
            en: "Transaction not found",
        },
        data: null,
    },
    UnexpectedTransactionState: {
        code: -31099,
        message: {
            ru: "Статус транзакции не позволяет выполнить операцию",
            uz: "Tranzaksiya holati operatsiyani bajarishga imkon bermaydi",
            en: "The transaction status does not allow the operation to be completed",
        },
        data: null,
    },
    IncorrectTransaction: {
        code: -31050,
        message: {
            ru: "Транзакция не найден",
            uz: "Transaktsiya topilmadi",
            en: "Transaction not found",
        },
        data: null,
    },
    IncorrectAmount: {
        code: -31001,
        message: {
            ru: "Неверная сумма.",
            uz: "Miqdor noto‘g‘ri.",
            en: "Incorrect amount.",
        },
        data: null,
    },
    CartNotFound: {
        code: -31050,
        message: {
            ru: "Корзина не найдена",
            uz: "Savat topilmadi",
            en: "Cart not found",
        },
        data: null,
    },
    CanNotPerformTransaction: {
        code: -31008,
        message: {
            ru: "Ошибка при попытке транзакции.",
            uz: "Tranzaktsiyani bajarishda xatolik.",
            en: "An error occurred while attempting the transaction.",
        },
        data: null,
    },
    CanNotCancel: {
        code: -31007,
        message: {
            ru: "Заказ выполнен. Невозможно отменить транзакцию. Товар или услуга предоставлена покупателю в полном объеме.",
            uz: "Buyurtma bajarildi. Tranzaktsiyani bekor qilish mumkin emas.",
            en: "The order has been completed. It is not possible to cancel the transaction.",
        },
        data: null,
    },
};
