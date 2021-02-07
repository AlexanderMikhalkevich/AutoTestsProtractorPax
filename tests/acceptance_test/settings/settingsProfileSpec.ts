import qaHelper from "../../../utils/qaHelper";
import loginPage from "../../../pages/loginPO";
import settingsPage from "../../../pages/settingsPO";

describe("Settings - Profile", () => {
    let user;

    describe("User profile configuration", () => {
        beforeAll(async () => {
            user = await qaHelper.createRandomUser();
            await qaHelper.activateEmail(user.id);
            await loginPage.logInAccount(user.email);
        });

        beforeEach(async () => {
            await settingsPage.go();
            await settingsPage.checkPageLoadedLoggedIn();
        });

        it("should add bio and confirm id120", async () => {
            await settingsPage.addBioInSettings();
        });

        it("should add preferred currency and confirm id121", async () => {
            await qaHelper.scrollToElement(settingsPage.elements.preferredCurrencyDropdown);
            await settingsPage.selectCurrency(settingsPage.text.currency);
            await settingsPage.saveButtonScroll();
            await settingsPage.verifyPageSave();
            await qaHelper.scrollToElement(settingsPage.elements.preferredCurrencyDropdown);
            expect(
                await settingsPage.elements.preferredCurrencyDropdown.getAttribute("value"),
            ).toContain(settingsPage.text.currency);
        });

        // TODO: make it work inside selenoid
        // it('should upload avatar id119', async () => {
        //     var uploadButton = $('.profile-avatar-wrapper button');
        //     await uploadButton.click();
        //     await browser.switchTo().frame(element(by.id('filepicker_dialog')).getWebElement());
        //     await browser.sleep(3000);
        //     await browser.element(by.id('fileUploadInput')).sendKeys(path.resolve('./test_acceptance/qa_helper/avatar.jpg'));
        //     await browser.sleep(6000);
        //     await browser.getAllWindowHandles().then(async function(handles){
        //         await browser.switchTo().window(handles[0]).then(async function(){
        //             expect(await element(by.cssContainingText('.dragpaneclass', 'avatar.jpg' )).isDisplayed());
        //         });
        //     });
        // });

        it("should add timezone and confirm id2529", async () => {
            await qaHelper.scrollToElement(settingsPage.elements.timeZoneDropdown);
            await settingsPage.selectTimeZone(settingsPage.text.timeZone);
            await settingsPage.saveButtonScroll();
            await settingsPage.verifyPageSave();
            await qaHelper.scrollToElement(settingsPage.elements.timeZoneDropdown);
            expect(await settingsPage.elements.timeZoneDropdown.getAttribute("value")).toContain(
                settingsPage.text.timeZone,
            );
        });
    });

    // TODO: fix the test. need to generate some valid but unused numbers
    // describe('Phone confirming', () => {
    //     beforeAll(async () => {
    //         user = await qaHelper.createRandomUser();
    //         await loginPage.logInAccount(user.email);
    //         await settingsPage.go();
    //         await settingsPage.checkPageLoadedLoggedIn();
    //         await settingsPage.addSecurityQuestions();
    //     });
    //
    //     beforeEach(async () => {
    //         await settingsPage.go();
    //         await settingsPage.checkPageLoadedLoggedIn();
    //     });
    //
    //     it('should add phone and confirm id123', async () => {
    //         const userId = await qaHelper.getUserId('phone@paxful.com');
    //         const phone = await qaHelper.activatePhone(userId, '37259008080');
    //         await browser.sleep(1000);
    //
    //         await browser.element(by.id('phoneCode')).sendKeys('000000');
    //         await browser.element(by.id('phone-code-submit-btn')).click();
    //         await browser.sleep(20000);
    //         const successMessage = element(by.css('.successmsg'));
    //         expect(await successMessage.isDisplayed()).toBe(true);
    //     });
    // });
});
