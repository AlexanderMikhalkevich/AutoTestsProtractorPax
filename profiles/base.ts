const fs = require("fs");
const path = require("path");

const getAllFiles = function(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
};

const tradeBuyDir = "tests/acceptance_test/trade/fromABuyerSide";
const tradeBuyP1Files = ["completedTradeFeedbacksSpec", "newTradeSpec", "newTradeTagsSpec"];

const tradeSellDir = "tests/acceptance_test/trade/fromASellerSide";
const tradeSellP1Files = ["completedTradeFeedbacksSpec", "completedTradeSpec"];

//react trade helpers
const reactTradeBuyDir = "tests/acceptance_test/reactTrade/fromABuyerSide";
const reactTradeBuyP1Files = ["completedTradeFeedbacksSpec", "newTradeSpec", "newTradeTagsSpec"];

const reactTradeSellDir = "tests/acceptance_test/reactTrade/fromASellerSide";
const reactTradeSellP1Files = ["completedTradeFeedbacksSpec", "completedTradeSpec"];

const getTestsList = (dir) =>
    getAllFiles(dir)
        .filter((s) => s.endsWith("Spec.ts"))
        .map((s) => s.replace("Spec.ts", "Spec.js"));
const includeTestsFromDir = (dirPath, testsList) =>
    getTestsList(dirPath).filter((filePath) => testsList.some((test) => filePath.includes(test)));
const excludeTestsFromDir = (dirPath, testsList) =>
    getTestsList(dirPath).filter((filePath) => !testsList.some((test) => filePath.includes(test)));

export default {
    noGlobals: true,
    SELENIUM_PROMISE_MANAGER: false,
    suites: {
        health_check: "tests/health_check/*Spec.js",
        smoke_test: "tests/smoke_test/*Spec.js",
        settings: "tests/acceptance_test/settings/*Spec.js",
        wallet: "tests/acceptance_test/wallet/*Spec.js",
        offer: "tests/acceptance_test/offer/**/*Spec.js",
        userProfile: "tests/acceptance_test/profile/*Spec.js",
        classicDashboard: "tests/acceptance_test/classicDashboard/*Spec.js",
        vendorDashboard: "tests/acceptance_test/vendorDashboard/*Spec.js",
        search: "tests/acceptance_test/search/*Spec.js",
        kiosk: "tests/acceptance_test/kiosk/*Spec.js",

        trade: "tests/acceptance_test/trade/*Spec.js",

        tradeBuy: "tests/acceptance_test/trade/fromABuyerSide/*Spec.js",
        tradeBuyP1: includeTestsFromDir(tradeBuyDir, tradeBuyP1Files),
        tradeBuyP2: excludeTestsFromDir(tradeBuyDir, tradeBuyP1Files),

        tradeSell: "tests/acceptance_test/trade/fromASellerSide/*Spec.js",
        tradeSellP1: includeTestsFromDir(tradeSellDir, tradeSellP1Files),
        tradeSellP2: excludeTestsFromDir(tradeSellDir, tradeSellP1Files),

        //React page tests
        reactTrade: "tests/acceptance_test/reactTrade/*Spec.js",

        reactTradeBuy: "tests/acceptance_test/reactTrade/fromABuyerSide/*Spec.js",
        reactTradeBuyP1: includeTestsFromDir(reactTradeBuyDir, reactTradeBuyP1Files),
        reactTradeBuyP2: excludeTestsFromDir(reactTradeBuyDir, reactTradeBuyP1Files),

        reactTradeSell: "tests/acceptance_test/reactTrade/fromASellerSide/*Spec.js",
        reactTradeSellP1: includeTestsFromDir(reactTradeSellDir, reactTradeSellP1Files),
        reactTradeSellP2: excludeTestsFromDir(reactTradeSellDir, reactTradeSellP1Files),

        login: "tests/acceptance_test/login/*Spec.js",
        accountStatuses: "tests/account_statuses/*UserSpec.js",
        widget: "tests/acceptance_test/homepageWidgetSpec.js",
    },
    params: {
        // baseUrl: 'bla bla',
        framework: "jasmine",
    },
    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000,
    },
    capabilities: {
        browserName: "chrome",
        enableVNC: true,
        maxInstances: 4,
        shardTestFiles: false,
        acceptInsecureCerts: true,

        // seleniumAddress: 'http://localhost:4444/wd/hub',
        chromeOptions: {
            args: [
                "--no-sandbox",
                // '--user-data-dir=/dev/shm',
                // '--headless',
                "--disable-logging",
                "--window-size=1920,1200",
            ],
            prefs: {
                intl: { accept_languages: "en-US" },
            },
        },
    },
    custom: {
        enableFailFast: true,
        enableAllureReporter: false,
        enableTestRailReporter: false,
        enableWipe: false,
        enableBaseAuth: false,
        useForceLogin: true,
        implicitlyWait: 1000,
        pingServerBeforeTests: true,
        admin: {
            id: 1,
            name: "admin",
            email: "admin@paxful.com",
        },
        baseAuth: {
            user: "px",
            password: "easyBitz1",
            sendImmediately: false,
        },
    },
};
