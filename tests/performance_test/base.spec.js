import {group, check, sleep} from "k6";
import http from "k6/http";
import encoding from "k6/encoding";
import { Counter, Trend } from "k6/metrics";

const BASE_URL = __ENV.K6_BASE_URL ? __ENV.K6_BASE_URL : 'http://localhost';
const THINK_TIME = __ENV.K6_THINK_TIME ? +__ENV.K6_THINK_TIME : 0;

const credentials = encoding.b64encode(__ENV.K6_BASIC_CREDENTIALS);
const authHeader = {
    Authorization: `Basic ${credentials}`,
};

const auth = () => ({
        headers: authHeader,
    }
);

const errorsCounter = new Counter('Number of errors'),
    homePage = new Trend('Home Page', true),
    buyBitcoinPage = new Trend('BuyBitcoin Page', true),
    sellBitcoinPage = new Trend('SellBitcoin Page', true),
    loginPage = new Trend('Login Page', true),
    vendorPage = new Trend('Become Vendor Page', true);

let option ={
    'vus': __ENV.K6_VUS ? +__ENV.K6_VUS : 1,
    'thresholds': {
        'Home Page': ['avg<'+ __ENV.K6_AVG_THRESHOLD, 'p(95)<'+ __ENV.K6_95TH_THRESHOLD],
        'BuyBitcoin Page': ['avg<'+ __ENV.K6_AVG_THRESHOLD, 'p(95)<'+ __ENV.K6_95TH_THRESHOLD],
        'SellBitcoin Page': ['avg<'+ __ENV.K6_AVG_THRESHOLD, 'p(95)<'+ __ENV.K6_95TH_THRESHOLD],
        'Login Page': ['avg<'+ __ENV.K6_AVG_THRESHOLD, 'p(95)<'+ __ENV.K6_95TH_THRESHOLD],
        'Become Vendor Page': ['avg<'+ __ENV.K6_AVG_THRESHOLD, 'p(95)<'+ __ENV.K6_95TH_THRESHOLD],
        'Number of errors': ['count<1'],
    },
    'insecureSkipTLSVerify': true,
};

export let options = Object.assign(
    {},
    option,
    (() => (__ENV.K6_DURATION
        ? {'duration': __ENV.K6_DURATION}
        : {'iterations': (__ENV.K6_ITERATIONS ? +__ENV.K6_ITERATIONS : 1)}))());

export let setup = () => {
    let env = http.get(BASE_URL + '/helper-qa/environment').json('data.environment');

    if (env === 'testing') {
        http.get(BASE_URL + '/helper-qa/init-database');
    }
};

export default () => {
    group('Home page', () => {
        let res = http.get(BASE_URL, auth());
        homePage.add(res.timings.duration);

        let check_result = check(res, {
            'Status code is 200': res => res.status === 200,
        });
        errorsCounter.add(!check_result);

        sleep(THINK_TIME);
    });

    group('BuyBitcoin page', () => {
        let res = http.get(BASE_URL + '/buy-bitcoin', auth());
        buyBitcoinPage.add(res.timings.duration);

        let check_result = check(res, {
            'Status code is 200': res => res.status === 200,
        });
        errorsCounter.add(!check_result);

        sleep(THINK_TIME);
    });

    group('SellBitcoin page', () => {
        let res = http.get(BASE_URL + '/buy-bitcoin', auth());
        sellBitcoinPage.add(res.timings.duration);

        let check_result = check(res, {
            'Status code is 200': res => res.status === 200,
        });
        errorsCounter.add(!check_result);

        sleep(THINK_TIME);
    });

    group('Login page', () => {
        let res = http.get(BASE_URL + '/login', auth());
        loginPage.add(res.timings.duration);
        sleep(30);
        let check_result = check(res, {
            'Status code is 200': res => res.status === 200,
        });
        errorsCounter.add(!check_result);

        sleep(THINK_TIME);
    });

    group('Become a vendor', () => {
        let res = http.get(BASE_URL + '/vendors', auth());
        vendorPage.add(res.timings.duration);

        let check_result = check(res, {
            'Status is 200': res => res.status === 200,
        });
        errorsCounter.add(!check_result);

        sleep(THINK_TIME);
    })
}
