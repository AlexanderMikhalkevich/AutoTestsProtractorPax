import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import walletPage from "../../../pages/walletPO";

describe("Sendout modal", () => {
    let acc;

    beforeAll(async () => {
        acc = await qaHelper.createRandomUser(true);
        await qaHelper.addBalance(acc.id, 10000000);
        await qaHelper.activateEmail(acc.id);
        await qaHelper.togglePhoneVerification(acc.id, "3726000008");
        await qaHelper.toggleKycVerification(acc.id, { id: true });
        await loginPage.logInAccount(acc.email);
    });

    beforeEach(async () => {
        await walletPage.goLoggedIn();
        await walletPage.pressSendButton();
    });

    it("should verify error message for incorrect password id5264", async () => {
        await walletPage.incorrectPassword();
        expect(await walletPage.elements.alertRedInWalletModal.getText()).toBe(
            "Incorrect password.",
        );
    });

    it("should verify error for incorrect btc address id5265", async () => {
        await walletPage.btcAddressError();
        expect(await walletPage.elements.alertRedInWalletModal.getText()).toBe(
            "Unknown Bitcoin address.",
        );
    });

    it("should verify error message for enter amount id5266", async () => {
        await walletPage.enterAmountError();
        expect(await walletPage.elements.alertRedInWalletModal.getText()).toBe(
            "Please enter amount you wish to send out.",
        );
    });

    it("should verify error for can not send more than current balance id5267", async () => {
        await walletPage.canNotSendMoreThanCurrentError();
        expect(await walletPage.elements.alertRedInWalletModal.getText()).toBe(
            "Can not send more than current balance.",
        );
    });

    it("should verify error for more than your balance choosen id5268", async () => {
        await walletPage.moreThanYourBalanceError();
        expect(await walletPage.elements.btcAmountInputError.isDisplayed()).toBe(true);
    });

    it("should verify error incorrect 2fa code id5269", async () => {
        await qaHelper.activate2faGoogle(acc.id);
        await walletPage.incorrect2faError();
        expect(await walletPage.elements.alertRedInWalletModal.getText()).toBe(
            "Incorrect 2FA code. Please try again.",
        );
    });

    it("should verify cant send Bitcoin to your own wallet id5270", async () => {
        await walletPage.sendToYourAdressError();
        expect(await walletPage.elements.alertRedInWalletModal.getText()).toBe(
            "You can not send Bitcoin to one of your own Paxful Bitcoin addresses.",
        );
    });

    //TODO: add more tests for other currency switcher options (options added in ALPHA-1566)

    it("should verify currency switch works id5271", async () => {
        await walletPage.currencySwitchInModal();
        expect(await walletPage.elements.currencyName.getText()).toBe("USD Amount");
    });

    xit("does not show the password field in case of enabled sms/google 2fa");
});
