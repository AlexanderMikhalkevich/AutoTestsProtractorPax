import qaHelper from "../../../../utils/qaHelper";
import loginPO from "../../../../pages/loginPO";
import tradePO from "../../../../pages/trade/reactTradePO";
import { initUsersAndOffers, makeAUserExperienced, startTrade } from "../tradeTestBase";

let offerOwner, clientUser;
let offerId;
let id_hashed;

// passed
describe("Trade", () => {
    describe("New non Gift Card trade", () => {
        beforeAll(async () => {
            await init();
        });

        beforeEach(async () => {
            await tradePO.openTrade(id_hashed); // just refresh trade
        });

        afterAll(async () => {
            await qaHelper.cancelTrade(id_hashed);
        });

        it("does not show a low reputation attention in case of non Gift Card trade id6506", async () => {
            expect(await tradePO.elements.lowReputationWarning.isPresent()).toBeFalsy();
        });
    });
});

async function init() {
    ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell", {
        payment_method: 907,
    }));
    await makeAUserExperienced(clientUser.id);
    id_hashed = await startTrade(clientUser.id, offerId);
    await loginPO.logInAccount(clientUser.email);
}
