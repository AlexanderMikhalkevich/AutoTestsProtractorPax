import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import createOfferPage from "../../../../pages/createOfferPO";
import { ElementFinder } from "protractor";

describe("Create sell offer - Step 1", () => {
    beforeAll(async () => {
        const user = await qaHelper.createRandomUser();
        await qaHelper.toggleKycVerification(user.id, {id: true, document: false});
        await loginPage.logInAccount(user.email);
        await createOfferPage.navigateToCreateOfferPage();
    });

    it("allows to choose different payment groups and the associated payment methods id978", async () => {
        const groups: [string, ElementFinder, string][] = [
            ["Bank Transfers", createOfferPage.elements.bankTransfers, "Nigeria Bank Transfers"],
            ["Online Wallets", createOfferPage.elements.onlineWallets, "Trump Coin"],
            ["Gift Cards", createOfferPage.elements.giftCards, "Amazon Gift Card"],
            ["Cash Payment", createOfferPage.elements.cashDeposits, "Western Union"],
            ["Debit/Credit Cards", createOfferPage.elements.debitCreditCards, "ApplePay"],
            ["Digital Currencies", createOfferPage.elements.digitalCurrencies, "Ethereum ETH"],
        ];

        for (const group of groups) {
            const [paymentGroupName, paymentGroupElement, paymentMethodName] = group;
            await createOfferPage.elements.paymentMethodsShowAllButton.click();

            await createOfferPage.elements.paymentMethodsBackButton
                .isPresent()
                .then(async (result) => {
                    if (result) {
                        await createOfferPage.elements.paymentMethodsBackButton.click();
                        await paymentGroupElement.click();
                        await createOfferPage.selectPaymentMethod(paymentMethodName);
                    } else {
                        await paymentGroupElement.click();
                        await createOfferPage.selectPaymentMethod(paymentMethodName);
                    }
                });

            expect(
                await createOfferPage.elements.paymentMethodInputField.getAttribute("value"),
            ).toEqual(paymentMethodName);
            expect(await createOfferPage.elements.willPayText.getText()).toBe(
                `Customers will pay you using ${paymentMethodName} with US Dollar (USD)`,
            );
        }
    });

    it("should verify currency id980", async () => {
        const paymentMethodName = "Ethereum ETH";
        const usd = "US Dollar (USD)";
        const eur = "Euro (EUR)";

        await createOfferPage.selectCurrency(eur);
        expect(await createOfferPage.elements.willPayText.getText()).toBe(
            `Customers will pay you using ${paymentMethodName} with ${eur}`,
        );

        await createOfferPage.selectCurrency(usd);
        expect(await createOfferPage.elements.willPayText.getText()).toBe(
            `Customers will pay you using ${paymentMethodName} with ${usd}`,
        );
    });
});
