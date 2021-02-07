import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/reactTradePO";
import tradeChatComponent from "../../../../pages/trade/tradeChatComponent";
import userProfilePO from "../../../../pages/userProfilePO";
import offersListPO from "../../../../pages/offersListPO";
import {
    amountFiat,
    currencyCode,
    initUsersAndOffers,
    paymentMethodName,
    startTrade,
} from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

// passed
describe("Trade", () => {
    describe("Cancelled by buyer trade", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed); // just refresh trade
        });

        it("shows the TRADE CANCELLED BY BUYER trade status id6471", async () => {
            expect(await tradePO.elements.tradeStatusLabel.getText()).toEqual(
                "Trade Cancelled by Buyer",
            );
        });

        it('shows the "YOU CAN START ANOTHER TRADE WITH * OR FIND A NEW *" header id6474', async () => {
            expect(await tradePO.elements.ctaContainer.getText()).toEqual(
                `Want to start another trade? You can always start a new trade with ${offerOwner.nick} or simply find a new one from our list of ${paymentMethodName} offers.`,
            );
        });

        it('allows to open trade partner account page by clicking a link in the "YOU CAN START ANOTHER TRADE WITH * OR FIND A NEW *" header id6475', async () => {
            await tradePO.elements.ctaContainerPartnerAccountLink.click();
            await userProfilePO.checkThatPageIsLoaded(offerOwner.nick);
        });

        it('allows to open the Buy Bitcoin page by clicking a link in the "YOU CAN START ANOTHER TRADE WITH * OR FIND A NEW *" header id6476', async () => {
            await tradePO.elements.ctaContainerBuyBitcoinLink.click();
            await offersListPO.checkBuyBitcoinPageIsLoaded();
            expect(await offersListPO.elements.pageTitle.getText()).toEqual(
                "Buy Bitcoin (BTC) with Amazon Gift Card",
            );
        });

        it('shows the "you sent * worth of *" header id6477', async () => {
            expect(await tradePO.elements.actionTitle.getText()).toEqual(
                `You paid ${amountFiat} ${currencyCode} with ${paymentMethodName}.`,
            );
        });

        it("does not show the Paid button and its description id6478", async () => {
            expect(await tradePO.elements.paidButton.isPresent()).toBeFalsy();
            expect(await tradePO.elements.paidButtonDescription.isPresent()).toBeFalsy();
        });

        it("does not show the Cancel button and its description id6479", async () => {
            expect(await tradePO.elements.cancelButton.isPresent()).toBeFalsy();
            expect(await tradePO.elements.cancelButtonDescription.isPresent()).toBeFalsy();
        });

        it("does not show a countdown with time left to make payment id6480", async () => {
            expect(await tradePO.elements.paymentTimeCountdown.isPresent()).toBeFalsy();
        });

        it('does not show the "* BTC is being safely held in Paxful escrow id6481', async () => {
            expect(await tradePO.elements.escrowInfo.isPresent()).toBeFalsy();
        });

        it("shows how much time age the trade was cancelled id6482", async () => {
            expect(await tradePO.elements.finishedTradeInfo.getText()).toMatch(
                /^Cancelled (\d{1,2})|(AN?)|(A FEW) (MINUTE)|(SECOND)(S)? AGO$/,
            );
        });

        it('shows the "Trade was cancelled by" message in the chat id6354', async () => {
            expect(await tradeChatComponent.getLastMessageText()).toEqual(
                `This trade was canceled and the Bitcoin is no longer reserved. To continue, ask your trade partner to reopen this trade, and make sure the Bitcoin is reserved, before you make the payment.`,
            );
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await qaHelper.cancelTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}
