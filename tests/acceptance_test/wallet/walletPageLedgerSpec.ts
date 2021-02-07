import qaHelper from "../../../utils/qaHelper";
import walletPage from "../../../pages/walletPO";
import { initUsersAndOffers, startTrade } from "../trade/tradeTestBase";
import loginPO from "../../../pages/loginPO";
import converter from "../../../utils/converter";

let offerId;
let id_hashed;
let offerOwner;
let clientUser;
let internalWallet;
const transactionBTCamount = 0.001;

describe("Wallet ledger -", () => {
    beforeAll(async () => {
        ({ offerOwner, clientUser, offerId } = await initUsersAndOffers("sell"));
        await loginPO.logInAccount(offerOwner.email);
    });

    describe("deposit/withdraw bond -", () => {
        beforeAll(async () => {
            await qaHelper.depositBond(offerOwner.id);
            await qaHelper.withdrawBond(offerOwner.id);
            await walletPage.goLoggedIn();
            await walletPage.elements.walletTabs.last().click();
            await walletPage.elements.transactionTabLink.click();
        });

        it("verifies bond deposit entry existence id51470", async () => {
            expect(await walletPage.elements.ledgerEntry.get(1).getText()).toContain(
                "A security deposit of 0.005 BTC was made",
            );
            expect(await walletPage.elements.ledgerEntry.get(1).getText()).toContain("-$5.00");
        });

        it("verifies bond retrieve entry existence id51471", async () => {
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain(
                "0.005 BTC security deposit withdrawn",
            );
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain("$5.00");
        });
    });

    describe("cancelled trade transactions on vendor side", () => {
        beforeAll(async () => {
            await qaHelper.depositBond(offerOwner.id);
            id_hashed = await startTrade(clientUser.id, offerId);
            await qaHelper.cancelTrade(id_hashed);
            await walletPage.goLoggedIn();
            await walletPage.elements.walletTabs.last().click();
            await walletPage.elements.transactionTabLink.click();
        });

        it("verifies escrow entry existence id51472", async () => {
            expect(await walletPage.elements.ledgerEntry.get(1).getText()).toContain(
                `BTC sent to escrow for trade ${id_hashed} with ${clientUser.nick}`,
            );
            expect(await walletPage.elements.ledgerEntry.get(1).getText()).toContain("-$20.20");
        });

        it("verifies returned escrow entry existence id51473", async () => {
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain(
                `BTC returned to your wallet from trade ${id_hashed}`,
            );
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain("$20.20");
        });
    });

    describe("released trade transactions", () => {
        beforeAll(async () => {
            id_hashed = await startTrade(clientUser.id, offerId);
            await qaHelper.releaseInTrade(id_hashed);
        });

        it("verifies sent escrow entry existence id51474", async () => {
            await walletPage.goLoggedIn();
            await walletPage.elements.walletTabs.last().click();
            await walletPage.elements.transactionTabLink.click();
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain(
                `BTC sent from escrow to ${clientUser.nick}. Trade: ${id_hashed}`,
            );
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain("-$20.00");
        });

        it("verifies received escrow entry existence id51475", async () => {
            await loginPO.logInAccount(clientUser.email);
            await walletPage.goLoggedIn();
            await walletPage.elements.walletTabs.last().click();
            await walletPage.elements.transactionTabLink.click();
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain(
                `BTC received from trade: ${id_hashed}`,
            );
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain("$20.00");
        });
    });

    describe("BTC internal transaction", () => {
        beforeAll(async () => {
            internalWallet = await qaHelper.getUserWallet(clientUser.email);
            await loginPO.logInAccount(offerOwner.email);
            await walletPage.goLoggedIn();
            await walletPage.pressSendButton();
            await walletPage.internalPrepareSend(transactionBTCamount, internalWallet);
            await walletPage.confirmAndSend();
        });

        it("verifies transaction send entry existence id51476", async () => {
            await walletPage.goLoggedIn();
            await walletPage.elements.walletTabs.last().click();
            await walletPage.elements.transactionTabLink.click();
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain(
                `${transactionBTCamount} BTC sent to ${clientUser.nick}'s wallet at ${internalWallet.replace(
                    internalWallet.substring(5, 29),
                    "************************",
                )}`,
            );
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain("-$1.00");
        });

        it("verifies transaction receive entry existence id51477", async () => {
            await loginPO.logInAccount(clientUser.email);
            await walletPage.goLoggedIn();
            await walletPage.elements.walletTabs.last().click();
            await walletPage.elements.transactionTabLink.click();
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain(
                `Received from ${offerOwner.nick} to ${internalWallet}`,
            );
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain("$1.00");
        });
    });

    describe("BTC external transaction", () => {
        beforeAll(async () => {
            await loginPO.logInAccount(offerOwner.email);
            await walletPage.goLoggedIn();
            await walletPage.externalPrepareSend(transactionBTCamount, "mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt");
            await walletPage.confirmAndSend();
            await walletPage.goLoggedIn();
            await walletPage.elements.walletTabs.last().click();
            await walletPage.elements.transactionTabLink.click();
        });

        it("verifies transaction send entry existence id51478", async () => {
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain(
                "Sending to mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt",
            );
            expect(await walletPage.elements.ledgerEntry.get(0).getText()).toContain("-$1.08");
        });
    });
});
