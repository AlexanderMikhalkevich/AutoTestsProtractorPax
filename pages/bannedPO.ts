import { $, $$, browser, by, element } from "protractor";

class BannedPage {
    elements = {
        bannedPageTitle: $("#banned"),
        bitcoinAddress: $(".form-control"),
        buttonSend: $(".btn.button.ladda-button.btn-lg.btn-primary.pull-right.nomargin"),
        message: $(".sb-msg"),
        deleteAccountForm: $(".modal-content"),
        reasonDeletingAccount: element(
            by.xpath(".//label/input[@value='I have privacy concerns']"),
        ),
        tellUsMore: $(".form-control.limited-length"),
        buttonSendRequest: $(".btn.btn-success"),
        amount: $("p.form-control-static"),
        confirmationRequestSent: $(".help-block.alert.alert-warning"),
        notBannedOrSuspendedMessage: $(".qa-session-message .Toastify__toast--warning"),
        widthdrawalDiv: $(".banned_user__infoblock.banned_user__withdrawal"),
        deleteAccountDiv: $(".banned_user__infoblock.banned_user__account_deleting"),
        exportTransactionsButton: $("[data-target-form='completed_transactions_export_form']"),
        exportTradesButton: $("[data-target-form='completed_trades_export_form']"),
        transferBTCButton: $("#banned_user_page__btc_withdrawal_section .c-button__content"),
        inputBTCAddress: $("#banned_user_page__btc_address"),
        flushMessage: $(".alert.alert-success div"),
        bannedMessageOnHomePage: $(".qa-banned-alert-title"),
        learnMoreOnHomePage: $(".qa-banned-alert a"),
        deleteAccountButton: $(".qa-delete-account-button"),
        deleteAccountReasonFirst: $$("label.labelPretty").first(),
        deleteAccountSubmitButton: $(".qa-delete-account-submit-button"),
        deleteConfirmationDiv: $("div.user_notification p"),
        exportSuccessfulMessages: $$(".js-export-finished-block"),
    };

    text = {
        notBannedMessage: "You are not banned.",
        successfulSendOutMessage: "1 BTC has been successfully sent to ",
        exportTransactionsSuccessful: "All transactions exported",
        exportTradesSuccessful: "All trades exported",
        yourAccountBanned: "Your account has been banned.",
        deleteAccountConfirmation:
            "We've sent you an email with a confirmation link." +
            " Please open the email and click the link to confirm closing your account.",
        cannotStartTradeMessage: "You cannot start a trade with this vendor.",
    };

    async go() {
        await browser.get(browser.params.baseUrl + "/banned"); //overrides baseURL
        expect(await this.isOnBannedPage()).toBeTruthy();
    }

    async isOnBannedPage(): Promise<boolean> {
        return (await browser.getCurrentUrl()) == browser.params.baseUrl + "/banned";
    }

    async goAsNotBannedUser() {
        await browser.get(browser.params.baseUrl + "/banned");
        expect(await this.isOnBannedPage()).toBeFalsy();
    }

    async checkPageLoaded() {
        await this.elements.bannedPageTitle.isDisplayed();
    }

    async checkMessageDisplayed(text) {
        const message = this.elements.message;
        expect(await message.getText()).toBe(text);
    }

    async sendOutBeforeDelete() {
        const elements = this.elements;
        await elements.bitcoinAddress.sendKeys("myK1zVeS1N3NjfWa3tfYqfc219C6WveCyc");
        await elements.buttonSend.click();
    }

    async submitDeleteAccountRequest() {
        const elements = this.elements;
        await elements.deleteAccountReasonFirst.click();
        await elements.deleteAccountSubmitButton.click();
    }
}

export default new BannedPage();
