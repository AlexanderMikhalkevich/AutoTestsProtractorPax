import { browser, $, $$ } from "protractor";

class SuspendedPage {
    elements = {
        exportTransactionsButton: $("[data-target-form='completed_transactions_export_form']"),
        exportTradesButton: $("[data-target-form='completed_trades_export_form']"),
        exportSuccessfulMessages: $$(".js-export-finished-block"),
    };

    text = {
        exportTransactionsSuccessful: "All transactions exported ",
        cannotStartTradeMessage: "You cannot start a trade with this vendor.",
        youAreNotSuspendedMessage: "You are not suspended.",
        exportTradesSuccessful: "All trades exported ",
    };

    async go(): Promise<void> {
        await browser.get(browser.params.baseUrl + "/suspended");
        expect(await this.isOnSuspendedPage()).toBeTruthy();
    }

    async goAsNotSuspendedUser(): Promise<void> {
        await browser.get(browser.params.baseUrl + "/suspended");
        expect(await this.isOnSuspendedPage()).toBeFalsy();
    }

    async isOnSuspendedPage(): Promise<boolean> {
        return (await browser.getCurrentUrl()) == browser.params.baseUrl + "/suspended";
    }
}

export default new SuspendedPage();
