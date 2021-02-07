import base from "./base";
import * as _ from "lodash";

export default _.merge(base, {
    params: {
        baseUrl: 'https://test.paxful.com',
    },
    capabilities: {
        seleniumAddress: 'http://app.demo3.px.services:4444/wd/hub',
        // seleniumAddress: 'http://localhost:4444/wd/hub',
    },
    custom: {
        enableBaseAuth: true,
        enableTestRailReporter: true,
        // enableAllureReporter: true,
        admin: {
            id: 2854,
            name: 'automation',
            email: 'automation@paxful.com',
        },
    }
});
