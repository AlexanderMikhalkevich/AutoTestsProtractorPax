import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO, { feedbackText, updatedFeedbackText } from "../../../../pages/trade/tradePO";
import { initUsersAndOffers, makeAUserExperienced, startTrade } from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

describe("Trade. Completed. Feedback", () => {
    describe("", () => {
        beforeAll(async () => {
            await init();
        });

        it("lets user to leave feedback id6635", async () => {
            await tradePO.openTrade(id_hashed);
            await tradePO.leaveFeedback();
            expect(await tradePO.elements.feedbackMessageStatus.getText()).toContain("Feedback left successfully.");
        });

        it("verifies feedback is existing on offer owner's side id6636", async () => {
            await loginPO.logInAccount(offerOwner.email);
            await tradePO.openTrade(id_hashed);
            expect(await tradePO.elements.leftFeedbackMessage.getText()).toEqual(feedbackText);
        });
    });

    describe("", () => {
        beforeAll(async () => {
            await completeTradeWithFeedback();
        });

        it("lets client user edit and update existing feedback id6643", async () => {
            await tradePO.updateFeedback();
            expect(await tradePO.elements.feedbackMessageStatus.getText()).toContain(
                "Feedback has been updated.",
            );
        });

        it("verifies feedback is updated on offer's owner side id6644", async () => {
            await loginPO.logInAccount(offerOwner.email);
            await tradePO.openTrade(id_hashed);
            expect(await tradePO.elements.leftFeedbackMessage.getText()).toEqual(updatedFeedbackText);
        });
    });

    describe("", () => {
        beforeAll(async () => {
            await completeTradeWithFeedback();
            await tradePO.updateFeedback();
        });

        describe("", () => {
            beforeAll(async () => {
                await loginPO.logInAccount(offerOwner.email);
                await tradePO.openTrade(id_hashed);
            });

            it("lets offer owner reply to received feedback id6645", async () => {
                await tradePO.leaveFeedbackReply();
                expect(await tradePO.elements.feedbackReplyMessageStatus.getText()).toContain("Feedback reply left.");
            });

            it("verifies feedback reply message text left by offer owner id10808", async () => {
                expect(await tradePO.elements.feedbackReplyMessage.getText()).toEqual(
                    "Reply from you\n" + feedbackText,
                );
            });
        });

        describe("", () => {
            beforeAll(async () => {
                await loginPO.logInAccount(clientUser.email);
                await tradePO.openTrade(id_hashed);
            });

            it("verifies feedback reply message text on client user's side id6646", async () => {
                expect(await tradePO.elements.feedbackReplyText.getText()).toEqual(
                    "Reply from " + offerOwner.nick + "\n" + feedbackText,
                );
            });
        });
    });

    describe("", () => {
        beforeAll(async () => {
            await completeTradeWithFeedback();
            await tradePO.updateFeedback();
            await loginPO.logInAccount(offerOwner.email);
            await tradePO.openTrade(id_hashed);
            await tradePO.leaveFeedbackReply();
            await loginPO.logInAccount(offerOwner.email);
            await tradePO.openTrade(id_hashed);
        });

        it("lets offer owner edit and update feedback reply id10503", async () => {
            await tradePO.feedbackReplyUpdate();
            expect(await tradePO.elements.feedbackReplyMessageStatus.getText()).toContain(
                "Feedback reply left.",
            );
            expect(await tradePO.elements.feedbackReplyMessage.getText()).toEqual(
                "Reply from you\n" + updatedFeedbackText,
            );
        });

        it("verifies that feedback reply is updated on client user's side id10504", async () => {
            await loginPO.logInAccount(clientUser.email);
            await tradePO.openTrade(id_hashed);
            expect(await tradePO.elements.feedbackReplyText.getText()).toEqual(
                "Reply from " + offerOwner.nick + "\n" + updatedFeedbackText,
            );
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("buy"));
    id_hashed = await startTrade(clientUser.id, offerId);
    await makeAUserExperienced(clientUser.id);
    await qaHelper.releaseInTrade(id_hashed);
    await loginPO.logInAccount(clientUser.email);
}

async function completeTradeWithFeedback() {
    await init();
    await tradePO.openTrade(id_hashed);
    await tradePO.leaveFeedback();
}
