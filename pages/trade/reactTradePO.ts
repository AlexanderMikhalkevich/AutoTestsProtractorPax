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
        lowReputationWarning: $(".qa-vendor-low-rep-warning-alert"),
        lowReputationWarningCloseButton: $(".qa-vendor-low-rep-warning-alert button.btn-close"), //TODO maybe it's better to delete this, because here is a generic alert element above
        actionTitle: $(".qa-action-title"),
        actionSub: $("div.action-sub"),
        reopenEscrowButton: $(".qa-reopen-escrow-button"),
        agreeToReopenEscrow: $("a.btn.pull-left.btn-info"),
        twoFactorField: $(".qa-release-coins-2fa-code-field"),
        releaseBitcoinsButton: $(".qa-release-bitcoin-button"),
        releaseBitcoinsWarningBuyerNotPaid: $(".qa-release-warning-buyer-not-paid"),
        releaseBitcoinsWarningBuyerHasPaid: $(".qa-release-warning-buyer-has-paid"),
        releaseBitcoinsWarningBuyerNotPaidDescription: $(
            ".qa-release-warning-buyer-not-paid-description",
        ),
        releaseBitcoinsWarningBuyerHasPaidDescription: $(
            ".qa-release-warning-buyer-has-paid-description",
        ),
        requestCodeButton: $(".qa-request-code-for-release-btn"),
        releaseBitcoinsButtonWarning: $(".qa-release-crypto-warning"),
        releaseBitcoinsButtonDescription: $(".qa-release-crypto-text"),
        releaseBitcoinError: $(".qa-release-modal-submit-error"),
        tradeStatusLabel: $(".qa-trade-status-label"),
        ctaContainer: $(".qa-cta-container"),
        ctaContainerPartnerAccountLink: $$(".qa-cta-container a")
            .filter((el) => el.isDisplayed())
            .first(),
        ctaContainerBuyBitcoinLink: $$(".qa-cta-container a")
            .filter((el) => el.isDisplayed())
            .last(),
        ctaContainerTitle: $$(".qa-trade-title-container-heading")
            .filter((el) => el.isDisplayed())
            .first(),
        ctaContainerTitleLink: $$(".qa-trade-title-container-heading a")
            .filter((el) => el.isDisplayed())
            .first(),
        // goToDashboardLink: $$(".qa-cta-container .title-container a")
        //     .filter((el) => el.isDisplayed())
        //     .first(),
        viewOrRepeatTradeButton: $(".qa-view-or-repeat-trade-button"),
        viewOrRepeatTradeDropDown: $(".qa-view-or-repeat-trade-dropdown"),
        goToClassicDashboardLink: $(".qa-go-to-classic-dashboard-link"),
        goToDashboardLink: $(".qa-go-to-dashboard-link"),
        ctaContainerAddToContactsButton: $(".qa-button-trust"),
        ctaContainerRemoveFromContactsButton: $(".qa-button-untrust"),
        protectYourBitcoinsWarning: $(".qa-protect-your-coins-modal"),
        protectYourBitcoinsWarningHeader: $(".qa-protect-your-crypto-warning-header"),
        protectYourBitcoinsWarningBody: $(".qa-protect-your-crypto-warning-body"),
        protectYourBitcoinsWarningCloseButton: $(".qa-protect-your-crypto-warning-button"),
        neverReleaseBitcoinCheckBox: $(".qa-neverReleaseBitcoinCheckBoxLabel"),
        neverPhoneCheckBox: $(".qa-neverPhoneCheckBoxLabel"),
        neverCodeCheckBox: $(".qa-neverCodeCheckBoxLabel"),
        neverEmailCheckBox: $(".qa-neverEmailCheckBoxLabel"),
        neverAdressCheckBox: $(".qa-neverAddressCheckBoxLabel"),
        neverEmployyeCheckBox: $(".qa-neverEmployeeCheckBoxLabel"),
        neverSuspiciousWebsitesBox: $(".qa-neverSuspiciousWebsitesBoxLabel"),
        paidButton: $(".qa-mark-paid-button"),
        paidButtonDescription: $(".qa-mark-paid-description"),
        cancelButton: $(".qa-cancel-trade-btn"),
        cancelButtonDescription: $(".qa-cancel-btn-description"),
        disputeCollapseContent: $(".qa-dispute-collapse-content"),
        disputeCollapseToggler: $(".qa-dispute-collapse-toggler"),
        disputeButton: $(".qa-start-dispute-button"),
        disputeButtonCountdown: $(".qa-start-dispute-button-countdown"),
        disputeButtonDescription: $(".qa-start-dispute-button-description"),
        successAlert: $(".qa-trade_page_block_success"),
        infoMessageBlock: $(".qa-trade_page_block_info"),
        viewOfferLink: $(".qa-trade-view-offer-link"),
        publicReceiptLink: element(
            by.cssContainingText(".qa-public-receipt-link", "Public Receipt"),
        ),
        reportAProblemBlock: {
            reportAProblemDropdown: $(".qa-trade-report-a-problem-dropdown"),
            reportAProblemDefaultReportButton: $(".qa-trade-report-a-problem-button"),
            reportAChargebackButton: $(".qa-trade-report-a-chargeback-button"),
            reportTooltip: $(".qa-trade-report-tooltip"),
        },
        reportAProblemLink: $(".qa-report-a-problem-link"),
        reportSuccessMessage: $("#report-user-form > div > div"),
        reportStatusTitle: $(".qa-trade-report-status-title"),
        reportStatus: $(".qa-trade-report-status"),
        reportScamStatus: $(".qa-trade-report-scam-status"),
        reportScamStatusText: $(".qa-trade-report-scam-status-text"),
        pleaseFollowInstructionsHeader: $(".qa-trade-instructions-header"),
        tagsContainer: $(".qa-offer-tags"),
        tags: $$(".qa-offer-tags .qa-offer-tag"),
        tradeInstructions: $(".qa-trade-instructions"),
        paymentTimeCountdown: $(".qa-payment-window-countdown-wrapper"),
        escrowInfo: $(".qa-escrow-info"),
        rate: $(".qa-trade-info-rate"),
        tradeId: $(".qa-trade-info-trade_id"),
        started: $(".qa-trade-info-started"),
        finishedTradeInfo: $(".qa-trade-info-finished-at"),

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
        cancellationModalConfirmCheckbox: cancellationModal.$(
            "label.qa-cancel-confirmation-checkbox-label",
        ),

        // release bitcoins modal
        releaseBitcoinsModal,
        releaseBitcoinsModalHeader: releaseBitcoinsModal.$(".qa-release-modal-header"),
        releaseBitcoinsModalContent: releaseBitcoinsModal.$(".qa-release-modal-content"),
        releaseBitcoinsModalContentDescription: releaseBitcoinsModal.$(
            ".qa-release-modal-content-description",
        ),
        releaseBitcoinsModalCloseButton: releaseBitcoinsModal.$(".qa-cancel-release"),
        releaseBitcoinsModalConfirmButton: releaseBitcoinsModal.$(".qa-confirm-release"),

        // reopen escrow modal
        reopenEscrowModal,
        reopenEscrowModalHeader: reopenEscrowModal.$(".qa-escrow-modal-header"),
        reopenEscrowModalContent: reopenEscrowModal.$(".qa-escrow-modal-content"),
        reopenEscrowModalCloseButton: reopenEscrowModal.$(".btn-outline-default"),
        reopenEscrowModalConfirmButton: reopenEscrowModal.$(".btn-primary"),

        // payment modal
        paymentModal: $(".qa-pay-confirmation-modal"),
        paymentModalHeader: $(".qa-pay-confirmation-modal .modal-header"),
        paymentModalBody: $(".qa-pay-confirmation-modal-body"),
        paymentModalTradeDetails: $(".qa-pay-confirmation-modal-details"),
        paymentModalCloseButton: $(".qa-pay-confirmation-modal-cancel-button"),
        paymentModalConfirmButton: $(".qa-pay-confirmation-modal-confirm-button"),
        paymentModalConfirmCheckbox: $(".qa-modal-confirm-checkbox-label"),

        // report scam
        reportScamModal: $("#report-user-form"),
        reportScamModalHeader: $(".qa-report-scam-modal-title"),
        reportScamModalHeaderCloseButton: $(".qa-report-scam-modal-close"),
        reportScamModalDescription: $(".qa-report-scam-modal-description"),
        reportScamModalTypeSelectOptionUsedGiftCard: element(
            by.cssContainingText(".qa-report-problem-modal-reasons-option", "Used gift card code"),
        ),
        reportScamModalTypeSelectOptionChargeback: element(
            by.cssContainingText(".qa-report-problem-modal-reasons-option", "Chargeback"),
        ),
        reportScamModalTypeSelectSelectedOption: $("#report-user-form select option:checked"),
        reportScamModalTypeSelectError: $("#trade-report-select-error-message"),
        reportScamModalDescriptionArea: $("#user-report-description"),
        reportScamModalDescriptionAreaError: $("#trade-report-description-error-message"),
        reportScamModalUploadButtonLabel: $(".qa-report-scam-modal-upload-button-label"),
        reportScamModalUploadButton: $(".qa-report-scam-modal-upload-button"),
        reportScamModalConfirmButtonIsLoading: $(
            '#reportScamModal button[type="submit"][data-loading]',
        ),

        // report a problem modal
        reportTradeModal: $(".qa-report-problem-modal"),
        reportTradeModalHeader: $(".qa-report-problem-modal-header"),
        reportTradeModalTypeSelect: $(".qa-report-problem-modal-reasons-select"),
        reportTradeModalTypeSelectOption: $$(".qa-report-problem-modal-reasons-option").first(),
        reportTradeModalTypeSelectOptionAbusiveLanguage: element(
            by.cssContainingText(".qa-report-problem-modal-reasons-option", "Abusive language"),
        ),
        reportTradeModalTypeSelectOptionRipper: element(
            by.cssContainingText(".qa-report-problem-modal-reasons-option", "Ripper"),
        ),
        reportTradeModalTypeSelectOptionCoinlocker: element(
            by.cssContainingText(".qa-report-problem-modal-reasons-option", "Coinlocker"),
        ),
        reportTradeModalTypeSelectInputSearch: $(".qa-report-problem-modal-reasons-input-search"),
        reportTradeModalDescription: $(".qa-report-problem-modal-description"),
        reportTradeModalTypeDescription: $(
            ".qa-report-problem-modal-reasons-selected-option-description",
        ),
        reportTradeModalTypeSelectError: $(".qa-report-problem-modal-reasons-selected-type-error"),
        reportTradeModalDescriptionArea: $(".qa-report-problem-modal-description-textarea"),
        reportTradeModalDescriptionAreaError: $(".qa-report-problem-modal-description-error"),
        reportTradeModalCloseButton: $(".qa-report-problem-modal-close-button"),
        reportTradeModalConfirmButton: $(".qa-report-problem-modal-confirm-button"),
        reportTradeModalConfirmButtonIsLoading: $(
            '#reportTradeModal button[type="submit"][data-loading]',
        ),
        reportTradeModalExtraDescription: $("#report-user-form .report-scam-description"),

        // feedback
        feedbackBlock: $(".qa-feedback-form-wrapper"),
        feedbackBlockReplyBlock: $(".qa-feedback-reply-form-wrapper"),
        feedbackTitle: $(".qa-feedback-message"),
        receivedFeedbackContainer: $(".received-feedback-container"),
        noFeedbackYetBlock: $(".qa-trade-page-no-feedback-yet"),
        commonTooltip: $(".qa-tooltip.fade.in"), // TODO it's actually a common tooltip, it does not belong to the trade page (as I can see in the html tree). maybe it make sense to move it to a home page
        positiveFeedbackButton: $(".qa-positive-feedback-button"),
        negativeFeedbackButton: $(".qa-negative-feedback-button"),
        negativeFeedbackTooltip: $(".qa-negative-feedback-tooltip"),
        editFeedbackButton: $(".qa-feedback-edit-feedback-button"),
        feedbackInputBox: $(".qa-feedback-message-textarea"),
        leaveFeedbackButton: $(".qa-feedback-submit-button"),
        feedbackMessageStatus: $("#trade_page_block_alerts"),
        leftFeedbackMessage: $(".qa-feedback-left-message"),
        receivedFeedbackMessage: $(".qa-feedback-received-message"),
        feedbackReplyButton: $(".qa-feedback-reply-btn"),
        feedbackReplyInputBox: $(".qa-feedback-reply-textarea"),
        feedbackReplyMessage: $(".qa-feedback-reply-message"),
        feedbackReplySubmitButton: $(".qa-feedback-submit-replay-btn"),
        feedbackReplyText: $(".qa-feedback-reply-on-given-feedback"),
        feedbackReplyEditButton: $(".qa-feedback-edit-reply-btn"),

        // feedback section. left user info
        feedbackSectionLeftUserInfoBlock: $(".qa-feedback-opponent-block"),
        feedbackSectionLeftUserInfoBlockNick: $(".qa-feedback-opponent-block .qa-summary-username"),
        feedbackSectionLeftUserInfoBlockBtcAmount: $(
            ".qa-feedback-opponent-block .qa-summary-crypto-amount",
        ),
        feedbackSectionLeftUserInfoBlockFiatAmount: $(
            ".qa-feedback-opponent-block .qa-summary-fiat-amount",
        ),

        // feedback section. right user info
        feedbackSectionRightUserInfoBlock: $(".qa-feedback-user-block"),
        feedbackSectionRightUserInfoBlockNick: $(".qa-feedback-user-block .qa-summary-username"),
        feedbackSectionRightUserInfoBlockBtcAmount: $(
            ".qa-feedback-user-block .qa-summary-crypto-amount",
        ),
        feedbackSectionRightUserInfoBlockFiatAmount: $(
            ".qa-feedback-user-block .qa-summary-fiat-amount",
        ),

        youNotReceivedPaymentYetModal: {
            iUnderstandCheckbox: $(".qa-release-confirmation-checkbox"),
            gotItButton: $(".qa-release-warning-submit-button"),
        },

        // add/remove favorites
        toggleFavoritesButton: $(".qa-toggle-favorite-offer"),

        // tour
        helpTourSkipButton: $("#tour-skip-button"),
    };

    async checkPageLoaded() {
        await browser.wait(
            EC.visibilityOf(this.elements.actionTitle),
            15000,
            "Can not load the trade page, can not see the action title",
        );
    }

    async reloadThePage() {
        await browser.refresh();
        await this.checkPageLoaded();
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

    async getReportTooltipText() {
        await browser.wait(
            EC.visibilityOf(this.elements.reportAProblemBlock.reportAProblemDefaultReportButton),
            10000,
            "Can't see a tooltip",
        );
        await browser.sleep(500);
        return this.elements.reportAProblemBlock.reportTooltip.getText();
    }

    async openTrade(tradeHash: string, checkIfOpened: boolean = true): Promise<void> {
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
        await browser.wait(EC.visibilityOf(this.elements.protectYourBitcoinsWarning), 15000);
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
        await this.elements.confirmRelease.click();
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
            EC.visibilityOf(this.elements.reportAProblemBlock.reportAProblemDefaultReportButton),
            5000,
            'Can not find the "Report a problem" link',
        );
        await browser.sleep(500);
        await this.elements.reportAProblemBlock.reportAProblemDefaultReportButton.click();
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
            EC.invisibilityOf(this.elements.reportTradeModalConfirmButtonIsLoading),
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
        await qaHelper.toBeInvisible(
            this.elements.feedbackBlock,
            15000,
            "Feedback form is visible",
        );
    }

    async updateFeedback() {
        await this.elements.editFeedbackButton.click();
        await qaHelper.toBeVisible(
            this.elements.feedbackBlock,
            15000,
            "Feedback form is not visible",
        );
        await this.elements.feedbackInputBox.sendKeys(updateFeedbackText);
        await this.elements.leaveFeedbackButton.click();
        await qaHelper.toBeInvisible(
            this.elements.feedbackBlock,
            15000,
            "Feedback form is visible",
        );
    }

    async leaveFeedbackReply() {
        await this.elements.feedbackReplyButton.click();
        await qaHelper.toBeVisible(
            this.elements.feedbackBlockReplyBlock,
            15000,
            "Reply form is not visible",
        );
        await this.elements.feedbackReplyInputBox.sendKeys(feedbackText);
        await this.elements.feedbackReplySubmitButton.click();
        await qaHelper.toBeInvisible(
            this.elements.feedbackBlockReplyBlock,
            15000,
            "Reply form is visible",
        );
    }

    async feedbackReplyUpdate() {
        await this.elements.feedbackReplyEditButton.click();
        await qaHelper.toBeVisible(
            this.elements.feedbackBlockReplyBlock,
            15000,
            "Reply form is not visible",
        );
        await this.elements.feedbackReplyInputBox.sendKeys(updateFeedbackText);
        await this.elements.feedbackReplySubmitButton.click();
        await qaHelper.toBeInvisible(
            this.elements.feedbackBlockReplyBlock,
            15000,
            "Reply form is visible",
        );
    }
}

export default new TradePage();
