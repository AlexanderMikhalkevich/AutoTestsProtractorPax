import qaHelper from "../../../utils/qaHelper";
import moreInfo from "../../../pages/trade/moreInfoSidePanelComponent";
import converter from "../../../utils/converter";

export const amountFiat = 20;
export const expectedTestBtcPrice = 1000;
export const expectedTradeBtcAmount = roundTo8Digits(amountFiat / expectedTestBtcPrice);
export const expectedSellFeeAmount = roundTo8Digits(expectedTradeBtcAmount / 100);

export const initBtcBalance = 1;
export const initSatoshiBalance = converter.btcToSatoshi(initBtcBalance);

export const paymentMethodName = "Amazon Gift Card";
export const currencyCode = "USD";

export async function makeAUserExperienced(userId: number): Promise<void> {
    await qaHelper.updateUserStats(userId, 1, 20, 1, 20);
}

export async function checkMoreInfoPanelElements(userNick: string): Promise<void> {
    await moreInfo.toggleSharedFilesTab();
    expect(await moreInfo.elements.userNick.getText()).toBe(userNick);
    expect(await moreInfo.elements.positiveFeedback.getText()).toMatch(/^\d$/);
    expect(await moreInfo.elements.negativeFeedback.getText()).toMatch(/^\d$/);
    expect(await moreInfo.elements.lastSeen.getText()).toMatch(
        /^Seen (just now)|(\d{1} minute(s)? ago)$/,
    );
    expect(await moreInfo.elements.emailVerified.getText()).toBe("E-mail verified");
    expect(await moreInfo.elements.phoneVerified.getText()).toBe("Phone verified");
    expect(await moreInfo.elements.idVerified.getText()).toBe("ID verified");
    expect(await moreInfo.elements.name.getText()).toBe("John S.");
    expect(await moreInfo.elements.joined.getText()).toMatch(
        /^Joined \d{1,2} (second(s)?)|(minute(s)?)|(week(s)?) ago$/,
    );
    expect(await moreInfo.elements.partners.getText()).toMatch(/^\d{1,2} partner(s)?$/);
    expect(await moreInfo.elements.trades.getText()).toMatch(/^\d{1,2} trade(s)?$/);
    expect(await moreInfo.elements.btcTraded.getText()).toMatch(/^\d+\+? BTC traded$/);
    expect(await moreInfo.elements.trustedBy.getText()).toMatch(/^Trusted by \d people(s)?$/);
    expect(await moreInfo.elements.blockedBy.getText()).toMatch(/^Blocked by \d people(s)?$/);
    expect(await moreInfo.elements.location.getText()).toBe("United States (USA)");
}

export function roundTo8Digits(num: number): number {
    return +num.toFixed(8);
}

export async function createOffer(
    user_id: number,
    type: "buy" | "sell",
    extraOptions: object = {},
): Promise<string> {
    return await qaHelper.createSpecificOffer({
        user_id: user_id,
        type: type,
        range_min: 20,
        range_max: 50,
        offer_terms: `${type} offer terms`,
        trade_details: `${type} offer trade details`,
        ...extraOptions,
    });
}

export async function initUsersAndOffers(type: "sell" | "buy", extraOptions: object = {}) {
    const offerOwner = await qaHelper.createRandomUser(true);
    await qaHelper.toggleNewTradePageInSettings(1);
    await qaHelper.addBalance(offerOwner.id, initSatoshiBalance);
    await qaHelper.activateEmail(offerOwner.id);
    await qaHelper.togglePhoneVerification(offerOwner.id, "+3726000005");

    await qaHelper.toggleKycVerification(offerOwner.id);

    const clientUser = await qaHelper.createRandomUser();
    await qaHelper.addBalance(clientUser.id, initSatoshiBalance);
    await qaHelper.activateEmail(clientUser.id);
    await qaHelper.togglePhoneVerification(clientUser.id, "+3726000009");

    await qaHelper.enableNewTradeForUser(offerOwner.id);
    await qaHelper.enableNewTradeForUser(clientUser.id);

    const offerId = await createOffer(offerOwner.id, type, extraOptions);

    return {
        offerOwner,
        clientUser,
        offerId,
    };
}

export async function startTrade(
    clientId: number,
    offerId: string,
    extraOptions: object = {},
): Promise<string> {
    const trade = await qaHelper.startTrade({
        user_id: clientId,
        offer_hash: offerId,
        amount_fiat: amountFiat,
        ...extraOptions,
    });
    return trade.id_hashed;
}
