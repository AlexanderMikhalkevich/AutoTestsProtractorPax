import { $ } from "protractor";
import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";

describe("Acceptance test - Wallet Page", () => {
    let without2fa, withSMS2fa, withGA2fa;

    beforeAll(async () => {
        await Promise.all([
            //prepare test data for login acc
            (async () => {
                without2fa = await qaHelper.createRandomUser();
                await qaHelper.activateEmail(without2fa.id);
            })(),

            //prepare test data for login with 2fa SMS
            (async () => {
                withSMS2fa = await qaHelper.createRandomUser();
                await Promise.all([
                    qaHelper.activateEmail(withSMS2fa.id),
                    qaHelper.activate2faSms(withSMS2fa.id),
                ]);
            })(),

            //prepare test data for login with 2fa google
            (async () => {
                withGA2fa = await qaHelper.createRandomUser();
                await Promise.all([
                    qaHelper.activateEmail(withGA2fa.id),
                    qaHelper.activate2faGoogle(withGA2fa.id),
                ]);
            })(),
        ]);
    });
    beforeEach(async () => {
        await qaHelper.resetState();
        await loginPage.go();
    });
    it("should login into account without 2fa", async () => {
        await loginPage.logInAccount(without2fa.email, undefined, true);
        await qaHelper.toBeVisible(
            $("div.summary-overview.text-center > h2"),
            10000,
            "redirect to dashboard dind't work",
        );
    });
    it("should login into account with 2fa SMS", async () => {
        await loginPage.logInAccount2faSms(withSMS2fa.email, undefined, true);
        await qaHelper.toBeVisible(
            $("div.summary-overview.text-center > h2"),
            10000,
            "redirect to dashboard dind't work",
        );
    });
    it("should login into account with 2fa google", async () => {
        await loginPage.logInAccount2faGoogle(withGA2fa.email, undefined, true);
        await qaHelper.toBeVisible(
            $("div.summary-overview.text-center > h2"),
            10000,
            "redirect to dashboard dind't work",
        );
    });
});
