import loginPage from "../../../pages/loginPO";
import walletPage from "../../../pages/walletPO";
import qaHelper from "../../../utils/qaHelper";

describe("Sendout external", () => {
    let acc;

    beforeAll(async () => {
        acc = await qaHelper.createRandomUser(true);
        await qaHelper.activateEmail(acc.id);
        await qaHelper.togglePhoneVerification(acc.id, "3726000008");
        await qaHelper.toggleKycVerification(acc.id, { id: true, document: true });
        await loginPage.logInAccount(acc.email);
    });

    describe("no 2fa", () => {
        beforeEach(async () => {
            await qaHelper.addBalance(acc.id, 10000000);
            await walletPage.goLoggedIn();
        });

        it("should fill all fields for sending Bitcoin to external address id5262", async () => {
            await walletPage.externalPrepareSend("0.001", "mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt");
            await walletPage.confirmAndSend();
            await qaHelper.toBeVisible(
                walletPage.elements.externalSuccessMessage,
                15000,
                "success payment message not visible",
            );
            expect(await walletPage.elements.externalSuccessMessage.getText()).toEqual(
                "0.001 BTC has been successfully sent to mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt.",
            );
        });

        it("should verify that miners fee is added id3768", async () => {
            await walletPage.externalPrepareSend("0.001", "mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt");
            await qaHelper.toBeVisible(
                walletPage.elements.totalAmount,
                15000,
                "total amount is not visible",
            );
            await qaHelper.toBeVisible(
                walletPage.elements.totalAmountCurrencyCode,
                15000,
                "total amount currency code is not visible",
            );

            expect(await walletPage.elements.totalAmount.getText()).toBe("0.00108 BTC");
            expect(await walletPage.elements.minersFee.getText()).toBe("0.00008");
        });

        it("should verify it will adjust amount if user tries to send more than he has id5301", async () => {
            await walletPage.externalPrepareSend("0.1", "mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt");
            await qaHelper.toBeVisible(
                walletPage.elements.adjustWarning,
                15000,
                "adjust warning message is not visible",
            );
            await qaHelper.textPresent(
                walletPage.elements.adjustAmount,
                "0.0004",
                5000,
                "adjust amount is not visible",
            );

            expect(await walletPage.elements.adjustWarning.getText()).toBe(
                'Note: You do not have enough to send "0.1 BTC." This is because you need to pay "0.0004 BTC" in Bitcoin network fee. Your total sendout amount has been adjusted below.',
            );
        });
    });

    describe("sms 2fa", () => {
        beforeAll(async () => {
            await qaHelper.activate2faSms(acc.id);
        });

        beforeEach(async () => {
            await qaHelper.addBalance(acc.id, 10000000);
            await walletPage.goLoggedIn();
            await walletPage.pressSendButton();
        });

        it("should verify that external sendout with 2fa SMS works id5297", async () => {
            await walletPage.externalPrepareSendWith2fa(
                "0.001",
                "mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt",
            );
            await walletPage.payWith2faSMS();
            await qaHelper.toBeClickable(
                walletPage.elements.successMessage,
                25000,
                "no success message visible",
            );

            expect(await walletPage.elements.externalSuccessMessage.getText()).toEqual(
                "0.001 BTC has been successfully sent to mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt.",
            );
        });
    });

    describe("google 2fa", () => {
        beforeAll(async () => {
            await qaHelper.activate2faGoogle(acc.id);
        });

        beforeEach(async () => {
            await qaHelper.addBalance(acc.id, 10000000);
            await walletPage.goLoggedIn();
            await walletPage.pressSendButton();
        });

        it("should verify that external sendout with 2fa GA works id5298", async () => {
            await walletPage.externalPrepareSendWith2fa(
                "0.001",
                "mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt",
            );
            await walletPage.payWith2faGA();
            await qaHelper.toBeClickable(
                walletPage.elements.successMessage,
                25000,
                "no success message visible",
            );

            expect(await walletPage.elements.externalSuccessMessage.getText()).toEqual(
                "0.001 BTC has been successfully sent to mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt.",
            );
        });
    });
});
