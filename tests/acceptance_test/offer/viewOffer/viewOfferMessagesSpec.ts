import qaHelper from "../../../../utils/qaHelper";
import loginPage from "../../../../pages/loginPO";
import offerViewPage from "../../../../pages/offerViewPO";

describe("View Offer messages", () => {
    describe("", () => {
        let normalOffer;
        let offerOwner_nick;

        beforeAll(async () => {
            const offerOwner = await qaHelper.createRandomUser(true);
            const user_id = offerOwner.id;
            offerOwner_nick = offerOwner.nick;
            await qaHelper.addBalance(user_id, 1000000000);
            await qaHelper.toggleKycVerification(user_id, { id: true, document: false });
            await qaHelper.depositBond(user_id);
            normalOffer = await qaHelper.createSpecificOffer({ user_id });
        });

        describe("when email is verified but phone is not", () => {
            beforeAll(async () => {
                const stranger = await qaHelper.createRandomUser();
                await qaHelper.activateEmail(stranger.id);
                await loginPage.logInAccount(stranger.email);
            });

            it("should display 'we need some additional details' message on the view offer page if phone is not verified id5310", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(await offerViewPage.elements.underButtonMessageFirst.getText()).toBe(
                    "We need some additional details\n" +
                        "To buy Bitcoin from " +
                        offerOwner_nick +
                        " you need to verify your email and phone number.\n" +
                        "Start verification",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });
        });

        describe("when phone is verified but email is not", () => {
            beforeAll(async () => {
                const stranger = await qaHelper.createRandomUser();
                await qaHelper.togglePhoneVerification(stranger.id);
                await loginPage.logInAccount(stranger.email);
            });

            it("should display 'we need some additional details' message on the view offer page if email is not verified id5309", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(await offerViewPage.elements.underButtonMessageFirst.getText()).toBe(
                    "We need some additional details\n" +
                        "To buy Bitcoin from " +
                        offerOwner_nick +
                        " you need to verify your email and phone number.\n" +
                        "Start verification",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });
        });

        // excluded since pipelines settings are not matching this test. Can be included when KYC check is ON.
        xdescribe("when email and phone are verified but username is not", () => {
            beforeAll(async () => {
                const stranger = await qaHelper.createRandomUser();
                await qaHelper.activateEmail(stranger.id);
                await qaHelper.togglePhoneVerification(stranger.id);
                await qaHelper.verifyUsername(stranger.id, false);
                await loginPage.logInAccount(stranger.email);
            });

            it("should display 'we need some additional details' message on the view offer page if username is not verified id23626", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(await offerViewPage.elements.underButtonMessageFirst.getText()).toBe(
                    "ID verification needed\n" +
                        "You can currently trade up to 1000 USD worth of cryptocurrency. Please verify your identity to increase your trading limit.\n" +
                        "Getting verified on Paxful is easy and you can get it done in a few minutes.\n" +
                        "Verify identity",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });
        });

        describe("", () => {
            let normalOffer;

            beforeAll(async () => {
                const offerOwner = await qaHelper.createRandomUser(true);
                const user_id = offerOwner.id;
                await qaHelper.toggleKycVerification(user_id, { id: true, document: false });
                normalOffer = await qaHelper.createSpecificOffer({ user_id });

                const stranger = await qaHelper.createRandomUser();
                await qaHelper.activateEmail(stranger.id);
                await qaHelper.togglePhoneVerification(stranger.id);
                await loginPage.logInAccount(stranger.email);
            });

            it("should display correct message on offer page when offer owner does not have enough btc and have no deposited bond id6626", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(await offerViewPage.elements.underButtonMessageFirst.getText()).toBe(
                    "This offer is currently unavailable.",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });

            it("should display correct offer maximum amount (don't adjusted) id5306", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(
                    (await offerViewPage.elements.maximumAmount.getText()).replace("\n", ""),
                ).toBe("500 USD");
            });
        });

        describe("", () => {
            let normalOffer;

            beforeAll(async () => {
                const offerOwner = await qaHelper.createRandomUser(true);
                const user_id = offerOwner.id;
                await qaHelper.toggleKycVerification(user_id, { id: true, document: false });
                await qaHelper.addBalance(user_id, 10000000);
                await qaHelper.depositBond(user_id);
                normalOffer = await qaHelper.createSpecificOffer({ user_id });

                const stranger = await qaHelper.createRandomUser();
                await qaHelper.activateEmail(stranger.id);
                await qaHelper.togglePhoneVerification(stranger.id);
                await loginPage.logInAccount(stranger.email);
            });
        });

        describe("", () => {
            let normalOffer;

            beforeAll(async () => {
                const offerOwner = await qaHelper.createRandomUser(true);
                const user_id = offerOwner.id;
                await qaHelper.toggleKycVerification(user_id, { id: true, document: false });
                await qaHelper.addBalance(user_id, 51000000);
                normalOffer = await qaHelper.createSpecificOffer({ user_id });

                const stranger = await qaHelper.createRandomUser();
                await qaHelper.activateEmail(stranger.id);
                await qaHelper.togglePhoneVerification(stranger.id);
                await loginPage.logInAccount(stranger.email);
            });

            it("should display correct message on offer page when offer owner does not have a deposited bond id5316", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(await offerViewPage.elements.underButtonMessageFirst.getText()).toBe(
                    "This offer is currently unavailable.",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });
        });

        describe("", () => {
            let normalOffer,
                requirePastTradesOffer,
                requireTrustedOffer,
                blockAnonymousOffer,
                disallowUsaOffer,
                allowUsaOffer,
                requireEverything;

            beforeAll(async () => {
                const offerOwner = await qaHelper.createRandomUser(true);
                const user_id = offerOwner.id;
                await qaHelper.toggleKycVerification(user_id, { id: true, document: false });
                await qaHelper.addBalance(user_id, 1000000000);
                await qaHelper.depositBond(user_id);
                normalOffer = await qaHelper.createSpecificOffer({ user_id });
                requirePastTradesOffer = await qaHelper.createSpecificOffer({
                    user_id,
                    require_min_past_trades: 5,
                });
                requireTrustedOffer = await qaHelper.createSpecificOffer({
                    user_id,
                    show_only_trusted_user: true,
                });
                blockAnonymousOffer = await qaHelper.createSpecificOffer({
                    user_id,
                    block_anonymizer_users: true,
                });
                disallowUsaOffer = await qaHelper.createSpecificOffer({
                    user_id,
                    country_limitation_type: 1,
                    country_limitation_list: ["US"],
                });
                allowUsaOffer = await qaHelper.createSpecificOffer({
                    user_id,
                    country_limitation_type: 2,
                    country_limitation_list: ["US"],
                });
                requireEverything = await qaHelper.createSpecificOffer({
                    user_id,
                    require_verified_phone: true,
                    require_verification_id: true,
                    require_offer_currency_must_match_buyer_country: true,
                    show_limit_max_coins: true,
                    require_min_past_trades: 5,
                    show_only_trusted_user: true,
                    block_anonymizer_users: true,
                    country_limitation_type: 1,
                    country_limitation_list: ["US"],
                });

                const stranger = await qaHelper.createRandomUser();
                await qaHelper.activateEmail(stranger.id);
                await qaHelper.togglePhoneVerification(stranger.id);
                await loginPage.logInAccount(stranger.email);
            });

            it("should display correct offer label id5304", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(await offerViewPage.elements.pageTitle.getText()).toBe(
                    "Buy Bitcoin with Amazon Gift Card for USD — payment method label text",
                );
            });

            it("should display correct offer minimum amount id5305", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(
                    (await offerViewPage.elements.minimumAmount.getText()).replace("\n", ""),
                ).toBe("500 USD");
            });

            it("should display correct offer terms id5307", async () => {
                await offerViewPage.openOfferPage(normalOffer);
                expect(await offerViewPage.elements.offerTerms.getText()).toBe("offer terms text");
            });

            //TODO dunno what exactly it should do
            xit("should display correct message on offer page where past trusted user is required id5308", async () => {
                await offerViewPage.openOfferPage(requireTrustedOffer);
                expect(await offerViewPage.elements.trustedMessage.getText()).toContain(
                    "trusted list",
                );
            });

            //TODO WTF
            xit("should display correct message on offer page where anonymous users are blocked id5311", async () => {
                await offerViewPage.openOfferPage(blockAnonymousOffer);
            });

            it("should display correct message on offer page where USA country is disallowed id5312", async () => {
                await offerViewPage.openOfferPage(disallowUsaOffer);
                expect(await offerViewPage.elements.underButtonMessageFirst.getText()).toBe(
                    "Sorry, this offer isn’t available in your region. Try another one.",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });

            //TODO WTF
            it("should display correct message on offer page where USA country is allowed id5313", async () => {
                await offerViewPage.openOfferPage(allowUsaOffer);
            });

            it("should display correct message on offer page where past trades are required id5314", async () => {
                await offerViewPage.openOfferPage(requirePastTradesOffer);
                expect(await offerViewPage.elements.underButtonMessageFirst.getText()).toBe(
                    "This vendor requires you to have at least 5 successful trades before you trade on this offer.",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });

            //TODO review. probably need to delete
            xit("should display correct message on offer page where past trusted user is required id5317", async () => {
                await offerViewPage.openOfferPage(requireEverything);
                expect(await offerViewPage.elements.trustedMessage.getText()).toContain(
                    "trusted list",
                );
            });

            //TODO update this. probably 404 page is expected
            xit("should display correct message on offer page where email is required id5318", async () => {
                await offerViewPage.openOfferPage(requireEverything);
                expect(await offerViewPage.elements.underButtonMessageFirst.getText()).toBe(
                    "To start a trade, please confirm your email " +
                        "first. You can resend confirmation email under your account settings",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });

            //TODO update this. probably 404 page is expected
            xit("should display correct message on offer page where phone is required id5319", async () => {
                await offerViewPage.openOfferPage(requireEverything);
                expect(await offerViewPage.elements.underButtonMessageSecond.getText()).toBe(
                    "To start a trade, please verify your phone number under your account settings",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });

            //TODO update this. probably 404 page is expected
            xit("should display correct message on offer page where past trades are required id5320", async () => {
                await offerViewPage.openOfferPage(requireEverything);
                expect(await offerViewPage.elements.underButtonMessageThird.getText()).toBe(
                    "For that offer vendor requires you to have minimum of 5 successful trades\n" +
                        "Can't start trade with yourself",
                );
                expect(await offerViewPage.getUnderButtonMessagesCount()).toEqual(1);
            });
        });
    });
});
