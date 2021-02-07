import qaHelper from "../../utils/qaHelper";
import loginPage from "../../pages/loginPO";
import walletPage from '../../pages/walletPO';
import suspendedPage from '../../pages/suspendedPO';
import offerViewPage from "../../pages/offerViewPO";
import { browser } from "protractor";
import bannedPage from "../../pages/bannedPO";
import tradePO from "../../pages/trade/tradePO";

describe('Suspended status -', () => {
    let suspendedUser, partnerUser;
    let sellOffer, buyOffer;
    let activeTrade;

    const internalBitcoinAddress = "myK1zVeS1N3NjfWa3tfYqfc219C6WveCyc";

    beforeAll(async () => {
        suspendedUser = await qaHelper.createRandomUser(true, 2);
        await qaHelper.addBalance(suspendedUser.id, 100000000);

        sellOffer = await qaHelper.createOffer(suspendedUser.id, 'usd', 50, 1, 'sell');
        buyOffer = await qaHelper.createOffer(suspendedUser.id, 'usd', 50, 1, 'buy');

        partnerUser = await qaHelper.createRandomUser(false, 1);

        await qaHelper.removeRestriction(partnerUser.id);
        await qaHelper.addBalance(partnerUser.id, 100000000);

        activeTrade = await qaHelper.startTrade({
            user_id: partnerUser.id,
            offer_hash: sellOffer,
            amount_fiat: 50
        });

        let pastTrade = await qaHelper.startTrade({
            user_id: partnerUser.id,
            offer_hash: sellOffer,
            amount_fiat: 50
        });
        await qaHelper.releaseInTrade(pastTrade.id_hashed);

        await loginPage.logInAccount(suspendedUser.email);
        await walletPage.goLoggedIn();
        await walletPage.pressSendButton();
        await walletPage.internalPrepareSend(0.01, internalBitcoinAddress);
        await walletPage.confirmAndSend();

        await qaHelper.updateUserstatus(suspendedUser.id, 'suspend');
    });

    describe('suspended user', () => {
        beforeAll(async () => {
            await loginPage.logInAccount(suspendedUser.email);
        });

        beforeEach(async () => {
            await suspendedPage.go();
        });

        it('should allow to login and is redirected to /suspended page id6591', async () => {
            expect(await loginPage.isLoggedIn()).toBeTruthy();
        });

        it('should allow to export transactions if they are present id6593', async () => {
            await suspendedPage.elements.exportTransactionsButton.click();
            await qaHelper.toBeVisible(
                suspendedPage.elements.exportSuccessfulMessages.first(),
                10000,
                "Successful transactions export message is not visible",
            );
            expect(await suspendedPage.elements.exportSuccessfulMessages.first().getText()).toContain(suspendedPage.text.exportTransactionsSuccessful);
        });

        it('should allow to export trades if they are present id6595', async () => {
            await suspendedPage.elements.exportTradesButton.click();
            await qaHelper.toBeVisible(
                suspendedPage.elements.exportSuccessfulMessages.get(1),
                10000,
                "Successful trades export message is not visible",
            );
            expect(await suspendedPage.elements.exportSuccessfulMessages.get(1).getText()).toContain(suspendedPage.text.exportTradesSuccessful);
        });

        it('should not allow to open trade page id10987', async () => {
            await tradePO.openTrade(activeTrade.id_hashed, false);
            let isOnSuspendedPage = await suspendedPage.isOnSuspendedPage();
            expect(isOnSuspendedPage).toBeTruthy();
        });
    });

    describe('not suspended user', () => {
        let notSuspendedUser;

        beforeAll(async () => {
            notSuspendedUser = await qaHelper.createRandomUser(true, 1);
            await qaHelper.addBalance(notSuspendedUser.id, 100000000);
            await loginPage.logoutUser();
            await loginPage.logInAccount(notSuspendedUser.email);
        });

        it('should not start a sell trade with suspended user id6598', async () => {
            await offerViewPage.openOfferPage(sellOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(suspendedPage.text.cannotStartTradeMessage);
        });

        it('should not start a buy trade with suspended user id6599', async () => {
            await offerViewPage.openOfferPage(buyOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await qaHelper.scrollToElement(offerViewPage.elements.startTradeButton);
            await offerViewPage.elements.startTradeButton.click();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(suspendedPage.text.cannotStartTradeMessage);
        });

        it('should not allow to navigate to /suspended page when user is not suspended id6604', async () => {
            await suspendedPage.goAsNotSuspendedUser();
            await qaHelper.toBeVisible(
                bannedPage.elements.notBannedOrSuspendedMessage,
                5000,
                "Toaster warning message is not visible",
            );
            expect(await bannedPage.elements.notBannedOrSuspendedMessage.getText()).toBe(suspendedPage.text.youAreNotSuspendedMessage);
        });
    });
});
