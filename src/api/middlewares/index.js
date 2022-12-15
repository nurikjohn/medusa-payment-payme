import jsonrpc from "./json-rpc";
import { default as wrap } from "./await-middleware";
import auth from "./auth-middleware";

export default {
    wrap,
    jsonrpc,
    auth,
};
