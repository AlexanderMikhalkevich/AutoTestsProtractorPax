import base from "./base";
import * as _ from "lodash";

export default _.merge(base, {
    params: {
        baseUrl: "https://localhost",
    },
    custom: {
        enableWipe: false,
        enableFailFast: true,
        pingServerBeforeTests: false,
    },
});
