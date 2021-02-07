import { $, $$, browser, by, element, ExpectedConditions as EC } from "protractor";

import qaHelper from "../../utils/qaHelper";
import moreInfoSidePanelComponent from "./moreInfoSidePanelComponent";

// to be able to get relative elements below in the Elements object. make sense in case of long selectors
const cancellationModal = $(".qa-cancellation-modal");

const releaseBitcoinsModal = $(".qa-release-modal");

const reopenEscrowModal = $(".qa-escrow-modal");

export const feedbackText = "Input test feedback text - !@#$%^*()_+/~ÖÄüõ"; //TODO maybe to update in future with special characters when feedback inputs will be fixed to do not replace (& ' " etc) with html entities.
export const updateFeedbackText = "_text to update existing feedback!";
export const updatedFeedbackText = feedbackText + updateFeedbackText;

class TradePage {
    elements = {
        alert: $$("div.alert-dismissible")
            .filter((el) => el.isDisplayed())
            .first(),
        alertButton: $$("div.alert-dismissible")
            .filter((el) => el.isDisplayed())
            .first()
            .$("button"),
        lowReputationWarning: $(".vendor-low-rep-warning .alert"),
        lowReputationWarningCloseButton: $(".vendor-low-rep-warning .alert .qa-btn-close"), //TODO maybe it's better to delete this, because here is a generic alert element above
        actionTitle: $(".qa-action-title"),
        actionSub: $("div.action-sub"),
        reopenEscrowButton: $(".btn.btn-info"),
        agreeToReopenEscrow: $("a.btn.pull-left.btn-info"),
        twoFactorField: $("#two_factor_code"),
        releaseBitcoinsButton: $("button#release_coins_btn"),
        requestCodeButton: $("#send_code_btn"),
        releaseBitcoinsButtonWarning: $(".qa-release-crypto-warning"),
        releaseBitcoinsButtonDescription: $(".qa-release-crypto-text"),
        tradeStatusLabel: $("#trade_status_label"),
        ctaContainer: $("#cta_container"),
        ctaContainerPartnerAccountLink: $$("#cta_container a")
            .filter((el) => el.isDisplayed())
            .first(),
        ctaContainerBuyBitcoinLink: $$("#cta_container a")
            .filter((el) => el.isDisplayed())
            .last(),
        ctaContainerTitle: $$(".qa-trade-title-container-heading")
            .filter((el) => el.isDisplayed())
            .first(),
        ctaContainerTitleLink: $$(".qa-trade-title-container-heading a")
            .filter((el) => el.isDisplayed())
            .first(),
        goToDashboardLink: $$("#cta_container .title-container a")
            .filter((el) => el.isDisplayed())
            .first(),
        ctaContainerAddToContactsButton: $("#btn-trust"),
        protectYourBitcoinsWarning: $("#protection-warning-modal"),
        protectYourBitcoinsWarningHeader: $(".qa-protect-your-crypto-warning-header"),
        protectYourBitcoinsWarningBody: $("#protection-warning-modal .modal-body"),
        protectYourBitcoinsWarningCloseButton: $("#protection-warning-btn"),
        neverReleaseBitcoinCheckBox: $(
            "#protection-warning-modal > div.modal-dialog > div > div.modal-body > div:nth-child(2) > div > label",
        ),
        neverPhoneCheckBox: $(
            "#protection-warning-modal > div.modal-dialog > div > div.modal-body > div:nth-child(3) > div > label",
        ),
        neverCodeCheckBox: $(
            "#protection-warning-modal > div.modal-dialog > div > div.modal-body > div:nth-child(4) > div > label",
        ),
        neverEmailCheckBox: $(
            "#protection-warning-modal > div.modal-dialog > div > div.modal-body > div:nth-child(5) > div > label",
        ),
        neverAdressCheckBox: $(
            "#protection-warning-modal > div.modal-dialog > div > div.modal-body > div:nth-child(6) > div > label",
        ),
        neverEmployyeCheckBox: $(
            "#protection-warning-modal > div.modal-dialog > div > div.modal-body > div:nth-child(7) > div > label",
        ),
        neverSuspiciousWebsitesBox: $(
            "#protection-warning-modal > div.modal-dialog > div > div.modal-body > div:nth-child(8) > div > label",
        ),
        paidButton: $("#mark_paid_btn"),
        paidButtonDescription: $(".mark-as-paid-container .action-button-text"),
        cancelButton: $("button#cancel_trade_btn"),
        cancelButtonDescription: $(".qa-cancel-btn-description"),
        disputeButton: $(".qa-start-dispute-button"),
        disputeButtonDescription: $(".qa-start-dispute-button-description"),
        successAlert: $(".qa-trade_page_block_success"),
        infoMessageBlock: $(".qa-trade_page_block_info"),
        viewOfferLink: element(by.cssContainingText(".trade-footer a", "View offer")),
        publicReceiptLink: element(
            by.cssContainingText(".qa-public-receipt-link", "Public Receipt"),
        ),
        reportAProblemLink: $(".qa-report-a-problem-link"),
        reportSuccessMessage: $("#report-user-form > div > div"),
        reportStatus: $(".qa-trade-report-status"),
        reportScamStatus: $(".qa-trade-report-scam-status"),
        reportScamStatusText: $(".qa-trade-report-scam-status-text"),
        pleaseFollowInstructionsHeader: $(".qa-trade-instructions-header"),
        tagsContainer: $(".qa-offer-tags"),
        tags: $$(".qa-offer-tags > .tag"),
        tradeInstructions: $("#info_block p"),
        paymentTimeCountdown: $(".payment-window-countdown-wrapper"),
        escrowInfo: $("#escrow_info"),
        rate: $(".qa-trade-info-rate"),
        tradeId: $(".qa-trade-info-trade_id"),
        started: $(".qa-trade-info-started"),
        finishedTradeInfo: $("#trade_info_finish_column"),

        whatHappensNextModal: $(".qa-what-happen-next-dialog"),
        whatHappensNextModalHeader: $(".qa-what-happen-next-header"),
        whatHappensNextModalCloseButton: $(".qa-what-happen-next-btn"),

        confirmRelease: $(".qa-confirm-release"),
        cancelRelease: $(".qa-cancel-release"),
        notPaidWarning: $(".qa-not-paid-warning"),

        confirmRelease2fa: $(".qa-confirm-release-2fa"),
        cancelRelease2fa: $(".qa-cancel-release-2fa"),
        notPaidWarning2fa: $("#two-factor-release-modal .not-paid-warning"),

        // cancellation modal
        cancellationModal,
        cancellationModalHeader: cancellationModal.$(".qa-cancellation-modal-content"),
        cancellationModalCloseButton: cancellationModal.$(".qa-cancellation-btn-dismiss"),
        cancellationModalConfirmButton: cancellationModal.$(".qa-cancellation-btn-apply"),
        cancellationModalConfirmCheckbox: cancellationModal.element(
            by.xpath('//label[@for="cancelTradeCheckbox"]'),
        ),

        // release bitcoins modal
        releaseBitcoinsModal,
        releaseBitcoinsModalHeader: releaseBitcoinsModal.$(".qa-release-modal-content"),
        releaseBitcoinsModalCloseButton: releaseBitcoinsModal.$(".qa-cancel-release"),
        releaseBitcoinsModalConfirmButton: releaseBitcoinsModal.$(".qa-confirm-release"),

        // reopen escrow modal
        reopenEscrowModal,
        reopenEscrowModalHeader: reopenEscrowModal.$(".qa-escrow-modal-content"),
        reopenEscrowModalCloseButton: reopenEscrowModal.$(".qa-escrow-btn-dismiss"),
        reopenEscrowModalConfirmButton: reopenEscrowModal.$(".qa-escrow-btn-apply"),

        // payment modal
        paymentModal: $("#confirmPaymentModal"),
        paymentModalHeader: $("#confirmPaymentModal .modal-header"),
        paymentModalBody: $("#confirmPaymentModal .modal-body > p"),
        paymentModalTradeDetails: $(".qa-confirm-offer-terms > p"),
        paymentModalCloseButton: $(".qa-cancel-payment-button"),
        paymentModalConfirmButton: $(".qa-confirm-payment-button"),
        paymentModalConfirmCheckbox: $(".qa-modal-confirm-checkbox label"),

        // report scam
        reportScamModal: $("#report-user-form"),
        reportScamModalHeader: $(".qa-report-scam-modal-title"),
        reportScamModalHeaderCloseButton: $(".qa-report-scam-modal-close"),
        reportScamModalDescription: $(".qa-report-scam-modal-description"),
        reportScamModalTypeSelectOptionUsedGiftCard: element(
            by.cssContainingText(".select2-results__option", "Used gift card code"),
        ),
        reportScamModalTypeSelectOptionChargeback: element(
            by.cssContainingText(".select2-results__option", "Chargeback"),
        ),
        reportScamModalTypeSelectSelectedOption: $("#report-user-form select option:checked"),
        reportScamModalTypeSelectError: $("#trade-report-select-error-message"),
        reportScamModalDescriptionArea: $("#user-report-description"),
        reportScamModalDescriptionAreaError: $("#trade-report-description-error-message"),
        reportScamModalUploadButtonLabel: $(".qa-report-scam-modal-upload-button-label"),
        reportScamModalUploadButton: $("#report-user-form .modal-body #report-attachments-btn"),
        reportScamModalConfirmButtonIsLoading: $(
            '#reportScamModal button[type="submit"][data-loading]',
        ),

        // report a problem modal
        reportTradeModal: $("#reportTradeModal"),
        reportTradeModalHeader: $("#reportTradeModal .modal-title"),
        reportTradeModalTypeSelect: $("#select2-report-trade-modal-select-container"),
        reportTradeModalTypeSelectOptionAbusiveLanguage: element(
            by.cssContainingText(".select2-results__option", "Abusive language"),
        ),
        reportTradeModalTypeSelectOptionRipper: element(
            by.cssContainingText(".select2-results__option", "Ripper"),
        ),
        reportTradeModalTypeSelectOptionCoinlocker: element(
            by.cssContainingText(".select2-results__option", "Coinlocker"),
        ),
        reportTradeModalTypeSelectSelectedOption: $("#reportTradeModal select option:checked"),
        reportTradeModalTypeDescription: $("#report-user-form .modal-body ul"),
        reportTradeModalTypeSelectError: $(".qa-report-trade-modal-type-select-error"),
        reportTradeModalDescriptionArea: $("#reportTradeModal textarea"),
        reportTradeModalDescriptionAreaError: $(".qa-report-trade-modal-type-description-error"),
        reportTradeModalCloseButton: $("#reportTradeModal button.btn[data-dismiss]"),
        reportTradeModalConfirmButton: $("#report-ladda-button"),
        reportTradeModalConfirmButtonIsLoading: $(
            '#reportTradeModal button[type="submit"][data-loading]',
        ),
        reportTradeModalExtraDescription: $("#report-user-form .report-scam-description"),

        // feedback
        feedbackTitle: $(".qa-feedback-message"),
        receivedFeedbackContainer: $(".received-feedback-container"),
        commonTooltip: $(".qa-tooltip.fade.in"), // TODO it's actually a common tooltip, it does not belong to the trade page (as I can see in the html tree). maybe it make sense to move it to a home page
        positiveFeedbackButton: $("#feedback label.positive"),
        negativeFeedbackButton: $("#feedback label.dislike"),
        editFeedbackButton: $("#feedback #edit-left-feedback"),
        feedbackInputBox: $("#feedback #feedback-message"),
        leaveFeedbackButton: $("div#feedback #feedback-submit"),
        feedbackMessageStatus: $("#trade_page_block_alerts"),
        feedbackReplyMessageStatus: $("#trade_page_block > div:nth-child(1)"),
        leftFeedbackMessage: $(".partner-feedback .reply_message"),
        feedbackReplyButton: $("#feedback-reply-box-btn"),
        feedbackReplyInputBox: $("#reply"),
        feedbackReplyMessage: $(
            "#feedback > div.received-feedback-container > div.received-feedback-message-container.card > div.partner-feedback.p-3 > div.bg-gray-200.p-3.mt-3.rounded.mb-2",
        ),
        feedbackReplySubmitButton: $("#feedback-reply-form > div:nth-child(4) > button"),
        feedbackReplyText: $(
            "#feedback-form > div.feedback-rating-container.mt-3.pt-3.mt-lg-3.pt-lg-3 > div > div > div.bg-gray-200.p-3.mt-3.rounded.mb-2",
        ), //feedback reply text on receiver side
        receivedFeedbackMessage: $(
            "#feedback .received-feedback-container .received-feedback-wrapper .alert-success",
        ),
        feedbackReplyEditButton: element(by.cssContainingText("#feedback-reply-box-btn", "Edit")),

        // feedback section. left user info
        feedbackSectionLeftUserInfoBlock: $(".qa-feedback-opponent-block"),
        feedbackSectionLeftUserInfoBlockNick: $(".qa-feedback-opponent-username"),
        feedbackSectionLeftUserInfoBlockBtcAmount: $(".qa-feedback-opponent-crypto-amount"),
        feedbackSectionLeftUserInfoBlockFiatAmount: $(".qa-feedback-opponent-fiat-amount"),

        // feedback section. right user info
        feedbackSectionRightUserInfoBlock: $(".qa-feedback-user-block"),
        feedbackSectionRightUserInfoBlockNick: $(".qa-feedback-user-username"),
        feedbackSectionRightUserInfoBlockBtcAmount: $(".qa-feedback-user-crypto-amount"),
        feedbackSectionRightUserInfoBlockFiatAmount: $(".qa-feedback-user-fiat-amount"),

        youNotReceivedPaymentYetModal: {
            iUnderstandCheckbox: $('label[for="warning-release-agree-checkbox"]'),
            gotItButton: $("#warning-release-submit"),
        },
        helpTourSkipButton: $("#tour-skip-button"),
    };

