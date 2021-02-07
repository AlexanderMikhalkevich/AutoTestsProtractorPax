import converter from "../../../utils/converter";
import qaHelper from "../../../utils/qaHelper";
import publicReceiptPO from "../../../pages/trade/publicReceiptPO";
import userProfilePO from "../../../pages/userProfilePO";

const offer_terms = "sell offer terms";
const trade_details = "sell offer trade details";

const initBtcBalance = 1;
const initSatoshiBalance = converter.btcToSatoshi(initBtcBalance);

const amountFiat = 20;
const paymentMethodName = "Amazon Gift Card";

const TEN_MINUTES = 600000;
const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

describe("Public receipt. Trade in USD", () => {
    const currencyCode = "USD";
    let offersOwner, anotherUser;
    let sellOfferId;
    let trade, cryptoAmountBTC;
    let id_hashed;

    beforeAll(async () => {
        ({ offersOwner, sellOfferId, anotherUser } = await initUsersAndOffers(currencyCode));
        trade = await qaHelper.startTrade({
            user_id: anotherUser.id,
            offer_hash: sellOfferId,
            amount_fiat: amountFiat,
        });
        id_hashed = trade.id_hashed;
        cryptoAmountBTC = converter.satoshiToBtc(+trade.crypto_amount_requested);
        await qaHelper.payInTrade(id_hashed);
        await qaHelper.releaseInTrade(id_hashed);
        await publicReceiptPO.openReceipt(id_hashed);
    });

    it('shows the "Paxful receipt" header id6417', async () => {
        expect(await publicReceiptPO.elements.header.getText()).toEqual("Paxful receipt");
    });

    it('shows the "* bitcoin purchase completed" header id6418', async () => {
        expect(await publicReceiptPO.elements.bitcoinsAmountHeader.getText()).toEqual(
            `${cryptoAmountBTC} Bitcoin purchase completed`,
        );
    });

    it('shows the "Trade ID: *" header id6419', async () => {
        expect(await publicReceiptPO.elements.tradeIdHeader.getText()).toEqual(
            `Trade ID: ${id_hashed}`,
        );
    });

    it('shows the "Amount paid: * USD" label id6420', async () => {
        expect(await publicReceiptPO.elements.amountPaid.getText()).toEqual(
            `Amount paid: ${amountFiat} ${currencyCode}`,
        );
    });

    it('shows the "Payment method: *" label id6421', async () => {
        expect(await publicReceiptPO.elements.paymentMethod.getText()).toEqual(
            `Payment method: ${paymentMethodName}`,
        );
    });

    it('shows the "STARTED" header id6422', async () => {
        expect(await publicReceiptPO.elements.startedAtHeader.getText()).toEqual("STARTED");
    });

    it("shows the date and time when the trade was started id6423", async () => {
        const dateText = await publicReceiptPO.elements.startedAt.getText();
        const date = new Date(`${dateText} UTC`);
        expect(Date.now() - date.getTime()).toBeLessThan(
            TEN_MINUTES,
            "the Trade Started date is not close enough to the current time",
        );
        expect(dateText).toContain(formatDate(date));
    });

    it('shows the "COMPLETED" header id6424', async () => {
        expect(await publicReceiptPO.elements.completedAtHeader.getText()).toEqual("COMPLETED");
    });

    it("shows the date and time when the trade was completed id6425", async () => {
        const dateText = await publicReceiptPO.elements.completedAt.getText();
        const date = new Date(`${dateText} UTC`);
        expect(Date.now() - date.getTime()).toBeLessThan(
            TEN_MINUTES,
            "the Trade Completed date is not close enough to the current time",
        );
        expect(dateText).toContain(formatDate(date));
    });

    it('shows the "Time is in UTC" label id6426', async () => {
        expect(await publicReceiptPO.elements.helpBlock.getText()).toEqual("Time is in UTC");
    });

    it("shows a link to the seller page id6427", async () => {
        expect(await publicReceiptPO.elements.sellerLink.getText()).toEqual(
            `Seller: ${offersOwner.nick}`,
        );
    });

    it("shows the seller last seen time id6428", async () => {
        expect(await publicReceiptPO.elements.sellerLastSeen.getText()).toMatch(
            /Seen (just now)|(\d{1,2} minute(s)? ago)/,
        );
    });

    it("shows a link to the buyer page id6429", async () => {
        expect(await publicReceiptPO.elements.buyerLink.getText()).toEqual(
            `Buyer: ${anotherUser.nick}`,
        );
    });

    it("shows the buyer last seen time id6430", async () => {
        expect(await publicReceiptPO.elements.buyerLastSeen.getText()).toMatch(
            /Seen (just now)|(\d{1,2} minute(s)? ago)/,
        );
    });

    it('shows the "Terms" header id6431', async () => {
        expect(await publicReceiptPO.elements.termsHeader.getText()).toEqual("Terms");
    });

    it("shows the Terms text id6432", async () => {
        expect(await publicReceiptPO.elements.termsText.getText()).toEqual(offer_terms);
    });

    it('shows the "Instructions" header id6433', async () => {
        expect(await publicReceiptPO.elements.instructionsHeader.getText()).toEqual("Instructions");
    });

    it("shows the Instructions text id6434", async () => {
        expect(await publicReceiptPO.elements.instructionsText.getText()).toEqual(trade_details);
    });

    it('shows the "Cryptographic proof of payment" header id6435', async () => {
        expect(await publicReceiptPO.elements.cryptographicHeader.getText()).toEqual(
            "Cryptographic proof of payment",
        );
    });

    it("shows the Cryptographic proof of payment text id6436", async () => {
        const text = await publicReceiptPO.elements.cryptographicText.getText();
        expect(text).toContain("-----BEGIN PGP MESSAGE-----");
        expect(text).toContain("Version: Paxful 1.0.0");
        expect(text).toContain("-----END PGP MESSAGE-----");
        expect(text.length).toBeGreaterThan(600);
    });
});

