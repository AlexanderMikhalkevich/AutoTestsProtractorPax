import { $, browser, by, element, ExpectedConditions as EC } from "protractor";

import qaHelper from "../utils/qaHelper";

import configHelper from "../utils/configHelper";
import dashboardPO from "./dashboardPO";

const useForceLogin = configHelper.getConfig().custom.useForceLogin;

class LoginPage {
    elements = {
        titleText: $(".text-center"),
        loginEmail: $("#login_email"),
        loginPassword: $("#login_password"),
        logInSubmit: $(".qa-login-cta"),
        field2fa: $(".form-control"),
        submit2fa: $(".btn-block"),
        message: $(".sb-msg"),
        importantMessage: $(".important-notification-box"),
        successAlert: $(".qa-login-session-message"),
        username: $(".qa-header-user-username"),
        userDropdown: $(".qa-header-user-avatar"),
        logoutButton: element(by.buttonText("Log Out")),
        errorMessageCompromised: $("#loginForm div.alert.alert-danger.mb-4.p-3 .mb-3"),
        loginButton: $("button.qa-login-cta.btn"),
    };

    async go() {
        await browser.get(browser.params.baseUrl + "/login"); //overrides baseURL
        expect(await browser.getCurrentUrl()).toEqual(browser.params.baseUrl + "/login");
    }

    async checkPageLoaded() {
        await qaHelper.toBeVisible(this.elements.logInSubmit, 15000, `Can't open the Login page`);
    }

    async forceLogin(email: string) {
        await browser.get(`${browser.params.baseUrl}/helper-qa/force-login?user_id=${email}`);
        await dashboardPO.closeLanguageModalIfOpened();
    }

    async logInAccount(
        email: string,
        password?: string,
        ignoreForceLoginSettings: boolean = false,
    ) {
        if (useForceLogin && !ignoreForceLoginSettings) {
            await this.forceLogin(email);
            return;
        }

        const elements = this.elements;
        password = password || "xXxXxX1!";

        await qaHelper.resetState();
        await this.go();
        await elements.loginEmail.sendKeys(email);
        await elements.loginPassword.sendKeys(password);

        await elements.logInSubmit.click();
        await qaHelper.waitForPageToBeLoaded();
        await browser.sleep(50);
        await dashboardPO.closeLanguageModalIfOpened();
    }

    async logInAccount2faGoogle(email, password?, ignoreForceLoginSettings: boolean = false) {
        if (useForceLogin && !ignoreForceLoginSettings) {
            await this.forceLogin(email);
            return;
        }

        const elements = this.elements;
        const code2fa = "000000";

        await this.logInAccount(email, password, ignoreForceLoginSettings);

        expect(await browser.getCurrentUrl()).toEqual(
            browser.params.baseUrl + "/login/ga-interlude",
        );

        await elements.field2fa.sendKeys(code2fa);
        await elements.submit2fa.click();

        await dashboardPO.closeLanguageModalIfOpened();
    }

    async logInAccount2faSms(email, password?, ignoreForceLoginSettings: boolean = false) {
        if (useForceLogin && !ignoreForceLoginSettings) {
            await this.forceLogin(email);
            return;
        }

        const elements = this.elements;
        const code2fa = "000000";

        await this.logInAccount(email, password, ignoreForceLoginSettings);

        expect(await browser.getCurrentUrl()).toEqual(
            browser.params.baseUrl + "/login/sms-interlude",
        );
        await elements.field2fa.sendKeys(code2fa);
        await elements.submit2fa.click();

        await dashboardPO.closeLanguageModalIfOpened();
    }

    async isLoggedIn(): Promise<boolean> {
        return this.elements.username.isPresent();
    }

    async isNotLoggedIn(): Promise<boolean> {
        return this.elements.loginButton.isPresent();
    }

    async logoutUser(): Promise<void> {
        if (await this.isLoggedIn()) {
            await browser
                .actions()
                .mouseMove(this.elements.userDropdown)
                .perform();
            await browser.wait(EC.elementToBeClickable(this.elements.logoutButton));
            await this.elements.logoutButton.click();
        }
    }
}

export default new LoginPage();
