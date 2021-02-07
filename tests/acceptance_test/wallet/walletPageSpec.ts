import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import walletPage from "../../../pages/walletPO";
import { browser } from "protractor";

describe("Wallet Page", () => {
    beforeAll(async () => {
        const acc = await qaHelper.createRandomUser(true);
        await qaHelper.addBalance(acc.id, 10000000);
        await qaHelper.activateEmail(acc.id);
        await qaHelper.togglePhoneVerification(acc.id, "3726000008");
        await qaHelper.toggleKycVerification(acc.id, { id: true });
        await loginPage.logInAccount(acc.email);
    });

    beforeEach(async () => {
        await walletPage.goLoggedIn();
    });

    // it("should click qr code id958", async () => {
    //     await walletPage.qrCodeButton();
    // });

    //Users should not be able to generate addresses without deposits.
    // it("should click generate new address id959", async () => {
    //     const oldAdr = await walletPage.elements.permanentBtcAdress.getText();
    //     await walletPage.generateNewAdress();
    //     await browser.sleep(1000);
    //     const newAdr = await walletPage.elements.newAddress.getAttribute("title");
    //     expect(oldAdr).not.toBe(newAdr);
    // });

    it("should click send bitcoin button works id961", async () => {
        await walletPage.pressSendButton();
    });

    // it("should click copy address id968", async () => {
    //     await walletPage.copyAddressButton();
    // });
});

describe("Wallet page with transactions", () => {
    let acc;
    let internalWallet;

    beforeAll(async () => {
        const internalWalletUser = await qaHelper.createRandomUser(true);
        internalWallet = await qaHelper.getUserWallet(internalWalletUser.email);
        acc = await qaHelper.createRandomUser(true);
        await loginPage.logInAccount(acc.email);
        await qaHelper.addBalance(acc.id, 10000000);
        await qaHelper.activateEmail(acc.id);
        await qaHelper.togglePhoneVerification(acc.id, "3726000008");
        await qaHelper.toggleKycVerification(acc.id, { id: true });
        await walletPage.goLoggedIn();
        await walletPage.pressSendButton();
        await walletPage.internalPrepareSend("0.01", internalWallet);
        await walletPage.confirmAndSend();
        await qaHelper.toBeVisible(
            walletPage.elements.successMessage,
            15000,
            "no success message visible",
        );
    });

    // TODO add extra tests for the table
    it("should verify transactions are present id969", async () => {
        await walletPage.elements.walletTabs.last().click();
        await walletPage.elements.transactionTabLink.click();
        await qaHelper.toBeVisible(walletPage.elements.usdDenomination, 15000, "denomination usd not visible");
        expect(await walletPage.elements.transactionsListItems.count()).toEqual(1);
    });
});
