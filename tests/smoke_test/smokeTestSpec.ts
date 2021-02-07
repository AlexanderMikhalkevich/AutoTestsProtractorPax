import createOfferPage from "../../pages/createOfferPO";
import loginPage from "../../pages/loginPO";
import offerPage from "../../pages/offerViewPO";
import offerViewPage from "../../pages/offerViewPO";
import tradePage from "../../pages/trade/tradePO";
import tradePageReact from "../../pages/trade/reactTradePO";
import walletPage from "../../pages/walletPO";
import qaHelper from "../../utils/qaHelper";

describe("Smoke tests", () => {
    let offerHashForSellOffer;
    let offerHashForSellOfferNewTradePage;
    let offerHashForBuyOffer;
    let offerHashForBuyOfferNewTradePage;

    let seller2fa, seller, buyer, walletSend;
    let seller2faNewTradePage, sellerNewTradePage, buyerNewTradePage;

    beforeAll(async () => {
        await Promise.all([
            //prepare test data for seller with 2fa account
            (async () => {
                seller2fa = await qaHelper.createRandomUser(true);
                await Promise.all([
                    qaHelper.activateEmail(seller2fa.id),
                    qaHelper.activate2faSms(seller2fa.id),
                    qaHelper.togglePhoneVerification(seller2fa.id, "+3726000000"),
                    qaHelper.toggleKycVerification(seller2fa.id, { id: true, document: false }),
                    qaHelper.addBalance(seller2fa.id, 100000000),
                ]);
                offerHashForSellOffer = await qaHelper.createOffer(
                    seller2fa.id,
                    "USD",
                    25,
                    1,
                    "sell",
                );
            })(),

            //prepare test data for seller with 2fa account for the NEW TRADE PAGE
            (async () => {
                seller2faNewTradePage = await qaHelper.createRandomUser(true);
                await Promise.all([
                    qaHelper.toggleNewTradePageInSettings(1),
                    qaHelper.activateEmail(seller2faNewTradePage.id),
                    qaHelper.activate2faSms(seller2faNewTradePage.id),
                    qaHelper.togglePhoneVerification(seller2faNewTradePage.id, "+3726000001"),
                    qaHelper.toggleKycVerification(seller2faNewTradePage.id, {
                        id: true,
                        document: false,
                    }),
                    qaHelper.addBalance(seller2faNewTradePage.id, 100000000),
                    qaHelper.enableNewTradeForUser(seller2faNewTradePage.id),
                ]);
                offerHashForSellOfferNewTradePage = await qaHelper.createOffer(
                    seller2faNewTradePage.id,
                    "USD",
                    25,
                    1,
                    "sell",
                );
            })(),

            //prepare test data for seller without 2fa
            (async () => {
                seller = await qaHelper.createRandomUser();
                await Promise.all([
                    qaHelper.activateEmail(seller.id),
                    qaHelper.togglePhoneVerification(seller.id, "+3726000001"),
                    qaHelper.addBalance(seller.id, 100000000),
                ]);
            })(),

            //prepare test data for seller without 2fa, NEW TRADE PAGE
            (async () => {
                sellerNewTradePage = await qaHelper.createRandomUser();
                await Promise.all([
                    qaHelper.toggleNewTradePageInSettings(1),
                    qaHelper.activateEmail(sellerNewTradePage.id),
                    qaHelper.togglePhoneVerification(sellerNewTradePage.id, "+3726000001"),
                    qaHelper.addBalance(sellerNewTradePage.id, 100000000),
                    qaHelper.enableNewTradeForUser(sellerNewTradePage.id),
                ]);
            })(),

            //prepare test data for buyer account
            (async () => {
                buyer = await qaHelper.createRandomUser();
                await Promise.all([
                    qaHelper.activateEmail(buyer.id),
                    qaHelper.togglePhoneVerification(buyer.id, "+3726000002"),
                    qaHelper.toggleKycVerification(buyer.id, { id: true, document: false }),
                    qaHelper.addBalance(buyer.id, 100000000),
                ]);
                offerHashForBuyOffer = await qaHelper.createOffer(buyer.id, "USD", 25, 1, "buy");
            })(),

            //prepare test data for buyer account
            (async () => {
                buyerNewTradePage = await qaHelper.createRandomUser();
                await Promise.all([
                    qaHelper.toggleNewTradePageInSettings(1),
                    qaHelper.activateEmail(buyerNewTradePage.id),
                    qaHelper.togglePhoneVerification(buyerNewTradePage.id, "+3726000002"),
                    qaHelper.toggleKycVerification(buyerNewTradePage.id, {
                        id: true,
                        document: false,
                    }),
                    qaHelper.enableNewTradeForUser(buyerNewTradePage.id),
                    qaHelper.addBalance(buyerNewTradePage.id, 100000000),
                ]);
                offerHashForBuyOfferNewTradePage = await qaHelper.createOffer(
                    buyerNewTradePage.id,
                    "USD",
                    25,
                    1,
                    "buy",
                );
            })(),

            //prepare test data for wallet send
            (async () => {
                walletSend = await qaHelper.createRandomUser();
                await qaHelper.addBalance(walletSend.id, 10000000);
                await qaHelper.activateEmail(walletSend.id);
                await qaHelper.togglePhoneVerification(walletSend.id, "+3726000003");
                await qaHelper.toggleKycVerification(walletSend.id, { id: true });
            })(),
        ]);
    });

    describe("As a seller with 2fa", () => {
        beforeAll(async () => {
            await loginPage.logInAccount2faSms(seller2fa.email);
        });

        it("allows to create a buy offer id5546", async () => {
            await createOfferPage.navigateToCreateOfferPage();
            await createOfferPage.elements.paymentMethodsShowAllButton.click();
            await createOfferPage.elements.giftCards.click();
            await createOfferPage.createBuyBitcoinOffer();
        });

        it("allows to create a sell offer id5547", async () => {
            await createOfferPage.navigateToCreateOfferPage();
            await createOfferPage.elements.paymentMethodsShowAllButton.click();
            await createOfferPage.elements.giftCards.click();
            await createOfferPage.createSellBitcoinOffer();
        });

        it("allows to sell Bitcoins with 2fa id5548", async () => {
            await offerPage.navigateToBuyOfferPage(offerHashForBuyOffer);
            await offerViewPage.sellNow();
            await tradePage.closeNotificationWithLessThan20Trade();
            await tradePage.releaseBitcoinsWith2fa();
            await tradePage.waitForTradeStatus("Trade Completed");
        });
    });

    describe("As a seller with 2fa, NEW TRADE PAGE", () => {
        beforeAll(async () => {
            await loginPage.logInAccount2faSms(seller2faNewTradePage.email);
        });

        it("allows to create a buy offer id5546", async () => {
            await createOfferPage.navigateToCreateOfferPage();
            await createOfferPage.elements.paymentMethodsShowAllButton.click();
            await createOfferPage.elements.giftCards.click();
            await createOfferPage.createBuyBitcoinOffer();
        });

        it("allows to create a sell offer id5547", async () => {
            await createOfferPage.navigateToCreateOfferPage();
            await createOfferPage.elements.paymentMethodsShowAllButton.click();
            await createOfferPage.elements.giftCards.click();
            await createOfferPage.createSellBitcoinOffer();
        });

        it("allows to sell Bitcoins with 2fa id5548", async () => {
            await offerPage.navigateToBuyOfferPage(offerHashForBuyOfferNewTradePage);
            await offerViewPage.sellNowNewTradePage();
            await tradePageReact.closeNotificationWithLessThan20Trade();
            await tradePageReact.releaseBitcoinsWith2fa();
            await tradePageReact.reloadThePage();
            await tradePageReact.waitForTradeStatus("Trade Completed");
        });
    });

    describe("As a buyer", () => {
        beforeAll(async () => {
            await loginPage.logInAccount(buyer.email);
            await offerPage.navigateToSellOfferPage(offerHashForSellOffer);
            await offerViewPage.buyNow();
            await tradePage.elements.helpTourSkipButton.click();
        });

        it("allows to pay in trade id5549", async () => {
            await tradePage.payInTrade();
            await tradePage.waitForTradeStatus("Trade Marked as Paid");
        });
    });

    describe("As a buyer, NEW TRADE PAGE", () => {
        beforeAll(async () => {
            await loginPage.logInAccount(buyerNewTradePage.email);
            await offerPage.navigateToSellOfferPage(offerHashForSellOfferNewTradePage);
            await offerViewPage.buyNowNewTradePage();
            await tradePageReact.elements.helpTourSkipButton.click();
        });

        it("allows to pay in trade id5549", async () => {
            await tradePageReact.payInTrade();
            await tradePageReact.reloadThePage();
            await tradePageReact.waitForTradeStatus("Trade Paid");
        });
    });

    describe("As a seller without 2fa", () => {
        beforeAll(async () => {
            await loginPage.logInAccount(seller.email);
            await offerPage.navigateToBuyOfferPage(offerHashForBuyOffer);
            await offerViewPage.sellNow();
            await tradePage.closeNotificationWithLessThan20Trade();
        });

        it("allows to sell Bitcoins with 2fa id5550", async () => {
            await tradePage.releaseBitcoinsWithout2fa();
            await tradePage.waitForTradeStatus("Trade Completed");
        });
    });

    describe("As a seller without 2fa, NEW TRADE PAGE", () => {
        beforeAll(async () => {
            await loginPage.logInAccount(sellerNewTradePage.email);
            await offerPage.navigateToBuyOfferPage(offerHashForBuyOfferNewTradePage);
            await offerViewPage.sellNowNewTradePage();
            await tradePageReact.closeNotificationWithLessThan20Trade();
        });

        it("allows to sell Bitcoins with 2fa id5550", async () => {
            await tradePageReact.releaseBitcoinsWithout2fa();
            await tradePageReact.reloadThePage();
            await tradePageReact.waitForTradeStatus("Trade Completed");
        });
    });

    describe("Wallet", () => {
        let internalWallet;

        beforeAll(async () => {
            await loginPage.logInAccount(walletSend.email);
            const user = await qaHelper.createRandomUser(true);
            internalWallet = await qaHelper.getUserWallet(user.email);
            await walletPage.goLoggedIn();
        });

        it("allows to send bitcoins to an internal user id5551", async () => {
            await walletPage.pressSendButton();
            await walletPage.fillInfoForWalletSend(internalWallet);
            await walletPage.confirmAndSendSmoke(internalWallet);
        });
    });
});
