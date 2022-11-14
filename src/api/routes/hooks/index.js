import { Router } from "express";
import bodyParser from "body-parser";
import middlewares from "../../middlewares";

const route = Router();

export default (app) => {
    app.use("/payme", route);

    route.use(bodyParser.json());
    route.post("/test", middlewares.wrap(require("./test").default));

    return app;
};
