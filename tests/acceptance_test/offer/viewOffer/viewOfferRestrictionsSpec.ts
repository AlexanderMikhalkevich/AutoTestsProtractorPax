import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import offerViewPage from "../../../../pages/offerViewPO";

let requireVerifiedEmailOffer,
    requireVerifiedPhoneOffer,
    requirePastTradesOffer,
    disallowUsaOffer;

describe("View Offer restrictions", () => {
    beforeAll(async () => {
        const offerOwner = await qaHelper.createRandomUser(true);
        const user_id = offerOwner.id;
        await qaHelper.toggleKycVerification(user_id, {id: true, document: false});
        requireVerifiedEmailOffer = await qaHelper.createSpecificOffer({
            user_id,
        });
        requireVerifiedPhoneOffer = await qaHelper.createSpecificOffer({
            user_id,
            require_verified_phone: true,
        });
        requirePastTradesOffer = await qaHelper.createSpecificOffer({
            user_id,
            require_min_past_trades: 5,
        });
        disallowUsaOffer = await qaHelper.createSpecificOffer({
            user_id,
            country_limitation_type: 1,
            country_limitation_list: ["US"],
        });
        const regularUser = await qaHelper.createRandomUser(false);
        await loginPage.logInAccount(regularUser.email);
    });

    it("should have start trade button disabled with restriction: email verified id5328", async () => {
        await qaHelper.navigateToUrl("/offer/" + requireVerifiedEmailOffer);
        await qaHelper.toBeVisible(
            offerViewPage.elements.startTradeButton,
            5000,
            "Start trade button not visible",
        );
        expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
    });

    it("should have amount fiat field disabled with restriction: email verified id5331", async () => {
        await qaHelper.navigateToUrl("/offer/" + requireVerifiedEmailOffer);
        expect(await offerViewPage.elements.emailNotVerified.isPresent()).toBe(true);
    });

    it("should have start trade button disabled with restriction: phone verified id5332", async () => {
        await qaHelper.navigateToUrl("/offer/" + requireVerifiedPhoneOffer);
        await qaHelper.toBeVisible(
            offerViewPage.elements.startTradeButton,
            5000,
            "Start trade button not visible",
        );
        expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
    });

    it("should have amount fiat field disabled with restriction: phone verified id5333", async () => {
        await qaHelper.navigateToUrl("/offer/" + requireVerifiedPhoneOffer);
        expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
    });

    it("should have start trade button disabled with restriction: Usa country disallowed id5334", async () => {
        await qaHelper.navigateToUrl("/offer/" + disallowUsaOffer);
        await qaHelper.toBeVisible(
            offerViewPage.elements.startTradeButton,
            5000,
            "Start trade button not visible",
        );
        expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
    });

    it("should have amount fiat field disabled with restriction: Usa country disallowed id5335", async () => {
        await qaHelper.navigateToUrl("/offer/" + disallowUsaOffer);
        expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
    });

    it("should have start trade button disabled with restriction: past trades required id5336", async () => {
        await qaHelper.navigateToUrl("/offer/" + requirePastTradesOffer);
        await qaHelper.toBeVisible(
            offerViewPage.elements.startTradeButton,
            5000,
            "Start trade button not visible",
        );
        expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
    });

    it("should have amount fiat field disabled with restriction: past trades required id5337", async () => {
        await qaHelper.navigateToUrl("/offer/" + requirePastTradesOffer);
        expect(await offerViewPage.elements.startTradeButton.isEnabled()).toBe(false);
    });
});