    async checkPageLoaded() {
        await browser.wait(
            EC.visibilityOf(this.elements.actionTitle),
            10000,
            "Can not load the trade page, can not see the action title",
        );
    }

    async getInfoMessageBlockText() {
        await browser.wait(
            EC.visibilityOf(this.elements.infoMessageBlock),
            10000,
            "Can't see the info message block",
        );
        await browser.sleep(500);
        return this.elements.infoMessageBlock.getText();
    }

    async getCommonTooltipText() {
        await browser.wait(
            EC.visibilityOf(this.elements.commonTooltip),
            10000,
            "Can't see a tooltip",
        );
        await browser.sleep(500);
        return this.elements.commonTooltip.getText();
    }

    async openTrade(tradeHash: string, checkIfOpened = true): Promise<void> {
        await browser.get(`${browser.params.baseUrl}/trade/${tradeHash}`);
        if (checkIfOpened) await this.checkPageLoaded();
    }

    async getTagsCount(): Promise<number> {
        return await this.elements.tags.count();
    }

    async getNthTagsText(n: number): Promise<string> {
        return await this.elements.tags.get(n).getText();
    }

    async reopenEscrow() {
        const elements = this.elements;

        await elements.reopenEscrowButton.click();
        await browser.wait(
            EC.elementToBeClickable(this.elements.agreeToReopenEscrow),
            15000,
            "agree to reopen ecrow didnt show up in 15 seconds",
        );
        await qaHelper.toBeClickable(
            elements.agreeToReopenEscrow,
            15000,
            "didnt confirm to reopen escrow",
        );
        await elements.agreeToReopenEscrow.click();
    }

