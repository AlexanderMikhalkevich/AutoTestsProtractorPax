import { $, $$, browser } from "protractor";
import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import settingsPage from "../../../pages/settingsPO";

describe("Settings - Security", () => {
    let user;

    describe("Set Security Questions", () => {
        beforeAll(async () => {
            user = await qaHelper.createRandomUser();
            await qaHelper.activateEmail(user.id);
            await loginPage.logInAccount(user.email);
        });

        beforeEach(async () => {
            await settingsPage.go();
            await settingsPage.checkPageLoadedLoggedIn();
        });

        it("adds security questions id134", async () => {
            const a = "#security-questions-page";
            const navMenuLink = $(".qa-sidebar-item-security-questions");
            const profileBlockLink = $(`#profile ${a}`);
            const securityBlockLinks = $$(`#security ${a}`);

            // here is a Set Answers link on the Profile page
            expect(await profileBlockLink.isDisplayed()).toBe(true);
            // here are 4 Set Answers links on the Security page
            await settingsPage.openSecurityTab();
            expect(await securityBlockLinks.count()).toBe(4);
            // here is a Set Security Questions left side menu item
            expect(await navMenuLink.isDisplayed()).toBe(true);

            await settingsPage.addSecurityQuestions($$(`#security ${a}`).get(0));

            // here is no a Set Answers link on the Profile page
            await settingsPage.openProfileTab();
            expect(await profileBlockLink.isPresent()).toBe(false);
            // here are no Set Answers links on the Security page
            await settingsPage.openSecurityTab();
            expect(await securityBlockLinks.count()).toBe(0);
            // here is no a Set Security Questions left side menu item
            expect(await navMenuLink.isPresent()).toBe(false);
        });
    });

    describe("2FA", () => {
        const options: [string, string, { sms: number; ga: number }][] = [
            ["#login-two-factor-form", "Login", { sms: 124, ga: 125 }],
            ["#withdrawal-two-factor-form", "Send Out", { sms: 126, ga: 127 }],
            ["#release-coins-two-factor-form", "Release", { sms: 128, ga: 2531 }],
        ];
        const openSecurityPage = async () => {
            await settingsPage.go();
            await settingsPage.checkPageLoadedLoggedIn();
            await settingsPage.openSecurityTab();
        };
        const createUserAndLogin = async () => {
            user = await qaHelper.createRandomUser();
            await qaHelper.activateEmail(user.id);
            await qaHelper.saveSecurityAnswers(user.id);
            await qaHelper.togglePhoneVerification(user.id, qaHelper.getRandomFakeNumber());
            await loginPage.logInAccount(user.email);
        };
        const verifySuccessMessageIsVisible = async (optionBlockLocator) =>
            await qaHelper.toBeVisible(
                $(`${optionBlockLocator} .successmsg`),
                15000,
                "2fa settings were not saved",
            );
        const clickOnNthRadio = async (optionBlockLocator, nth) => {
            const el = $(`${optionBlockLocator} .field:nth-of-type(${nth}) .radio label`);
            await qaHelper.scrollToElement(el);
            // TODO: do not use JS clickers
            await browser.executeScript((el) => el.click(), el);
        };
        const get2FACodeInput = (optionBlockLocator) =>
            $(`${optionBlockLocator} input[name="two-factor-phone-code"]`);

        describe("SMS", () => {
            beforeAll(createUserAndLogin);
            beforeEach(openSecurityPage);

            options.forEach(([optionBlockLocator, optionName, { sms: caseId }]) => {
                it(`turns on/off SMS 2FA for the ${optionName} option id${caseId}`, async () => {
                    const smsInputElement = $(
                        `${optionBlockLocator} .field:nth-of-type(2) .radio input`,
                    );
                    expect(await smsInputElement.getAttribute("checked")).toBe(null);
                    await clickOnNthRadio(optionBlockLocator, 2);
                    await $(`${optionBlockLocator} button`).click();
                    await verifySuccessMessageIsVisible(optionBlockLocator);
                    await openSecurityPage();
                    expect(await smsInputElement.getAttribute("checked")).toBe("true");

                    await clickOnNthRadio(optionBlockLocator, 1);
                    await $(`${optionBlockLocator} button`).click();
                    await qaHelper.toBeVisible(
                        get2FACodeInput(optionBlockLocator),
                        15000,
                        "do not see SMS 2fa approval field",
                    );
                    await get2FACodeInput(optionBlockLocator).sendKeys("000000");
                    await $$(`${optionBlockLocator} button`).last().click();
                    await verifySuccessMessageIsVisible(optionBlockLocator);
                    await openSecurityPage();
                    expect(await smsInputElement.getAttribute("checked")).toBe(null);
                });
            });
        });

        describe("GA", () => {
            beforeAll(createUserAndLogin);
            beforeEach(openSecurityPage);

            options.forEach(([optionBlockLocator, optionName, { ga: caseId }]) => {
                it(`turns on/off GA 2FA for the ${optionName} option id${caseId}`, async () => {
                    const gaInputElement = $(
                        `${optionBlockLocator} .field:nth-of-type(3) .radio input`,
                    );
                    expect(await gaInputElement.getAttribute("checked")).toBe(null);
                    await clickOnNthRadio(optionBlockLocator, 3);
                    await $(`${optionBlockLocator} button`).click();
                    await qaHelper.toBeVisible(
                        get2FACodeInput(optionBlockLocator),
                        15000,
                        "do not see ga 2fa approval field",
                    );
                    await get2FACodeInput(optionBlockLocator).sendKeys("000000");
                    await $(`${optionBlockLocator} button`).click();
                    await verifySuccessMessageIsVisible(optionBlockLocator);
                    await openSecurityPage();
                    expect(await gaInputElement.getAttribute("checked")).toBe("true");

                    await clickOnNthRadio(optionBlockLocator, 1);
                    await qaHelper.toBeVisible(
                        get2FACodeInput(optionBlockLocator),
                        15000,
                        "do not see ga 2fa approval field",
                    );
                    await get2FACodeInput(optionBlockLocator).sendKeys("000000");
                    await $(`${optionBlockLocator} button`).click();
                    await verifySuccessMessageIsVisible(optionBlockLocator);
                    await openSecurityPage();
                    expect(await gaInputElement.getAttribute("checked")).toBe(null);
                });
            });
        });

        // TODO: there should be also a test that verifies that we should put a 2fa code only once when we want to enable GA 2FA
    });

    describe("Change password", () => {
        const oldPassword = "xXxXxX1!";
        const newPassword = "xXxXxX2!";

        beforeAll(async () => {
            user = await qaHelper.createRandomUser();
            await qaHelper.activateEmail(user.id);
            await loginPage.logInAccount(user.email);
            await settingsPage.go();
            await settingsPage.checkPageLoadedLoggedIn();
            await settingsPage.openSecurityTab();
        });

        it("changes password id2526", async () => {
            const formLocator = "#change-pwd-form";
            await $(`${formLocator} input[name="old_password"]`).sendKeys(oldPassword);
            await $(`${formLocator} input[name="new_password"]`).sendKeys(newPassword);
            await $(`${formLocator} input[name="confirm_new_password"]`).sendKeys(newPassword);
            await $(`${formLocator} button`).click();
            await qaHelper.toBeVisible(
                loginPage.elements.successAlert,
                15000,
                "new password was not saved",
            );
            expect(await loginPage.elements.successAlert.getText()).toEqual(
                "You have changed your password, please login with new password",
            );
        });

        it("logs in with new password id5302", async () => {
            await loginPage.logInAccount(user.email, newPassword);
            await settingsPage.go();
            await settingsPage.checkPageLoadedLoggedIn();
        });

        it("should not be able to log in with old password id5303", async () => {
            await loginPage.logInAccount(user.email, oldPassword, true);
            await loginPage.checkPageLoaded();
        });
    });

    describe("Delete account", () => {
        const activeDeleteButton = $('button[data-target="#deleteAccountModal"]');
        const inactiveDeleteButton = $('button[data-target="#deleteAccountModal"][disabled]');
        const firstDeletionReason = $(".qa-delete-reason-first");
        const lastDeletionReason = $(".qa-delete-reason-last");
        const reasonText = $(".qa-delete-reason-textarea");
        const submitDeletionFormButton = $(".qa-delete-request-submit");
        const confirmationLinkSentText = $(".qa-delete-account-toaster .Toastify__toast .Toastify__toast-body > div");
        const deleteConfirmationModalButton = $(".qa-delete-account-modal-submit");
        const deleteConfirmationModal = $(".qa-delete-account-modal");
        const save = async () => {
            await browser.sleep(100);
            await submitDeletionFormButton.click();
        };
        const openSecurityPage = async () => {
            await settingsPage.go();
            await settingsPage.checkPageLoadedLoggedIn();
            await settingsPage.openSecurityTab();
        };
        const saveAndCheckIfSavedSuccessfully = async () => {
            await save();
            await qaHelper.toBeVisible(
                deleteConfirmationModal,
                10000,
                "Account delete confirmation modal window is not appeared",
            );
            await deleteConfirmationModalButton.click();
            await qaHelper.toBeVisible(
                confirmationLinkSentText,
                15000,
                "Account deletion request confirmation text (toaster) is not appeared",
            );
        };

        beforeEach(async () => {
            user = await qaHelper.createRandomUser();
            await qaHelper.activateEmail(user.id);
            await loginPage.logInAccount(user.email);
            await openSecurityPage();
            await qaHelper.scrollToElement(activeDeleteButton);
            await activeDeleteButton.click();
            await qaHelper.toBeVisible(firstDeletionReason, 15000, "do not see the deletion form");
            await browser.sleep(500);
        });

        // with a reason that doesn't require a text
        it("deletes active account without money id2571", async () => {
            await firstDeletionReason.click();
            await saveAndCheckIfSavedSuccessfully();
        });

        // with a reason that requires a text
        it("deletes active account without money id2571", async () => {
            await lastDeletionReason.click();
            await reasonText.sendKeys("12345678901");
            await saveAndCheckIfSavedSuccessfully();
            expect(await confirmationLinkSentText.getText()).toBe(
                "Click the link we’ve sent to your email to confirm that you want to close your Paxful account.",
            );
        });

        // check required text length
        xit("deletes active account without money id2571", async () => {
            await lastDeletionReason.click();
            await reasonText.sendKeys("1234567890");
            await saveAndCheckIfSavedSuccessfully();
        });

        // try to save without selected reason
    });
});
