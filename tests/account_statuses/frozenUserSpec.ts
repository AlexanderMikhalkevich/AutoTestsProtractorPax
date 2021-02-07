import qaHelper from "../../utils/qaHelper";
import loginPage from "../../pages/loginPO";
import dashboardPage from "../../pages/dashboardPO";
import walletPage from "../../pages/walletPO";
import offerViewPage from "../../pages/offerViewPO";
import tradePage from "../../pages/trade/tradePO";
import reactTradePage from "../../pages/trade/reactTradePO";
import { browser } from "protractor";

describe("Frozen status -", () => {
    let frozenUser, notFrozenUser, activeTradeUser;
    let frozenSellOffer, frozenBuyOffer, notFrozenSellOffer, notFrozenBuyOffer;
    let activeTrade;

    const internalBitcoinAddress = "myK1zVeS1N3NjfWa3tfYqfc219C6WveCyc";

    const text = {
        frozenMessageTitle: "Your account has been frozen",
        cannotSendOutMessage: "Your account is frozen and you can't send out Bitcoin.",
        cannotReleaseInTradeMessage: "Your account is frozen, can't release coins.",
        cannotStartTradeByFrozenMessage: "Your account is frozen, you can't start a trade.",
        cannotStartTradeWithFrozenMessage: "You cannot start a trade with this vendor.",
    };

    beforeAll(async () => {
        frozenUser = await qaHelper.createRandomUser(true, 2);
        await qaHelper.addBalance(frozenUser.id, 100000000);

        notFrozenUser = await qaHelper.createRandomUser(true, 2);
        await qaHelper.addBalance(notFrozenUser.id, 100000000);

        frozenSellOffer = await qaHelper.createOffer(frozenUser.id, "usd", 500, 1, "sell");
        frozenBuyOffer = await qaHelper.createOffer(frozenUser.id, "usd", 500, 1, "buy");

        notFrozenSellOffer = await qaHelper.createOffer(notFrozenUser.id, "usd", 500, 1, "sell");
        notFrozenBuyOffer = await qaHelper.createOffer(notFrozenUser.id, "usd", 500, 1, "buy");

        activeTradeUser = await qaHelper.createRandomUser(false, 1);

        activeTrade = await qaHelper.startTrade({
            user_id: activeTradeUser.id,
            offer_hash: frozenSellOffer,
            amount_fiat: 500,
        });

        await qaHelper.updateUserstatus(frozenUser.id, "frozen");
    });

    describe("frozen user", () => {
        beforeAll(async () => {
            await loginPage.logInAccount(frozenUser.email);
        });

        it("should allow to login and shows frozen message id6588", async () => {
            expect(await loginPage.isLoggedIn()).toBeTruthy();
            expect(
                await dashboardPage.elements.vendorDashboardPage.frozenMessageTitle.getText(),
            ).toBe(text.frozenMessageTitle);
        });

        it("should not allow to sendout Bitcoin id6586", async () => {
            await walletPage.goLoggedIn();
            await walletPage.pressSendButton();
            await walletPage.internalPrepareSend(0.01, internalBitcoinAddress);
            await qaHelper.toBeVisible(
                walletPage.elements.alertRedInWalletModal,
                15000,
                'Error "frozen cannot send out" has not appeared',
            );
            expect(await walletPage.elements.alertRedInWalletModal.getText()).toBe(
                text.cannotSendOutMessage,
            );
        });

        it("should not allow to release in active trade id6587", async () => {
            await tradePage.openTrade(activeTrade.id_hashed);
            await tradePage.closeNotificationWithLessThan20Trade();
            await tradePage.pressReleaseBitcoinsButton();
            await tradePage.pressIGotItBeforeBitcoinRelease();
            await tradePage.confirmReleaseBitcoins();
            expect(await tradePage.elements.alert.getText()).toContain(
                text.cannotReleaseInTradeMessage,
            );
        });

        it("should not allow to release in active trade (NEW TRADE PAGE) id6587", async () => {
            qaHelper.enableNewTradeForUser(frozenUser.id);
            qaHelper.toggleNewTradePageInSettings(1);
            // need to clear local storage item because before this tests case we have similar test where modal already appear
            await browser.executeScript(
                `window.localStorage.removeItem('protection-warning-modal-${frozenUser.id}')`,
            );

            await reactTradePage.openTrade(activeTrade.id_hashed);
            await reactTradePage.closeNotificationWithLessThan20Trade();
            await reactTradePage.pressReleaseBitcoinsButton();
            await reactTradePage.pressIGotItBeforeBitcoinRelease();
            await reactTradePage.confirmReleaseBitcoins();
            await qaHelper.toBeVisible(
                reactTradePage.elements.releaseBitcoinError,
                15000,
                "Release coins error not visible",
            );
            expect(await reactTradePage.elements.releaseBitcoinError.getText()).toContain(
                text.cannotReleaseInTradeMessage,
            );
            qaHelper.toggleNewTradePageInSettings(0);
        });

        it("should not allow frozen user to start a trade with sell offer id6589", async () => {
            await offerViewPage.openOfferPage(notFrozenSellOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(
                text.cannotStartTradeByFrozenMessage,
            );
        });

        it("should not allow frozen user to start a trade with sell offer id6590", async () => {
            await offerViewPage.openOfferPage(notFrozenBuyOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(
                text.cannotStartTradeByFrozenMessage,
            );
        });
    });

    describe("not frozen user", () => {
        beforeAll(async () => {
            await loginPage.logInAccount(notFrozenUser.email);
        });

        it("should not allow to start a trade with frozen sell offer id6582", async () => {
            await offerViewPage.openOfferPage(frozenSellOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(
                text.cannotStartTradeWithFrozenMessage,
            );
        });

        it("should not allow to start a trade with frozen buy offer id6583", async () => {
            await offerViewPage.openOfferPage(frozenBuyOffer);
            await offerViewPage.chooseLastOptionInFixedAmountList();
            await offerViewPage.clickStartTradeButton();
            expect(await offerViewPage.elements.alertCannotStartTrade.getText()).toBe(
                text.cannotStartTradeWithFrozenMessage,
            );
        });
    });
});
