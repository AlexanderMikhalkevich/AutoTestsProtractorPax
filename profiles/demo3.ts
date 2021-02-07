import base from "./base";
import * as _ from "lodash";

export default _.merge(base, {
    params: {
        baseUrl: 'https://app.demo3.px.services',
    },
    capabilities: {
        seleniumAddress: 'http://app.demo3.px.services:4444/wd/hub',
    },
    custom: {

    }
});