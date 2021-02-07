import { $, ElementFinder } from "protractor";

import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import settingsPage from "../../../pages/settingsPO";

const sp = settingsPage.elements;
const checkboxes: [string, ElementFinder, ElementFinder, boolean][] = [
    [
        "Someone viewed my profile - Notification",
        $(".qa-checkbox-notifyProfileViewed .form-checkbox"),
        $("input[name=notifyProfileViewed]"),
        false,
    ],
    [
        "Someone viewed my profile - Email",
        $(".qa-checkbox-notifyEmailProfileViewed .form-checkbox"),
        $("input[name=notifyEmailProfileViewed]"),
        false,
    ],
    [
        "Someone viewed my profile - App",
        $(".qa-checkbox-notifyAppProfileViewed .form-checkbox"),
        $("input[name=notifyAppProfileViewed]"),
        false,
    ],
    [
        "Someone viewed my offer - Notification",
        $(".qa-checkbox-notifyOfferViewed .form-checkbox"),
        $("input[name=notifyOfferViewed]"),
        true,
    ],
    [
        "Someone viewed my offer - Email",
        $(".qa-checkbox-notifyEmailOfferViewed .form-checkbox"),
        $("input[name=notifyEmailOfferViewed]"),
        true,
    ],
    [
        "Someone viewed my offer - App",
        $(".qa-checkbox-notifyAppOfferViewed .form-checkbox"),
        $("input[name=notifyAppOfferViewed]"),
        true,
    ],
    [
        "Bitcoin deposit pending - Notification",
        $(".qa-checkbox-notifyBitcoinsIncoming .form-checkbox"),
        $("input[name=notifyBitcoinsIncoming]"),
        true,
    ],
    [
        "Bitcoin deposit pending - Email",
        $(".qa-checkbox-notifyEmailBitcoinsIncoming .form-checkbox"),
        $("input[name=notifyEmailBitcoinsIncoming]"),
        true,
    ],
    [
        "Bitcoin deposit pending - App",
        $(".qa-checkbox-notifyAppBitcoinsIncoming .form-checkbox"),
        $("input[name=notifyAppBitcoinsIncoming]"),
        true,
    ],
    [
        "Bitcoin deposit confirmed - Notification",
        $(".qa-checkbox-notifyBitcoinsConfirmed .form-checkbox"),
        $("input[name=notifyBitcoinsConfirmed]"),
        true,
    ],
    [
        "Bitcoin deposit confirmed - Email",
        $(".qa-checkbox-notifyEmailBitcoinsConfirmed .form-checkbox"),
        $("input[name=notifyEmailBitcoinsConfirmed]"),
        true,
    ],
    [
        "Bitcoin deposit confirmed - App",
        $(".qa-checkbox-notifyAppBitcoinsConfirmed .form-checkbox"),
        $("input[name=notifyAppBitcoinsConfirmed]"),
        true,
    ],
    [
        "Incoming trade - Notification",
        $(".qa-checkbox-notifyIncomingTrade .form-checkbox"),
        $("input[name=notifyIncomingTrade]"),
        true,
    ],
    [
        "Incoming trade - Email",
        $(".qa-checkbox-notifyEmailIncomingTrade .form-checkbox"),
        $("input[name=notifyEmailIncomingTrade]"),
        true,
    ],
    [
        "Incoming trade - App",
        $(".qa-checkbox-notifyAppIncomingTrade .form-checkbox"),
        $("input[name=notifyAppIncomingTrade]"),
        true,
    ],
    [
        "Partner paid for trade - Notification",
        $(".qa-checkbox-notifyPartnerPaid .form-checkbox"),
        $("input[name=notifyPartnerPaid]"),
        true,
    ],
    [
        "Partner paid for trade - Email",
        $(".qa-checkbox-notifyEmailPartnerPaid .form-checkbox"),
        $("input[name=notifyEmailPartnerPaid]"),
        true,
    ],
    [
        "Partner paid for trade - App",
        $(".qa-checkbox-notifyAppPartnerPaid .form-checkbox"),
        $("input[name=notifyAppPartnerPaid]"),
        true,
    ],
    [
        "Trade cancelled/expired - Notification",
        $(".qa-checkbox-notifyTradeCancelled .form-checkbox"),
        $("input[name=notifyTradeCancelled]"),
        true,
    ],
    [
        "Trade cancelled/expired - Email",
        $(".qa-checkbox-notifyEmailTradeCancelled .form-checkbox"),
        $("input[name=notifyEmailTradeCancelled]"),
        true,
    ],
    [
        "Trade cancelled/expired - App",
        $(".qa-checkbox-notifyAppTradeCancelled .form-checkbox"),
        $("input[name=notifyAppTradeCancelled]"),
        true,
    ],
    [
        "Bitcoin sold - Notification",
        $(".qa-checkbox-notifyBitcoinsSold .form-checkbox"),
        $("input[name=notifyBitcoinsSold]"),
        true,
    ],
    [
        "Bitcoin sold - Email",
        $(".qa-checkbox-notifyEmailBitcoinsSold .form-checkbox"),
        $("input[name=notifyEmailBitcoinsSold]"),
        true,
    ],
    [
        "Bitcoin sold - App",
        $(".qa-checkbox-notifyAppBitcoinsSold .form-checkbox"),
        $("input[name=notifyAppBitcoinsSold]"),
        true,
    ],
    [
        "Bitcoin purchased - Notification",
        $(".qa-checkbox-notifyBitcoinsPurchased .form-checkbox"),
        $("input[name=notifyBitcoinsPurchased]"),
        true,
    ],
    [
        "Bitcoin purchased - Email",
        $(".qa-checkbox-notifyEmailBitcoinsPurchased .form-checkbox"),
        $("input[name=notifyEmailBitcoinsPurchased]"),
        true,
    ],
    [
        "Bitcoin purchased - App",
        $(".qa-checkbox-notifyAppBitcoinsPurchased .form-checkbox"),
        $("input[name=notifyAppBitcoinsPurchased]"),
        true,
    ],
    [
        "New chat message - Notification",
        $(".qa-checkbox-notifyNewChatMessage .form-checkbox"),
        $("input[name=notifyNewChatMessage]"),
        true,
    ],
    [
        "New chat message - Email",
        $(".qa-checkbox-notifyEmailNewChatMessage .form-checkbox"),
        $("input[name=notifyEmailNewChatMessage]"),
        true,
    ],
    [
        "New chat message - App",
        $(".qa-checkbox-notifyAppNewChatMessage .form-checkbox"),
        $("input[name=notifyAppNewChatMessage]"),
        true,
    ],

    [
        "Receive occasionally important emails from us",
        $(".qa-checkbox-emailSubscribed .form-checkbox"),
        sp.emailSubscribed,
        true,
    ],
    [
        "Play sound notifications on new messages and new incoming trade",
        $(".qa-checkbox-soundNotifications .form-checkbox"),
        sp.soundNotification,
        true,
    ],
];