    async payInTrade() {
        await this.pressPaidButton();
        await this.confirmPaid();
    }

    async payInTradeWithConfirmationCheckbox() {
        await this.pressPaidButton();
        await this.confirmPaidWithCheckbox();
    }

    async pressPaidButton() {
        await qaHelper.toBeClickable(this.elements.paidButton, 15000, "paid button is not visible");
        await browser.sleep(500);
        await this.elements.paidButton.click();
        await browser.sleep(500);
    }

    async pressCancelPaymentButton() {
        await qaHelper.toBeClickable(
            this.elements.paymentModalCloseButton,
            15000,
            "close payment modal button is not visible",
        );
        await browser.sleep(500);
        await this.elements.paymentModalCloseButton.click();
        await browser.sleep(500);
    }

    async confirmPaid() {
        await qaHelper.toBeClickable(
            this.elements.paymentModalConfirmButton,
            15000,
            "confirm paid button is not visible",
        );
        await browser.sleep(500);
        await this.elements.paymentModalConfirmButton.click();
        await browser.sleep(500);
    }

    async confirmPaidWithCheckbox() {
        await this.elements.paymentModalConfirmCheckbox.click();
        await qaHelper.toBeClickable(
            this.elements.paymentModalConfirmButton,
            15000,
            "confirm paid button is not visible",
        );
        await browser.sleep(500);
        await this.elements.paymentModalConfirmButton.click();
        await browser.sleep(500);
    }

