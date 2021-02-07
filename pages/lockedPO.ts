import {$, by, element} from "protractor";

class LockedPage {
    elements = {
        accountLockedMsg: $('.h1.u-mb-20'),
        emailNotVerifiedText: element(by.xpath(".//p[contains(text(),'After you verify your email you can unlock your account yourself ')]")),
        unlockInstructions: $('.h4.u-mb-20'),
        loginBtn: $('.auth-button')
    };

    text = {
        accountLockedMsgText: 'Your account is locked because of unusual login location.',
        unlockInstructionsVerifiedText: 'We have sent an email to your account with instructions on how to unlock it.*',
        unlockInstructionsNotVerifiedText: 'Please contact customer support so we can verify your ownership.',
    }

    async isNotLoggedIn():Promise<boolean> {
        return this.elements.loginBtn.isPresent();
    }
}

export default new LockedPage();
