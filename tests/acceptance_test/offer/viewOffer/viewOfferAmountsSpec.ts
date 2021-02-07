import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import offerViewPage from "../../../../pages/offerViewPO";
import tradePO from "../../../../pages/trade/tradePO";
import reactTradePO from "../../../../pages/trade/reactTradePO";

describe("when entering different amounts (offer range is 450 - 500)", () => {
    let stranger, offersOwner;
    let sellOfferHash, buyOfferHash;

    beforeAll(async () => {
        offersOwner = await qaHelper.createRandomUser(true);
        await qaHelper.addBalance(offersOwner.id, 1000000000);
        await qaHelper.activateEmail(offersOwner.id);
        await qaHelper.togglePhoneVerification(offersOwner.id, "+3726000011");
        await qaHelper.toggleKycVerification(offersOwner.id);
        await qaHelper.depositBond(offersOwner.id);
        sellOfferHash = await qaHelper.createSpecificOffer({
            user_id: offersOwner.id,
            type: "sell",
            range_min: 450,
            range_max: 500,
        });
        buyOfferHash = await qaHelper.createSpecificOffer({
            user_id: offersOwner.id,
            type: "buy",
            range_min: 450,
            range_max: 500,
        });

        stranger = await qaHelper.createRandomUser(true);
        await qaHelper.activateEmail(stranger.id);
        await qaHelper.togglePhoneVerification(stranger.id, "+3726000004");
        await qaHelper.addBalance(stranger.id, 1000000000);
        await qaHelper.removeRestriction(stranger.id);
        await loginPage.logInAccount(stranger.email);
    });

    describe("", () => {
        beforeEach(async () => {
            await offerViewPage.openOfferPage(sellOfferHash);
        });

        it("should disable start trade button when entering invalid amount : 0 id5321", async () => {
            await offerViewPage.elements.amountFiatField.sendKeys("0");
            expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
        });

        it("should disable start trade button when entering invalid amount : 1 id5324", async () => {
            await offerViewPage.elements.amountFiatField.sendKeys("1");
            expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
        });

        it("should disable start trade button when entering invalid amount : 449 id5322", async () => {
            await offerViewPage.elements.amountFiatField.sendKeys("449");
            expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
        });

        it("should disable start trade button when entering invalid amount : 501 id5323", async () => {
            await offerViewPage.elements.amountFiatField.sendKeys("501");
            expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
        });

        it("should skip the minus symbol when trying to enter a negative value id5325", async () => {
            await offerViewPage.elements.amountFiatField.sendKeys("-500");
            expect(await offerViewPage.elements.amountFiatField.getAttribute("value")).toEqual(
                "500",
            );
            expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(true);
        });

        xit("should disable start trade button when entering invalid amount : string id6558", async () => {
            await offerViewPage.elements.amountFiatField.sendKeys("string");
            expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
        });
    });

    describe("", () => {
        afterEach(async () => {
            await qaHelper.cancelAllActiveTradesOfAUser(stranger.id);
        });

        it("should start a buy trade for 450 id6556", async () => {
            await offerViewPage.openOfferPage(sellOfferHash);
            await offerViewPage.buyNowAmount(450);
            await qaHelper.toBeVisible(tradePO.elements.actionTitle, 5000, "Title not visible");
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                "Please make a payment of 450 USD using Amazon Gift Card.",
            );
        });

        it("should start a buy trade for 500 id5326", async () => {
            await offerViewPage.openOfferPage(sellOfferHash);
            await offerViewPage.buyNowAmount(500);
            await qaHelper.toBeVisible(tradePO.elements.actionTitle, 5000, "Title not visible");
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                "Please make a payment of 500 USD using Amazon Gift Card.",
            );
        });

        it("should start a sell trade for 450 id6557", async () => {
            await offerViewPage.openOfferPage(buyOfferHash);
            await offerViewPage.sellNowAmount(450);
            await qaHelper.toBeVisible(tradePO.elements.actionTitle, 5000, "Title not visible");
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                "You are selling 0.45 BTC for 450 USD using Amazon Gift Card",
            );
        });

        it("should start a sell trade for 500 id5327", async () => {
            await offerViewPage.openOfferPage(buyOfferHash);
            await offerViewPage.sellNowAmount(500);
            await qaHelper.toBeVisible(tradePO.elements.actionTitle, 5000, "Title not visible");
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                "You are selling 0.5 BTC for 500 USD using Amazon Gift Card",
            );
        });
    });

    describe("Check if the new trade page is accessible from view offer page", () => {
        beforeAll(async () => {
            qaHelper.enableNewTradeForUser(stranger.id);
            qaHelper.toggleNewTradePageInSettings(1);
        });

        afterEach(async () => {
            await qaHelper.cancelAllActiveTradesOfAUser(stranger.id);
        });

        afterAll(async () => {
            qaHelper.toggleNewTradePageInSettings(0);
        });

        it("should start a buy trade for 450 id6556", async () => {
            await offerViewPage.openOfferPage(sellOfferHash);
            await offerViewPage.buyNowAmountNewTradePage(450);
            await qaHelper.toBeVisible(
                reactTradePO.elements.actionTitle,
                5000,
                "Title not visible",
            );
            expect(await reactTradePO.elements.actionTitle.getText()).toEqual(
                "Please make a payment of 450 USD using Amazon Gift Card.",
            );
        });

        it("should start a buy trade for 500 id5326", async () => {
            await offerViewPage.openOfferPage(sellOfferHash);
            await offerViewPage.buyNowAmountNewTradePage(500);
            await qaHelper.toBeVisible(
                reactTradePO.elements.actionTitle,
                5000,
                "Title not visible",
            );
            expect(await reactTradePO.elements.actionTitle.getText()).toEqual(
                "Please make a payment of 500 USD using Amazon Gift Card.",
            );
        });

        it("should start a sell trade for 450 id6557", async () => {
            await offerViewPage.openOfferPage(buyOfferHash);
            await offerViewPage.sellNowAmountNewTradePage(450);
            await qaHelper.toBeVisible(
                reactTradePO.elements.actionTitle,
                5000,
                "Title not visible",
            );
            expect(await reactTradePO.elements.actionTitle.getText()).toEqual(
                "You are selling 0.45 BTC for 450 USD using Amazon Gift Card",
            );
        });

        it("should start a sell trade for 500 id5327", async () => {
            await offerViewPage.openOfferPage(buyOfferHash);
            await offerViewPage.sellNowAmountNewTradePage(500);
            await qaHelper.toBeVisible(
                reactTradePO.elements.actionTitle,
                5000,
                "Title not visible",
            );
            expect(await reactTradePO.elements.actionTitle.getText()).toEqual(
                "You are selling 0.5 BTC for 500 USD using Amazon Gift Card",
            );
        });
    });
});
