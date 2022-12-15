import PaymeErrors from "../../constants/errors";

export default (req, res, next) => {
    const paymeProviderService = req.scope.resolve("paymeProviderService");

    const auth = req.headers["authorization"];

    if (!auth) return res.jsonrpc(PaymeErrors.AccessDenied);

    const [authMethod, token] = auth.trim().split(/ +/);

    if (authMethod !== "Basic" || !token)
        return res.jsonrpc(PaymeErrors.AccessDenied);

    const decodedToken = Buffer.from(token, "base64").toString("utf-8");
    const [login, password] = decodedToken.trim().split(/ *: */);

    if (!paymeProviderService.authProtect(login, password))
        return res.jsonrpc(PaymeErrors.AccessDenied);

    next();
};