let user;

async function scrollToCheckboxes() {
    await qaHelper.scrollToElement(checkboxes[Math.round(checkboxes.length / 2)][1]);
}

async function clickCheckboxesAndSave() {
    await scrollToCheckboxes();
    for (const checkbox of checkboxes) {
        await checkbox[1].click();
    }
    await settingsPage.saveButtonScroll();
    await settingsPage.verifyPageSave();
    await settingsPage.go();
    await settingsPage.checkPageLoadedLoggedIn();
}

async function getCheckboxState(checkbox) {
    return !!(await checkbox.getAttribute("checked"));
}

describe("Settings - Profile", () => {
    beforeAll(async () => {
        user = await qaHelper.createRandomUser();
        await qaHelper.activateEmail(user.id);
        await loginPage.logInAccount(user.email);
        await settingsPage.go();
        await settingsPage.checkPageLoadedLoggedIn();
    });

    it("allows to change the notification checkboxes state (and then change back to defaults) id5464", async () => {
        await clickCheckboxesAndSave();
        await scrollToCheckboxes();

        for (const checkbox of checkboxes) {
            const checkboxState = await getCheckboxState(checkbox[2]);
            const expectedState = !checkbox[3];
            const checkboxName = checkbox[0];
            expect(checkboxState).toBe(
                expectedState,
                `The "${checkboxName}" checkbox should be ${
                    expectedState ? "checked" : "unchecked"
                } after state changing`,
            );
        }

        await clickCheckboxesAndSave();
        await scrollToCheckboxes();

        for (const checkbox of checkboxes) {
            const checkboxState = await getCheckboxState(checkbox[2]);
            const expectedState = checkbox[3];
            const checkboxName = checkbox[0];
            expect(checkboxState).toBe(
                expectedState,
                `The "${checkboxName}" checkbox should be ${
                    expectedState ? "checked" : "unchecked"
                } after returning to default state`,
            );
        }
    });
});
