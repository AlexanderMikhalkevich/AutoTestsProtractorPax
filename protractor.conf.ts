import * as _ from "lodash";
import { browser, Config } from "protractor";
import { Authenticator } from "authenticator-browser-extension";
import * as failFast from "jasmine-fail-fast";
import qaHelper from "./utils/qaHelper";
import Timer from "./utils/Timer";
import AllureHelper from "./utils/allureHelper";
import configHelper from "./utils/configHelper";
import TestRailReporter from "./utils/testrail/TestRailReporter";
import envDataKeeper, { EnvKeys } from "./utils/envDataKeeper";
import testRailHelper from "./utils/testrail/testRailHelper";

const timer = new Timer();
timer.start();

const conf = configHelper.getConfig();

if (!conf.params.baseUrl) {
    throw new Error("baseUrl is not specified");
}

if (conf.custom.enableBaseAuth) {
    const extensionsPath = "capabilities.chromeOptions.extensions";
    const extensions = _.get(conf, extensionsPath, []);
    extensions.push(
        Authenticator.for(conf.custom.baseAuth.user, conf.custom.baseAuth.password).asBase64(),
    );
    _.set(conf, extensionsPath, extensions);
}

export const config: Config = {
    ...conf,
    onPrepare: async function() {
        await browser.waitForAngularEnabled(false);
        await browser
            .manage()
            .timeouts()
            .implicitlyWait(conf.custom.implicitlyWait);

        if (conf.custom.enableAllureReporter) {
            AllureHelper.addReporter(jasmine);
        }

        if (conf.custom.enableTestRailReporter) {
            jasmine
                .getEnv()
                .addReporter(new TestRailReporter(+envDataKeeper.get(EnvKeys.testRunId)));
        }

        if (conf.custom.enableFailFast) {
            jasmine.getEnv().addReporter(failFast.init());
        }

        await qaHelper.resetState();
    },
    onComplete: async function() {
        if (conf.custom.enableTestRailReporter) {
            await browser.sleep(2000);
        }
    },
    beforeLaunch: async function() {
        if (conf.custom.pingServerBeforeTests) {
            console.log('Pinging start');
            for (let i = 0; i < 10; i++) {
                try {
                    await new Promise((resolve, reject) => {
                        setTimeout(resolve, 500);
                    });
                    await qaHelper.getEnvironmentType();
                    console.log('Pinged successfully');
                } catch (e) {
                    console.log('Pinging error');
                }
            }
            console.log('Pinging end');
        }

        if (conf.custom.enableWipe) {
            const env = await qaHelper.getEnvironmentType();
            if (!(env === "testing")) {
                throw new Error(`Environment is "${env}", but should be "testing"`);
            } else {
                console.log("Environment is correct, proceeding.");
            }
            //TODO: not pretty sure if we need try-catch here
            await qaHelper.initDB();
            console.log("DB wipe was successful");
        }

        if (conf.custom.enableTestRailReporter) {
            envDataKeeper.set(EnvKeys.testRunId, (await testRailHelper.createTestRun()).toString());
        }

        const stateMachinesEnabled = process.env['STATE_MACHINES_ENABLED'] === '1';
        console.log(`STATE_MACHINES_ENABLED: ${stateMachinesEnabled}`);
        if (stateMachinesEnabled) {
            await qaHelper.setStateMachineFlags(true);
        }

        await qaHelper.cancelAllActiveTrades();
    },
    afterLaunch: async function() {
        if (conf.custom.enableTestRailReporter) {
            await testRailHelper.removeWIP(parseInt(envDataKeeper.get(EnvKeys.testRunId)));
        }

        const timerMessage = "Tests are finished in " + timer.getTime() / 1000 + " secs";
        console.log("\n\n" + "-".repeat(timerMessage.length));
        console.log(timerMessage);
        console.log("-".repeat(timerMessage.length) + "\n\n");
    },
};
