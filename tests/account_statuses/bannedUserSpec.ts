import { browser } from "protractor";
import qaHelper from '../../utils/qaHelper';
import loginPage from '../../pages/loginPO';
import bannedPage from '../../pages/bannedPO';
import walletPage from '../../pages/walletPO';
import settingsPage from '../../pages/settingsPO';
import offerViewPage from "../../pages/offerViewPO";
import tradePO from "../../pages/trade/tradePO";

describe('Ban status -', () => {
    let bannedTrader, sellOffer, buyOffer, activeTrade; //user with trades, transactions and balance
    let notBannedUser;
    const internalBitcoinAddress = "myK1zVeS1N3NjfWa3tfYqfc219C6WveCyc";

    beforeAll(async () => {
        bannedTrader = await qaHelper.createRandomUser(true, 2);
        await qaHelper.addBalance(bannedTrader.id, 100000000);
        sellOffer = await qaHelper.createOffer(bannedTrader.id, 'usd', 500, 1, 'sell');
        buyOffer = await qaHelper.createOffer(bannedTrader.id, 'usd', 500, 1, 'buy');

        notBannedUser = await qaHelper.createRandomUser(false, 1);
        await qaHelper.removeRestriction(notBannedUser.id);
        await qaHelper.addBalance(notBannedUser.id, 100000000);

        activeTrade = await qaHelper.startTrade({
            user_id: notBannedUser.id,
            offer_hash: sellOffer,
            amount_fiat: 500
        });

        let pastTrade = await qaHelper.startTrade({
            user_id: notBannedUser.id,
            offer_hash: sellOffer,
            amount_fiat: 500
        });

        await qaHelper.releaseInTrade(pastTrade.id_hashed);

        //create transaction to export
        await loginPage.logInAccount(bannedTrader.email);
        await walletPage.goLoggedIn();
        await walletPage.pressSendButton();
        await walletPage.internalPrepareSend(0.01, internalBitcoinAddress);
        await walletPage.confirmAndSend();

        await qaHelper.updateUserstatus(bannedTrader.id, 'banned');
    });

    describe('banned user with no balance and no trades', () => {
        let emptyBannedUser;
        beforeAll(async () => {
            emptyBannedUser = await qaHelper.createRandomUser(false, 1);
            await qaHelper.updateUserstatus(emptyBannedUser.id, 'banned');
            await loginPage.logInAccount(emptyBannedUser.email);
        });

        it('should allow banned user to login and user is redirected to /banned page id6571', async () => {
            expect(await loginPage.isLoggedIn()).toBeTruthy();
            expect(await bannedPage.isOnBannedPage()).toBeTruthy();
        });

        it('should allow to access /verificaiton page if user is banned id6581', async () => {
            await settingsPage.openVerificationTab();
        });

        it('should redirect to /banned page by learn more link  id6606', async () => { //one test because here is only one action - click on learn more.
            await browser.get(browser.params.baseUrl);
            expect(await bannedPage.elements.bannedMessageOnHomePage.getText()).toContain(bannedPage.text.yourAccountBanned);
            await bannedPage.elements.learnMoreOnHomePage.click();
            expect(await bannedPage.isOnBannedPage()).toBeTruthy();
        });

        it('should allow to delete account if balance == 0 id6578', async () => {
            await bannedPage.elements.deleteAccountButton.click();
            await bannedPage.submitDeleteAccountRequest();
            expect(await bannedPage.elements.deleteConfirmationDiv.getText()).toBe(bannedPage.text.deleteAccountConfirmation);
        });

        //screenshot testing somewhere here should be performed: header, footer, exports, delete account.
    });

    describe('banned user with trades and balance', () => {
        beforeAll(async () => {
            await loginPage.logInAccount(bannedTrader.email);
        });

        beforeEach(async () => {
            await loginPage.logInAccount(bannedTrader.email);
            await qaHelper.addBalance(bannedTrader.id, 100000000);
            await bannedPage.go();
        });

        afterAll(async () => {
            await qaHelper.addBalance(bannedTrader.id, 100000000);
        });

        it('should allow banned user to withdraw bitcoins on external address if balance > 0 id3507', async () => {
            const btcAddress = 'mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt';
            await bannedPage.elements.inputBTCAddress.sendKeys(btcAddress);
            await bannedPage.elements.transferBTCButton.click();
            expect(await bannedPage.isOnBannedPage()).toBeTruthy();
            expect(await bannedPage.elements.flushMessage.getText()).toContain(bannedPage.text.successfulSendOutMessage + btcAddress);
        });

        it('should allow to export transaction if they are present id6574', async () => {
            await bannedPage.elements.exportTransactionsButton.click();
            await qaHelper.toBeVisible(
                bannedPage.elements.exportSuccessfulMessages.first(),
                10000,
                "Successful transactions export message is not visible",
            );
            expect(await bannedPage.elements.exportSuccessfulMessages.first().getText()).toContain(bannedPage.text.exportTransactionsSuccessful);
        });

        it('should allow to export trades if they are present id6576', async () => {
            await bannedPage.elements.exportTradesButton.click();
            await qaHelper.toBeVisible(
                bannedPage.elements.exportSuccessfulMessages.get(1),
                10000,
                "Successful trades export message is not visible",
            );
            expect(await bannedPage.elements.exportSuccessfulMessages.get(1).getText()).toContain(bannedPage.text.exportTradesSuccessful);
        });

        it('should not allow to open active trade page if user is banned id6605', async () => {
            await tradePO.openTrade(activeTrade.id_hashed, false);
            expect(await bannedPage.isOnBannedPage()).toBeTruthy();
        });
    });

    describe('not banned user', () => {
        beforeAll(async () => {
            await loginPage.logInAccount(notBannedUser.email);
        });

        it('should not give access to /banned id6603', async () => {
            await loginPage.logInAccount(notBannedUser.email);
            await bannedPage.goAsNotBannedUser();

            await qaHelper.toBeVisible(
                bannedPage.elements.notBannedOrSuspendedMessage,
                5000,
                "Toaster warning message is not visible",
            );

            expect(await bannedPage.elements.notBannedOrSuspendedMessage.getText()).toBe(bannedPage.text.notBannedMessage);
        });

        it('should not start a sell trade with banned user id6584', async () => {
            await offerViewPage.openOfferPage(sellOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(bannedPage.text.cannotStartTradeMessage);
        });

        it('should not start a buy trade with banned user id6585', async () => {
            await offerViewPage.openOfferPage(buyOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(bannedPage.text.cannotStartTradeMessage);
        });
    });
});
