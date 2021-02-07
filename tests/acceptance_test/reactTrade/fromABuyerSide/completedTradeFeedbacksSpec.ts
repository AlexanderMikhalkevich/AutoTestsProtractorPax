import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO, { feedbackText, updatedFeedbackText } from "../../../../pages/trade/reactTradePO";
import { initUsersAndOffers, startTrade } from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

// passed
describe("Trade. Completed. Feedback", () => {
    describe("", () => {
        beforeAll(async () => {
            await init();
        });
        it("lets user to leave feedback id6637", async () => {
            await tradePO.openTrade(id_hashed);
            await tradePO.leaveFeedback();
            expect(await tradePO.elements.feedbackBlock.isPresent()).toBeFalsy();
        });

        it("verifies feedback is existing on offer owner's side id6638", async () => {
            await loginPO.logInAccount(offerOwner.email);
            await tradePO.openTrade(id_hashed);
            expect(await tradePO.elements.receivedFeedbackMessage.getText()).toContain(
                feedbackText,
            );
        });
    });

    describe("", () => {
        beforeAll(async () => {
            await completeTradeWithFeedback();
        });

        it("lets client user edit and update existing feedback id6639", async () => {
            await tradePO.updateFeedback();
            expect(await tradePO.elements.feedbackBlock.isPresent()).toBeFalsy();
        });

        it("verifies feedback is updated on offer's owner side id6640", async () => {
            await loginPO.logInAccount(offerOwner.email);
            await tradePO.openTrade(id_hashed);
            expect(await tradePO.elements.receivedFeedbackMessage.getText()).toEqual(
                updatedFeedbackText,
            );
        });
    });

    describe("", () => {
        beforeAll(async () => {
            await completeTradeWithFeedback();
            await tradePO.updateFeedback();
            await loginPO.logInAccount(offerOwner.email);
            await tradePO.openTrade(id_hashed);
        });

        it("lets offer owner reply to received feedback id6641", async () => {
            await tradePO.leaveFeedbackReply();
            expect(await tradePO.elements.feedbackBlockReplyBlock.isPresent()).toBeFalsy();
        });

        it("verifies feedback reply message text left by offer owner id10500", async () => {
            expect(await tradePO.elements.feedbackReplyMessage.getText()).toEqual(feedbackText);
        });

        it("verifies that reply is added on client user's side id6642", async () => {
            await loginPO.logInAccount(clientUser.email);
            await tradePO.openTrade(id_hashed);
            expect(await tradePO.elements.feedbackReplyText.getText()).toEqual(
                "Response from: " + offerOwner.nick + "\n" + feedbackText,
            );
        });
    });

    describe("", () => {
        beforeAll(async () => {
            await completeTradeWithFeedback();
            await tradePO.updateFeedback();
            await loginPO.logInAccount(offerOwner.email);
            await tradePO.openTrade(id_hashed);
            await tradePO.leaveFeedbackReply();
        });

        it("lets offer owner edit and update feedback reply id10501", async () => {
            await tradePO.feedbackReplyUpdate();
            expect(await tradePO.elements.feedbackBlockReplyBlock.isPresent()).toBeFalsy();
            expect(await tradePO.elements.feedbackReplyMessage.getText()).toEqual(
                updatedFeedbackText,
            );
        });

        it("verifies that feedback reply is updated on client user's side id10502", async () => {
            await loginPO.logInAccount(clientUser.email);
            await tradePO.openTrade(id_hashed);
            expect(await tradePO.elements.feedbackReplyText.getText()).toEqual(
                "Response from: " + offerOwner.nick + "\n" + updatedFeedbackText,
            );
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
    await qaHelper.depositBond(offerOwner.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await qaHelper.releaseInTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}

async function completeTradeWithFeedback() {
    await init();
    await tradePO.openTrade(id_hashed);
    await tradePO.leaveFeedback();
}
