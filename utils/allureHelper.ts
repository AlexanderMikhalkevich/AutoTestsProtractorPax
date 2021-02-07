import * as AllureReporter from 'jasmine-allure-reporter';
import {browser} from "protractor";

declare const allure: any;

class AllureHelper {
    static addReporter(jasmine) : void {
        jasmine.getEnv().addReporter(new AllureReporter({
            resultsDir: 'allure-results'
        }));
        jasmine.getEnv().afterEach(function (done) {
            browser.takeScreenshot().then(function (png) {
                allure.createAttachment('Screenshot', function () {
                    return Buffer.from(png, 'base64');
                },'image/png')();
                done();
            });
        });
    }
}

export default AllureHelper;