describe("Public receipt. Trade in EUR", () => {
    let offersOwner, anotherUser;
    let sellOfferId;

    let trade, cryptoAmountBTC;

    const currency = "Euro";
    const currencyCode = "EUR";

    let id_hashed;

    beforeAll(async () => {
        ({ offersOwner, sellOfferId, anotherUser } = await initUsersAndOffers(currencyCode));
        trade = await qaHelper.startTrade({
            user_id: anotherUser.id,
            offer_hash: sellOfferId,
            amount_fiat: amountFiat,
        });
        id_hashed = trade.id_hashed;
        cryptoAmountBTC = converter.satoshiToBtc(+trade.crypto_amount_requested);
        await qaHelper.payInTrade(id_hashed);
        await qaHelper.releaseInTrade(id_hashed);
    });

    beforeEach(async () => {
        await publicReceiptPO.openReceipt(id_hashed);
    });

    it("allows to open the seller profile page using the link id6468", async () => {
        await publicReceiptPO.elements.sellerLink.click();
        await userProfilePO.checkThatPageIsLoaded(offersOwner.nick);
    });

    it("allows to open the buyer profile page using the link id6469", async () => {
        await publicReceiptPO.elements.buyerLink.click();
        await userProfilePO.checkThatPageIsLoaded(anotherUser.nick);
    });

    it('shows the "Amount paid: * EUR" label id6470', async () => {
        expect(await publicReceiptPO.elements.amountPaid.getText()).toEqual(
            `Amount paid: ${amountFiat} ${currencyCode}`,
        );
    });
});

async function initUsersAndOffers(currency: string) {
    const offersOwner = await qaHelper.createRandomUser(true);
    await qaHelper.addBalance(offersOwner.id, initSatoshiBalance);
    await qaHelper.activateEmail(offersOwner.id);
    await qaHelper.togglePhoneVerification(offersOwner.id, "+3726000006");
    await qaHelper.toggleKycVerification(offersOwner.id, { id: true, document: false });
    await qaHelper.depositBond(offersOwner.id);
    const sellOfferId = await qaHelper.createSpecificOffer({
        user_id: offersOwner.id,
        type: "sell",
        range_min: 20,
        range_max: 50,
        offer_terms,
        trade_details,
        currency,
    });

    const anotherUser = await qaHelper.createRandomUser();
    await qaHelper.addBalance(anotherUser.id, initSatoshiBalance);
    await qaHelper.activateEmail(anotherUser.id);
    await qaHelper.togglePhoneVerification(anotherUser.id, "+3726000010");

    return {
        offersOwner,
        sellOfferId,
        anotherUser,
    };
}
