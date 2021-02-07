#
# paxful: local environment tests Makefile
#
# Copyright: 2020 Paxful Inc.
# All rights reserved - Do Not Redistribute
#

# shared code
p = develop

ask:
	@echo "Are you sure? [y/N]" && read ans && [ $${ans:-N} = y ]

define run_test
	@yarn test --profile $p --suite ${1}
endef

# install dependencies
install_java: ask
	@brew cask install java

install_k6: ask
	@brew install k6

install_node: ask
	@brew install node
	@brew install yarn

npm_install:
	@yarn

yarn_install:
	@yarn

# test suites
health_check:
	$(call run_test, health_check)

smoke_test:
	$(call run_test, smoke_test)

settings:
	$(call run_test, settings)

wallet:
	$(call run_test, wallet)

offer:
	$(call run_test, offer)

userProfile:
	$(call run_test, userProfile)

classicDashboard:
	$(call run_test, classicDashboard)

vendorDashboard:
	$(call run_test, vendorDashboard)

search:
	$(call run_test, search)

kiosk:
	$(call run_test, kiosk)

trade:
	$(call run_test, trade)

tradeBuy:
	$(call run_test, tradeBuy)

tradeSell:
	$(call run_test, tradeSell)

login:
	$(call run_test, login)

accountStatuses:
	$(call run_test, accountStatuses)

widget:
	$(call run_test, widget)

mainPage:
	$(call run_test, mainPage)
