import { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import middlewares from "../../middlewares";

const route = Router();

export default (app) => {
    app.use("/payme", route);

    route.use(bodyParser.json());
    route.use(middlewares.jsonrpc);

    route.post(
        "/merchant",
        // middlewares.auth,
        middlewares.wrap(require("./merchant").default)
    );

    route.options(
        "/pay",
        cors({
            origin: ["http://localhost:8000"],
            credentials: true,
        })
    );
    route.post(
        "/pay",
        cors({
            origin: ["http://localhost:8000"],
            credentials: true,
        }),
        middlewares.wrap(require("./pay").default)
    );

    return app;
};
