export default (req, res, next) => {
    const id = req.body.id;

    res.jsonrpc = function sendJsonRpcResponse(error, result) {
        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
        });

        res.end(
            JSON.stringify({
                jsonrpc: "2.0",
                id,
                error,
                result,
            })
        );
    };

    next();
};
