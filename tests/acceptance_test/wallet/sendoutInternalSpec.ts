import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import walletPage from "../../../pages/walletPO";

describe("Sendout internal", () => {
    let acc;
    let internalWallet;
    let internalWalletUser;

    beforeAll(async () => {
        internalWalletUser = await qaHelper.createRandomUser(true);
        internalWallet = await qaHelper.getUserWallet(internalWalletUser.email);
        acc = await qaHelper.createRandomUser(true);
        await qaHelper.activateEmail(acc.id);
        await qaHelper.togglePhoneVerification(acc.id, "3726000008");
        await qaHelper.toggleKycVerification(acc.id, { id: true });
        await loginPage.logInAccount(acc.email);
    });

    describe("no 2fa", () => {
        beforeAll(async () => {
            await qaHelper.addBalance(acc.id, 10000000);
            await walletPage.goLoggedIn();
            await walletPage.pressSendButton();
        });

        it("should fill all fields for sending bitcoin to internal address id963", async () => {
            await walletPage.internalPrepareSend("0.01", internalWallet);
            await walletPage.confirmAndSend();

            await qaHelper.toBeVisible(
                walletPage.elements.successMessage,
                15000,
                "no success message visible",
            );
            expect(await walletPage.elements.successMessage.getText()).toBe(
                "0.01 BTC has been successfully sent to " + internalWallet,
            );
        });
    });

    describe("sms 2fa", () => {
        beforeAll(async () => {
            await qaHelper.activate2faSms(acc.id);
            await qaHelper.addBalance(acc.id, 10000000);
            await walletPage.goLoggedIn();
            await walletPage.pressSendButton();
        });

        it("should verify that internal sendout with 2fa SMS works id3763", async () => {
            await walletPage.internalPrepareSendWith2Fa("0.01", internalWallet);
            await walletPage.payWith2faSMS();

            await qaHelper.toBeClickable(
                walletPage.elements.successMessage,
                15000,
                "no success message visible",
            );
            expect(await walletPage.elements.successMessage.getText()).toBe(
                "0.01 BTC has been successfully sent to " + internalWallet,
            );
        });
    });

    describe("google 2fa", () => {
        beforeAll(async () => {
            await qaHelper.activate2faGoogle(acc.id);
            await qaHelper.addBalance(acc.id, 10000000);
            await walletPage.goLoggedIn();
            await walletPage.pressSendButton();
        });

        it("should verify that internal sendout with 2fa GA works id3764", async () => {
            await walletPage.internalPrepareSendWith2Fa("0.01", internalWallet);
            await walletPage.payWith2faGA();

            await qaHelper.toBeClickable(
                walletPage.elements.successMessage,
                15000,
                "no success message visible",
            );
            expect(await walletPage.elements.successMessage.getText()).toBe(
                "0.01 BTC has been successfully sent to " + internalWallet,
            );
        });

        it("should verify correct amount deducted id5299", async () => {
            await walletPage.pressSendButton();
            await walletPage.internalPrepareSendWith2Fa("0.01", internalWallet);
            await walletPage.payWith2faGA();

            await qaHelper.toBeClickable(
                walletPage.elements.successMessage,
                15000,
                "no success message visible",
            );
            await qaHelper.toBeVisible(
                walletPage.elements.balance,
                15000,
                "cryptobalance not visible",
            );
            expect(parseFloat(await walletPage.elements.balance.getText()).toString()).toBe("0.09");
        });
    });
});