    async closeNotificationWithLessThan20Trade() {
        await browser.wait(
            EC.visibilityOf(this.elements.protectYourBitcoinsWarningCloseButton),
            5000,
        );
        await browser.sleep(500);
        await this.elements.neverReleaseBitcoinCheckBox.click();
        await this.elements.neverPhoneCheckBox.click();
        await this.elements.neverCodeCheckBox.click();
        await this.elements.neverEmailCheckBox.click();
        await this.elements.neverAdressCheckBox.click();
        await this.elements.neverEmployyeCheckBox.click();
        await this.elements.neverSuspiciousWebsitesBox.click();
        await browser.sleep(500);
        await this.elements.protectYourBitcoinsWarningCloseButton.click();
        await browser.sleep(500);
    }

    async closeNotification1SuccesfullTrade() {
        await browser.wait(
            EC.visibilityOf(this.elements.protectYourBitcoinsWarningCloseButton),
            5000,
        );
        await browser.sleep(500);
        await this.elements.protectYourBitcoinsWarningCloseButton.click();
        await browser.sleep(500);
    }

    async releaseBitcoinsWith2fa(userHasMoreThan5Trades = false) {
        await this.pressReleaseBitcoinsButton();

        if (!userHasMoreThan5Trades) {
            await this.pressIGotItBeforeBitcoinRelease();
        }

        await browser.wait(
            EC.elementToBeClickable(this.elements.requestCodeButton),
            10000,
            "2fa modal should load within 10 seconds",
        );
        await this.elements.requestCodeButton.click();
        await browser.wait(
            EC.elementToBeClickable(this.elements.twoFactorField),
            10000,
            "2fa modal should load within 10 seconds",
        );
        await this.elements.twoFactorField.sendKeys("000000");
        await this.elements.confirmRelease2fa.click();
    }

