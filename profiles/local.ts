import base from "./base";
import * as _ from "lodash";

export default _.merge(base, {
    params: {
        baseUrl: 'http://localhost',
    },
    capabilities: {
        seleniumAddress: 'http://localhost:4444/wd/hub',
    },
    custom: {
        enableWipe: true,
    }
});
