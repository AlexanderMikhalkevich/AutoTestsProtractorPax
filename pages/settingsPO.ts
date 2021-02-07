import { $, $$, browser, by, element } from "protractor";

import qaHelper from "../utils/qaHelper";

class SettingsPage {
    elements = {
        addField: $('[placeholder="add new todo here"]'),
        checkedBox: element(by.model("todo.done")),
        addButton: $('[value="add"]'),
        alertMsg: $("style-msg.alertmsg"),
        content: $("#content"),
        accountSettings: $("#profile"),
        phoneInput: $(".intl-tel-input"),
        phoneConfirm: $(".input-group.divcenter.clearfix"),
        firstSecQuestion: $("#security-questions-answers-page-form_1_answer"),
        secondSecQuestion: $("#security-questions-answers-page-form_2_answer"),
        thirdSecQuestion: $("#security-questions-answers-page-form_3_answer"),
        saveSecQuestions: $("#security-questions-answers-page-form button[type='submit']"),
        firstName: $("#first_name"),
        lastName: $("#last_name"),
        bio: $("#bio"),
        notifyEmailField: $("#notifyEmailTradeMessagesInterval"),
        dontNotifyEmail: $("input[name=notifyNotEmailMessages]"),
        soundNotification: $("input[name=soundNotifications]"),
        emailSubscribed: $("input[name=emailSubscribed]"),
        saveButton: $(".qa-settings-submit"),
        preferredCurrencyDropdown: $("#selectFiatCurrencyIdContainer input"),
        preferredCurrencySearchResults: $$(
            "#user-settings > div > div.card.p-3.p-md-4 > form > div.mb-4.d-flex.row > div.col-sm-6.profile-setting-select-currency > div > div.position-relative > div > div > div.css-0 > div > div > div > div:nth-child(2)",
        ),
        preferredCurrencySearchField: $(
            "#user-settings .profile-setting-select-currency .qa-preferred-currency-search-input input",
        ),
        timeZoneDropdown: $("#selectTimezoneContainer input"),
        timeZoneSearchResults: $$(".qa-timezone-dropdown .mb-1"),
        timeZoneSearchField: $(".qa-timezone-dropdown .qa-timezone-search-input input"),
        successMessage: $(".qa-session-message .alert-success"),
        toasterSuccessMessage: $(".qa-session-message .Toastify__toast--success"),
    };

    text = {
        timeZone: "(GMT-11:00) Pacific, Midway",
        currency: "Nigerian Naira",
    };

    async saveButtonScroll() {
        const settingsPage = this.elements;
        await qaHelper.scrollToElement(settingsPage.saveButton);
        await browser.sleep(500);
        await settingsPage.saveButton.click();
        await qaHelper.waitForPageToBeLoaded();
        await qaHelper.toBeVisible(settingsPage.successMessage, 15000, "Can't save settings");
    }

    async verifyPageSave() {
        await qaHelper.toBeVisible(
            this.elements.successMessage,
            2000,
            "Success message is not visible",
        );
    }

    async verifyPageSaveToaster() {
        await qaHelper.toBeVisible(
            this.elements.toasterSuccessMessage,
            5000,
            "Toaster success message is not visible",
        );
    }

    async go() {
        await browser.get(browser.params.baseUrl + "/account"); //overrides baseURL
    }

    async checkPageLoadedNotLoggedIn() {
        await this.elements.alertMsg.isDisplayed();
    }

    async checkPageLoadedLoggedIn() {
        await qaHelper.toBeVisible(
            this.elements.accountSettings,
            15000,
            `Can't open the Settings page`,
        );
    }

    async addSecurityQuestions(linkElement) {
        const elements = this.elements;

        if (linkElement) await linkElement.click();
        else await element(by.linkText("Set answers")).click();

        await browser.sleep(500);
        await elements.firstSecQuestion.sendKeys("test1");
        await elements.secondSecQuestion.sendKeys("test2");
        await elements.thirdSecQuestion.sendKeys("test3");
        await elements.saveSecQuestions.click();
        await browser.sleep(500);
        await this.verifyPageSaveToaster();
    }

    async addBioInSettings() {
        await browser.sleep(500);
        await this.elements.bio.sendKeys("bio");
        await this.saveButtonScroll();
        await this.verifyPageSave();
    }

    async openTab(tabQaId) {
        await qaHelper.scrollToTop();
        await $(`.qa-tabs-left li > .${tabQaId}`).click();
    }

    async openProfileTab() {
        await this.openTab("qa-sidebar-item-profile");
        await qaHelper.toBeVisible(
            $(".qa-sidebar-item-profile"),
            15000,
            "Profile tab is not visible",
        );
    }

    async openSecurityTab() {
        await this.openTab("qa-sidebar-item-security");
        await qaHelper.toBeVisible(
            $(".qa-sidebar-item-security"),
            15000,
            "Security tab is not visible",
        );
    }

    async openDeveloperTab() {
        await this.openTab("qa-sidebar-item-developer");
        await qaHelper.toBeVisible(
            $(".qa-sidebar-item-developer"),
            15000,
            "Developer tab is not visible",
        );
    }

    async openSecurityQuestionsTab() {
        await this.openTab("qa-sidebar-item-security-questions");
        await qaHelper.toBeVisible(
            $(".qa-sidebar-item-security-questions"),
            15000,
            "Security questions tab is not visible",
        );
    }

    async openVerificationTab() {
        await browser.get(browser.params.baseUrl + "/account/verification");
        await qaHelper.toBeVisible(
            $(".qa-verification-title"),
            15000,
            "Verification tab is not visible",
        );
    }

    async selectTimeZone(timezone: string) {
        await this.elements.timeZoneDropdown.click();
        await this.elements.timeZoneSearchField.sendKeys(timezone);
        await qaHelper.toBeVisible(
            this.elements.timeZoneSearchResults.first(),
            1000,
            "Timezone search result element is not visible",
        );
        await this.elements.timeZoneSearchResults.first().click();
    }

    async selectCurrency(currency: string) {
        await this.elements.preferredCurrencyDropdown.click();
        await this.elements.preferredCurrencySearchField.sendKeys(currency);
        await qaHelper.toBeVisible(
            this.elements.preferredCurrencySearchResults.first(),
            1000,
            "Currency search result element is not visible",
        );
        await this.elements.preferredCurrencySearchResults.first().click();
    }
}

export default new SettingsPage();