    async releaseBitcoinsWithout2fa(userHasMoreThan5Trades = false) {
        await this.pressReleaseBitcoinsButton();

        if (!userHasMoreThan5Trades) {
            await this.pressIGotItBeforeBitcoinRelease();
        }

        await browser.wait(
            EC.visibilityOf(this.elements.confirmRelease),
            10000,
            "release coins should load within 10 seconds",
        );
        await browser.sleep(500);
        await this.elements.confirmRelease.click();
    }

    async pressIGotItBeforeBitcoinRelease() {
        await this.elements.youNotReceivedPaymentYetModal.iUnderstandCheckbox.click();
        await this.elements.youNotReceivedPaymentYetModal.gotItButton.click();
    }

    async pressReleaseBitcoinsButton() {
        await browser.wait(
            EC.visibilityOf(this.elements.releaseBitcoinsButton),
            30000,
            "Release Bitcoin button is not visible",
        );
        await this.elements.releaseBitcoinsButton.click();
        await browser.sleep(500);
    }

    async pressReopenEscrowButton() {
        await browser.wait(EC.visibilityOf(this.elements.reopenEscrowButton));
        await this.elements.reopenEscrowButton.click();
        await browser.sleep(500);
    }

    async waitForTradeStatus(status): Promise<void> {
        await browser.wait(
            EC.textToBePresentInElement(this.elements.tradeStatusLabel, status),
            30000,
            "trade status did not change after release of coins",
        );
        expect(await this.elements.tradeStatusLabel.getText()).toBe(status);
    }

    async pressViewOfferLink() {
        await browser.wait(
            EC.visibilityOf(this.elements.viewOfferLink),
            5000,
            'Can not find the "View offer" link',
        );
        await qaHelper.scrollToElement(this.elements.viewOfferLink);
        await this.elements.viewOfferLink.click();
        await qaHelper.switchToNewTab();
        await qaHelper.waitForPageToBeLoaded();
    }

    async pressReportAProblemLink() {
        await browser.wait(
            EC.visibilityOf(this.elements.reportAProblemLink),
            5000,
            'Can not find the "Report a problem" link',
        );
        await browser.sleep(500);
        await this.elements.reportAProblemLink.click();
        await browser.wait(
            EC.visibilityOf(this.elements.reportTradeModalHeader),
            5000,
            'Can not open the "Report this Trade" modal',
        );
        await browser.sleep(500);
    }

    async closeReportAProblemModal() {
        await browser.wait(
            EC.visibilityOf(this.elements.reportTradeModalCloseButton),
            5000,
            'Can not see the "Report this Trade" modal\'s close button',
        );
        await browser.sleep(500);
        await this.elements.reportTradeModalCloseButton.click();
        await browser.sleep(500);
    }

    async confirmReportAProblem() {
        await browser.wait(
            EC.visibilityOf(this.elements.reportTradeModalConfirmButton),
            5000,
            'Can not see the "Report this Trade" modal\'s confirm button',
        );
        await this.elements.reportTradeModalConfirmButton.click();
        await browser.wait(
            EC.invisibilityOf(this.elements.reportTradeModalConfirmButtonIsLoading),
            5000,
            'The "Report this Trade" modal is still loading something',
        );
        await browser.sleep(2000); // TODO fix it. wait for a success message to disappear instead
    }

