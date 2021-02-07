import base from "./base";
import * as _ from "lodash";

export default _.merge(base, {
    params: {
        baseUrl: 'https://127.0.0.1',
    },
    custom: {
        enableAllureReporter: true,
        enableWipe: true,
    },
});
