import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import offersListPage from "../../../pages/offersListPO";

let idVerifiedRichUser,
    idVerifiedPoorUser,
    fullyVerifiedPoorUser,
    searcher;

const applePay = {
    name: "ApplePay",
    id: 70,
};
const westernUnion = {
    name: "Western Union",
    id: 7,
};

describe("Sell Bitcoin page (search for Buy offers)", () => {
    beforeAll(async () => {
        await Promise.all([
            (async () => {
                idVerifiedRichUser = await qaHelper.createRandomUser();
                await qaHelper.addBalance(idVerifiedRichUser.id, 2000000);
                await qaHelper.toggleKycVerification(idVerifiedRichUser.id);
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedRichUser.id,
                    type: "buy",
                    margin: 4,
                    payment_method: applePay.id,
                    payment_method_label: "idVerifiedRichUser1",
                });
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedRichUser.id,
                    type: "buy",
                    margin: 5,
                    payment_method: westernUnion.id,
                    payment_method_label: "idVerifiedRichUser2",
                });
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedRichUser.id,
                    type: "buy",
                    margin: 5,
                    payment_method: applePay.id,
                    currency: "eur",
                    payment_method_label: "Euro offer",
                });
            })(),
            (async () => {
                idVerifiedPoorUser = await qaHelper.createRandomUser();
                await qaHelper.addBalance(idVerifiedPoorUser.id, 1900000);
                await qaHelper.toggleKycVerification(idVerifiedPoorUser.id, {id: true, document: false});
                await qaHelper.createSpecificOffer({
                    user_id: idVerifiedPoorUser.id,
                    type: "buy",
                    margin: 3,
                    payment_method: applePay.id,
                    payment_method_label: "idVerifiedPoorUser",
                });
            })(),
            (async () => {
                fullyVerifiedPoorUser = await qaHelper.createRandomUser();
                await qaHelper.toggleKycVerification(fullyVerifiedPoorUser.id, {id: true, document: true});
                await qaHelper.createSpecificOffer({
                    user_id: fullyVerifiedPoorUser.id,
                    type: "buy",
                    margin: 3,
                    payment_method: applePay.id,
                    payment_method_label: "fullyVerifiedPoorUser",
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
            await offersListPage.goSellBitcoin();
        });

        it("allows to see offers with local currency", async () => {
            await offersListPage.checkOfferWithLabelNotListed("Euro offer");
            await offersListPage.selectCountry("Estonia");
            await offersListPage.checkOfferWithLabelIsListed("Euro offer");
        });

        afterAll(async () => {
            await offersListPage.selectCountry("USA"); // default location
        });
    });

    describe("Offers displaying", () => {
        beforeEach(async () => {
            await offersListPage.goSellBitcoin();
            await offersListPage.selectPaymentMethod(applePay.name);
        });

        it("should show BUY offers of ID only verified users with balance >= 0.02 BTC in the search results id5355", async () => {
            await offersListPage.checkOfferWithLabelIsListed("idVerifiedRichUser1");
        });

        it("should NOT show BUY offers of ID only verified users with balance < 0.02 BTC in the search results id5356", async () => {
            await offersListPage.checkOfferWithLabelNotListed("idVerifiedPoorUser");
        });

        it("should show BUY offers of fully verified users with balance < 0.02 BTC in the search results", async () => {
            await offersListPage.checkOfferWithLabelIsListed("fullyVerifiedPoorUser");
        });
    });
});
