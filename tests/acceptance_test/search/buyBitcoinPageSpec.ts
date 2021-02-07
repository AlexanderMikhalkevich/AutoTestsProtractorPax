import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import offersListPage from "../../../pages/offersListPO";

let idVerifiedUser,
    searcher;

const applePay = {
    name: "ApplePay",
    id: 70,
};

const iTunes = {
    id: 137,
    name: "iTunes Gift Card Code",
};

describe("Buy Bitcoin page (search for Sell offers)", () => {
    beforeAll(async () => {
        await Promise.all([
            (async () => {
                idVerifiedUser = await qaHelper.createRandomUser(true);
                await qaHelper.addBalance(idVerifiedUser.id, 1900000);
                await qaHelper.toggleKycVerification(idVerifiedUser.id, {id: true, document: false});
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedUser.id,
                    type: "sell",
                    amount: 10,
                    payment_method: applePay.id,
                    payment_method_label: "idVerified",
                });
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedUser.id,
                    type: "sell",
                    amount: 10,
                    payment_method: iTunes.id,
                    payment_method_label: "idVerifiedGift",
                });
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedUser.id,
                    type: "sell",
                    currency: "eur",
                    amount: 10,
                    payment_method: applePay.id,
                    payment_method_label: "Euro offer",
                });
            })(),
            (async () => {
                searcher = await qaHelper.createRandomUser();
            })(),
        ]);
        await loginPage.logInAccount(searcher.email);
    });

    describe("Country selector", () => {
        beforeAll(async () => {
            await offersListPage.goBuyBitcoin();
        });

        it("allows to see offers with local currency", async () => {
            await offersListPage.checkOfferWithLabelIsListed("idVerified");
            await offersListPage.checkOfferWithLabelNotListed("Euro offer");
            await offersListPage.selectCountry("Estonia");
            await offersListPage.checkOfferWithLabelIsListed("Euro offer");
            await offersListPage.checkOfferWithLabelNotListed("idVerified");
        });

        afterAll(async () => {
            await offersListPage.selectCountry("USA"); // default location
        });
    });

    describe("Gift cards", () => {
        beforeAll(async () => {
            await offersListPage.goBuyBitcoin();
            await offersListPage.selectPaymentMethod(iTunes.name);
        });

        it("should NOT show SELL offers of ID verified users with low balance without bond in the search results id5392", async () => {
            await offersListPage.checkOfferWithLabelNotListed("idVerifiedGift");
        });
    });

    describe("Regular payment method", () => {
        beforeAll(async () => {
            await offersListPage.goBuyBitcoin();
            await offersListPage.selectPaymentMethod(applePay.name);
        });

        it("should show SELL offers of ID verified users with low balance in the search results id5370", async () => {
            await offersListPage.checkOfferWithLabelIsListed("idVerified");
        });
    });
});