    async confirmReportScam() {
        await browser.wait(
            EC.visibilityOf(this.elements.reportTradeModalConfirmButton),
            5000,
            'Can not see the "Report scam" modal\'s confirm button',
        );
        await this.elements.reportTradeModalConfirmButton.click();
        await browser.wait(
            EC.invisibilityOf(this.elements.reportScamModalConfirmButtonIsLoading),
            5000,
            'The "Report scam" modal is still loading something',
        );
        await browser.sleep(2000); // TODO fix it. wait for a success message to disappear instead
    }

    async cancelTrade() {
        await this.pressCancelButton();
        await this.confirmCancellation();
        await qaHelper.waitForPageToBeLoaded();
    }

    async pressCancelButton() {
        await qaHelper.toBeClickable(
            this.elements.cancelButton,
            15000,
            "cancel button is not visible",
        );
        await browser.sleep(500);
        await this.elements.cancelButton.click();
        await browser.sleep(500);
    }

    async confirmCancellation() {
        await qaHelper.toBeVisible(
            this.elements.cancellationModalConfirmCheckbox,
            15000,
            "YES button on the trade cancellation modal is not visible",
        );
        await browser.sleep(500);
        await this.elements.cancellationModalConfirmCheckbox.click();
        await qaHelper.toBeClickable(
            this.elements.cancellationModalConfirmButton,
            15000,
            "YES button on the trade cancellation modal is not visible",
        );
        await this.elements.cancellationModalConfirmButton.click();
        await browser.sleep(500);
    }

    async closeCancellationModal() {
        await qaHelper.toBeClickable(
            this.elements.cancellationModalCloseButton,
            15000,
            "NO button on the trade cancellation modal is not visible",
        );
        await browser.sleep(500);
        await this.elements.cancellationModalCloseButton.click();
        await browser.sleep(500);
    }

    async confirmReleaseBitcoins() {
        await qaHelper.toBeClickable(
            this.elements.releaseBitcoinsModalConfirmButton,
            15000,
            "YES button on the Release Bitcoins modal is not visible",
        );
        await browser.sleep(500);
        await this.elements.releaseBitcoinsModalConfirmButton.click();
        await browser.sleep(500);
    }

    async closeReleaseBitcoinsModal() {
        await qaHelper.toBeClickable(
            this.elements.releaseBitcoinsModalCloseButton,
            15000,
            "NO button on the Release Bitcoins modal is not visible",
        );
        await browser.sleep(500);
        await this.elements.releaseBitcoinsModalCloseButton.click();
        await browser.sleep(500);
    }

    async confirmReopenEscrow() {
        await qaHelper.toBeClickable(
            this.elements.reopenEscrowModalConfirmButton,
            15000,
            "YES button on the Reopen Escrow modal is not visible",
        );
        await browser.sleep(500);
        await this.elements.reopenEscrowModalConfirmButton.click();
        await browser.sleep(500);
    }

    async closeReopenEscrowModal() {
        await qaHelper.toBeClickable(
            this.elements.reopenEscrowModalCloseButton,
            15000,
            "NO button on the Reopen Escrow modal is not visible",
        );
        await browser.sleep(500);
        await this.elements.reopenEscrowModalCloseButton.click();
        await browser.sleep(500);
    }

    async getTradeHash(): Promise<string> {
        return (await browser.getCurrentUrl()).split("/trade/")[1];
    }

    async openMoreInfoSidePanel() {
        await moreInfoSidePanelComponent.open();
    }

    async closeMoreInfoSidePanel() {
        await moreInfoSidePanelComponent.close();
    }

    async leaveFeedback() {
        await this.elements.positiveFeedbackButton.click();
        await this.elements.feedbackInputBox.sendKeys(feedbackText);
        await this.elements.leaveFeedbackButton.click();
    }

    async updateFeedback() {
        await this.elements.editFeedbackButton.click();
        await this.elements.feedbackInputBox.sendKeys(updateFeedbackText);
        await this.elements.leaveFeedbackButton.click();
    }

    async leaveFeedbackReply() {
        await this.elements.feedbackReplyButton.click();
        await this.elements.feedbackReplyInputBox.sendKeys(feedbackText);
        await this.elements.feedbackReplySubmitButton.click();
    }

    async feedbackReplyUpdate() {
        await this.elements.feedbackReplyEditButton.click();
        await this.elements.feedbackReplyInputBox.sendKeys(updateFeedbackText);
        await this.elements.feedbackReplySubmitButton.click();
    }
}

export default new TradePage();
