import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the sites-and-browsers family
 * (docs/decisions/0009-i18n-pilot.md) — see social-engineering.ts for the
 * shared authoring rules (independent content, locale-invariant
 * attackCode, disjoint versionId range).
 *
 * These two mirror the French pair fixed together in the same change:
 * `almost-correct-address` is a homoglyph (a capital I standing in for a
 * lowercase l — invisible even on a careful reread), and
 * `mistyped-streaming-service-address` is an ordinary typo (a doubled
 * letter — visible on a careful reread). Keeping both in English matters
 * pedagogically: the FAQ on the typosquatting attack page explains the
 * distinction, so a visitor who only ever sees one of the two in-language
 * never gets to feel the difference for themselves.
 */
export const SIMULATIONS_EN_SITES_AND_BROWSERS: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000011",
    scenarioCode: "EN-SCENARIO-000011",
    slug: "almost-correct-address",
    version: 1,
    attackCode: "IDN-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fictional customer portal",
    teaser: "The login page is perfect. So is the address — except for one character.",
    content: {
      sender: "Browser address bar",
      body: "https://portal-cIient.fictional-mutual.example-not-real.test/login\n\nThe page shows the usual logo, a username/password form, and the padlock is present. Your password manager, though, offers nothing.",
      ui: "web",
    },
    choices: [
      {
        id: "login",
        label: "The padlock is there and the page is identical, so I log in",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_LOGO", "SHARED_CREDENTIAL"],
      },
      {
        id: "type",
        label: "I type my password by hand since the manager isn't offering to fill it in",
        mistakePatternCodes: ["SHARED_CREDENTIAL", "MISSED_SUSPICIOUS_DOMAIN"],
      },
      {
        id: "bookmark",
        label: "I close the tab and reach the service through my saved bookmark",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["bookmark"],
    explanations: {
      login: {
        technique: "Domain imitating a legitimate site",
        indicator: "\"portal-cIient\" is spelled here with a capital I in place of a lowercase l",
        whyDangerous: "The site is a copy hosted on a domain the attacker owns; anything entered there is sent to them directly.",
        reflex: "The padlock says nothing about a site's legitimacy: it only indicates the connection is encrypted.",
      },
      type: {
        technique: "Domain imitating a legitimate site",
        indicator: "The password manager isn't offering to fill in the form",
        whyDangerous: "Typing it by hand bypasses the one protection that had actually detected the anomaly: a manager ties your credentials to the real domain, not to how a page looks.",
        reflex: "A manager staying silent on a site you use often is a warning, not a glitch.",
      },
      bookmark: {
        technique: "Domain imitating a legitimate site",
        indicator: "Page reached through a link rather than a path you chose yourself",
        whyDangerous: "This is the right answer: a bookmark points to the real domain regardless of how convincing the page you land on looks.",
        reflex: "Save a bookmark for every sensitive service, and use only that.",
      },
      unsure: {
        technique: "Domain imitating a legitimate site",
        indicator: "Familiar-looking page, one character different in the address",
        whyDangerous: "Not entering anything costs you nothing here.",
        reflex: "When in doubt, reach the service through a bookmark or by typing the address yourself.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000012",
    scenarioCode: "EN-SCENARIO-000012",
    slug: "mistyped-streaming-service-address",
    version: 1,
    attackCode: "IDN-000001",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional streaming service",
    teaser: "Typed from memory, the address has one letter too many. The page that loads looks identical.",
    content: {
      sender: "Browser address bar",
      body: "Address typed from memory: https://streamplixx.example-not-real.test/login\n\n(the real service is \"streamplix\", without the second x)\n\nThe page shows the same logo, a username/password field, and a message: \"Your subscription has expired, log back in to continue.\"",
      ui: "web",
    },
    choices: [
      {
        id: "login",
        label: "I log in: the address is almost right and the page is identical",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "SHARED_CREDENTIAL"],
      },
      {
        id: "retype",
        label: "I retype the address more slowly, letter by letter, in the same tab",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "bookmark",
        label: "I close the tab and reach the service through my saved bookmark",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["bookmark"],
    explanations: {
      login: {
        technique: "Typosquatting",
        indicator: "Domain with a doubled letter compared to the real one (\"streamplixx\" instead of \"streamplix\")",
        whyDangerous: "Unlike a homoglyph, this difference is an ordinary typo, visible on a careful reread — but a quick read misses it just as easily. The site is a copy hosted on a domain the attacker owns; any credentials entered go straight to them.",
        reflex: "Reread an address typed from memory letter by letter before entering a password, especially after a possible typo.",
      },
      retype: {
        technique: "Typosquatting",
        indicator: "Address already loaded in the same tab, retyped in the same bar",
        whyDangerous: "Retyping in the same tab doesn't change how much attention is actually paid: the same typo can recur, and the browser's autocomplete may even suggest the wrong address first, since it was just visited.",
        reflex: "Slowing down while retyping isn't enough if the same autocomplete, in the same spot, takes over again.",
      },
      bookmark: {
        technique: "Typosquatting",
        indicator: "Address one character off from the one saved as a bookmark",
        whyDangerous: "This is the right answer: a bookmark saved during a trusted visit always points to the exact domain, never depending on how the address is typed in the moment.",
        reflex: "For a service you use often, a bookmark removes the risk of a typo in the address.",
      },
      unsure: {
        technique: "Typosquatting",
        indicator: "One-letter difference, easy to miss when reading quickly",
        whyDangerous: "Closing the tab and starting from a bookmark costs no real access to the service.",
        reflex: "When in doubt about an address typed from memory, always start from a bookmark rather than retyping.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000015",
    scenarioCode: "EN-SCENARIO-000015",
    slug: "parking-meter-qr-code",
    version: 1,
    attackCode: "QR-000001",
    channel: "qr_code",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional parking meter",
    teaser: "A QR sticker on the parking meter promises “faster” payment.",
    content: {
      sender: "Sticker on a parking meter",
      body: "“Quick cashless payment — scan this code.”\n\nAfter scanning, your phone shows this preview: https://quick-parking-payment.example-not-real.test/pay?city=…",
      ui: "qr",
    },
    choices: [
      {
        id: "pay",
        label: "I open the page and pay for my parking by card",
        mistakePatternCodes: [
          "MISSED_SUSPICIOUS_DOMAIN",
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
        ],
      },
      {
        id: "official",
        label: "The QR code is stuck on public equipment, so it's official",
        mistakePatternCodes: [
          "TRUSTED_AUTHORITY",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "app",
        label:
          "I pay at the meter itself or through the official app that I open myself",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["app"],
    explanations: {
      pay: {
        technique: "QR code hiding its destination",
        indicator: "Domain unrelated to the town or the parking operator",
        whyDangerous:
          "The payment page collects your full card details; the parking itself is never paid for.",
        reflex:
          "Always read the address preview before opening a page from a QR code.",
      },
      official: {
        technique: "QR code hiding its destination",
        indicator: "Sticker added onto the equipment",
        whyDangerous:
          "A sticker takes a second to put on and anyone can stick one: where it is says nothing about where the code came from.",
        reflex:
          "Run your finger over the code: a sticker on top of another can be felt.",
      },
      app: {
        technique: "QR code hiding its destination",
        indicator: "A QR code offered as the main way to pay",
        whyDangerous:
          "This is the right answer: a QR code is never the only possible route for an official process.",
        reflex:
          "For any payment, choose the route yourself rather than the one you are offered.",
      },
      unsure: {
        technique: "QR code hiding its destination",
        indicator: "Destination invisible before scanning",
        whyDangerous:
          "Scanning alone doesn't expose you: the risk starts when you open the page and enter your card.",
        reflex: "When in doubt, pay another way.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000017",
    scenarioCode: "EN-SCENARIO-000017",
    slug: "fake-browser-update-banner",
    version: 1,
    attackCode: "WEB-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fake browser notification",
    teaser:
      "A banner says your browser is out of date and offers a file to run.",
    content: {
      sender: "Banner shown inside a web page",
      body: "Your browser is out of date (3 updates behind). A critical vulnerability has been fixed.\n[ Update now ]\n\nThe button offers to download: browser-update.exe",
      ui: "web",
    },
    choices: [
      {
        id: "run",
        label: "I download and run the file offered",
        mistakePatternCodes: [
          "CLICKED_UNKNOWN_LINK",
          "TRUSTED_BRAND_NAME",
          "RESPONDED_TO_URGENCY",
        ],
      },
      {
        id: "command",
        label:
          "Otherwise the page offers a command to copy and paste into a system window, so I do that",
        mistakePatternCodes: [
          "FAILED_TO_VERIFY_INDEPENDENTLY",
          "TRUSTED_AUTHORITY",
        ],
      },
      {
        id: "menu",
        label:
          "I close the tab and check the version in the browser's own menu",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["menu"],
    explanations: {
      run: {
        technique: "Fake update notification",
        indicator:
          "A browser update offered as an executable file downloaded from a page",
        whyDangerous:
          "The file is a program chosen by the attacker. Because you are the one running it, the browser's protections aren't broken through: they are bypassed.",
        reflex:
          "A browser updates itself and never makes you download an executable from a web page.",
      },
      command: {
        technique: "Execution handed off to the user",
        indicator: "Request to copy a command and paste it into the system",
        whyDangerous:
          "The command runs the same program without any suspicious file showing up in your downloads, which makes it even more discreet.",
        reflex:
          "Never paste a command supplied by a web page into your system, whatever the reason given.",
      },
      menu: {
        technique: "Fake update notification",
        indicator: "Notification shown inside the page, not by the browser",
        whyDangerous:
          "This is the right answer: the browser's menu is the only place that actually shows its version.",
        reflex:
          "Any information about your software is checked in the software, never in a page.",
      },
      unsure: {
        technique: "Fake update notification",
        indicator: "Urgency justified by a “critical vulnerability”",
        whyDangerous:
          "Closing the tab puts you at no risk, even if a real update is pending.",
        reflex:
          "When in doubt, close the page and check from the browser's menu.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000025",
    scenarioCode: "EN-SCENARIO-000025",
    slug: "sponsored-result-accounting-software",
    version: 1,
    attackCode: "WEB-000003",
    channel: "web",
    targetProfile: "business",
    difficulty: 3,
    impersonatedEntity: "Fictional accounting software publisher",
    teaser:
      "A search to find your accounting software. The first result isn't the right site.",
    content: {
      sender: "Search results — “ledgerlogic login”",
      body: "Sponsored result\nledgerlogic-login.example-not-real.test\nLedgerLogic — Reach your customer area in one click. 24/7 support.\n\nResult\nledgerlogic.test\nLedgerLogic — Customer area\n\nResult\nledgerlogic.test/news\nLedgerLogic announces a new feature...",
      ui: "web",
    },
    choices: [
      {
        id: "sponsored",
        label: "I click the first result, the one at the very top",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_BRAND_NAME"],
      },
      {
        id: "compare",
        label:
          "The two domains look alike, so I click the one with the most positive reviews",
        mistakePatternCodes: [
          "MISSED_SUSPICIOUS_DOMAIN",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "favorite",
        label:
          "I ignore the results and use my saved bookmark to ledgerlogic.test",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["favorite"],
    explanations: {
      sponsored: {
        technique: "Fake website",
        indicator:
          "Sponsored result with a domain slightly different from the official one",
        whyDangerous:
          "The first result isn't the most relevant one: it's the one that paid to appear there. The domain “ledgerlogic-login” isn't the publisher's, and a login page that looks identical captures your credentials the first time you type them.",
        reflex:
          "Position in the results says nothing about legitimacy. The domain does.",
      },
      compare: {
        technique: "Fake website",
        indicator: "Two similar domains, one legitimate and one not",
        whyDangerous:
          "The number of reviews or how a site looks aren't security criteria: a careful copy reproduces them just as well. The only thing that reliably tells the two domains apart is the domain itself, compared with the publisher's exact name.",
        reflex: "Compare domains, not layouts.",
      },
      favorite: {
        technique: "Fake website",
        indicator: "A bookmark saved beforehand removes the question",
        whyDangerous:
          "This is the right answer. A bookmark created during a trusted visit always points to the same domain, whatever a search engine shows afterwards — which takes all the power away from a sponsored result or an imitation domain.",
        reflex:
          "For services you use often, a bookmark saves you from having to judge a search result every time.",
      },
      unsure: {
        technique: "Fake website",
        indicator: "Two results that both seem legitimate",
        whyDangerous: "Doing nothing puts you at no risk here.",
        reflex:
          "When in doubt, reach the service through a bookmark or by typing the address yourself.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000026",
    scenarioCode: "EN-SCENARIO-000026",
    slug: "security-alert-on-random-site",
    version: 1,
    attackCode: "WEB-000004",
    channel: "advertisement",
    targetProfile: "senior",
    difficulty: 2,
    impersonatedEntity: "None — ad shown on a third-party site",
    teaser:
      "While you're reading an article, a full-screen alert says 3 viruses have been detected.",
    content: {
      sender: "Ad shown on a news site",
      body: "⚠ SECURITY ALERT ⚠\n3 VIRUSES DETECTED on your device!\n\nYour system is at risk. Click here to start the cleanup immediately and protect your data.\n\n[Clean now]",
      ui: "web",
    },
    choices: [
      {
        id: "clean",
        label: "I click “Clean now”, better safe than sorry",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "close-tab",
        label: "I close the tab, the alert will disappear with it",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "ignore",
        label:
          "I ignore the alert: my device can't be examined by a web page I'm reading",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["ignore"],
    explanations: {
      clean: {
        technique: "Malvertising",
        indicator: "Security alert shown by an ad, on an unrelated site",
        whyDangerous:
          "A web page you are reading has technically no way of examining your device: the figure of “3 viruses” is made up to be believable, not measured. Clicking installs what the alert claimed to remove.",
        reflex:
          "A site you visit can't scan your device. An alert claiming otherwise is false by design.",
      },
      "close-tab": {
        technique: "Malvertising",
        indicator: "Pop-up or ad banner imitating a system alert",
        whyDangerous:
          "Closing the tab is a good reflex and is almost always enough here, but the alert “disappearing” doesn't mean there's nothing to understand: if an accidental click happened before closing, a download may have started in the background.",
        reflex:
          "Closing is enough in the vast majority of cases; just check that no file was downloaded in the meantime.",
      },
      ignore: {
        technique: "Malvertising",
        indicator: "Full-screen alert loaded by an ad slot",
        whyDangerous:
          "This is the right answer. A real detection always comes from the security software installed on your device, never from a page viewed in a browser.",
        reflex:
          "No site can scan your device from a web page. The only valid scan comes from software you installed yourself.",
      },
      unsure: {
        technique: "Malvertising",
        indicator: "Precise figure shown to look measured",
        whyDangerous: "Clicking nothing puts you at no risk.",
        reflex:
          "When in doubt, close the tab without clicking any button in the alert.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000027",
    scenarioCode: "EN-SCENARIO-000027",
    slug: "installer-with-pre-ticked-boxes",
    version: 1,
    attackCode: "WEB-000005",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Fictional download site",
    teaser:
      "You've finally found the free software you were looking for. The installer offers several options.",
    content: {
      sender: "Setup wizard — FreePlayer v4.2",
      body: "Welcome to the FreePlayer setup.\n\n☑ Install the SuperSearch toolbar (recommended)\n☑ Make QuickSearch my default search engine\n☑ Receive partner offers by email\n☐ Create a desktop shortcut\n\n[ Next > ]",
      ui: "web",
    },
    choices: [
      {
        id: "next",
        label: "I click “Next” without changing the boxes, they're recommended",
        mistakePatternCodes: [
          "TRUSTED_DISPLAY_NAME",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "cancel",
        label:
          "I cancel the installation entirely, this software looks too complicated",
        mistakePatternCodes: [],
      },
      {
        id: "uncheck",
        label: "I untick everything that isn't the software I came to install",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["uncheck"],
    explanations: {
      next: {
        technique: "Fake download",
        indicator:
          "Boxes ticked in advance for software unrelated to the one requested",
        whyDangerous:
          "“Recommended” is written by the installer, not by you. Each ticked box adds a program you didn't come for — a toolbar, a changed search engine, a marketing sign-up — and that is precisely the business model of this kind of download site.",
        reflex:
          "A box ticked by default is never in your interest, it's in the interest of whoever ticked it.",
      },
      cancel: {
        technique: "Fake download",
        indicator: "Several options added to a simple installation",
        whyDangerous:
          "It isn't dangerous, but it isn't necessary either: reading and unticking takes as long as cancelling, and you get the software you wanted instead of nothing at all.",
        reflex:
          "Unticking is no harder than cancelling, and it gets you there.",
      },
      uncheck: {
        technique: "Fake download",
        indicator:
          "Three boxes out of four offer something other than the software requested",
        whyDangerous:
          "This is the right answer. Reading every installation screen and keeping only what you came for avoids most of what this technique installs.",
        reflex:
          "Read every screen of an installation, and untick what you didn't ask for.",
      },
      unsure: {
        technique: "Fake download",
        indicator: "Presentation that looks like a legitimate setup wizard",
        whyDangerous: "Not confirming anything puts you at no risk.",
        reflex:
          "When in doubt, untick everything that isn't the software you were looking for before continuing.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000028",
    scenarioCode: "EN-SCENARIO-000028",
    slug: "file-converter-extension",
    version: 1,
    attackCode: "WEB-000006",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional browser extension",
    teaser:
      "An extension for converting PDF files asks for access to every site you visit.",
    content: {
      sender: "Extension store — “Easy PDF Convert” listing",
      body: "Easy PDF Convert — 4.6 ★ (2,340 reviews)\nConverts your PDF documents in one click.\n\nThis extension requests permission to:\n— Read and change all your data on all websites you visit\n— Display notifications\n\n[ Add to my browser ]",
      ui: "web",
    },
    choices: [
      {
        id: "install",
        label: "I install it: the rating is good and I have nothing to hide",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "trust-rating",
        label: "I just check the rating is above 4 stars before installing",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "question",
        label:
          "I notice the permission goes far beyond the advertised function, and I don't install it",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["question"],
    explanations: {
      install: {
        technique: "Malicious browser extension",
        indicator:
          "Permission to read and change all data on all sites, for a simple converter",
        whyDangerous:
          "“Nothing to hide” isn't the point: this permission lets it read the credentials you type, your messages, your banking history — on every site, continuously. A file converter needs none of this access to work.",
        reflex:
          "The permission requested should match the advertised function. A wide gap between the two is the warning sign, not the extension's reputation.",
      },
      "trust-rating": {
        technique: "Malicious browser extension",
        indicator:
          "High rating that says nothing about the scope of the permissions",
        whyDangerous:
          "A good rating assesses whether the extension does what it says, not what it does on top. A large number of positive reviews sits perfectly well alongside broad data collection that the reviews never mention.",
        reflex:
          "The rating measures satisfaction with the visible function, not what else the extension can do.",
      },
      question: {
        technique: "Malicious browser extension",
        indicator:
          "Gap between the advertised function and the scope of the permission requested",
        whyDangerous:
          "This is the right answer. Comparing the permission with the function is the only criterion that holds for this kind of decision, regardless of the rating or the number of reviews.",
        reflex:
          "Before installing an extension, compare what it asks for with what it does. A wide gap should be enough to say no.",
      },
      unsure: {
        technique: "Malicious browser extension",
        indicator: "Simple function, broad permission",
        whyDangerous: "Not installing loses you no essential feature.",
        reflex:
          "When in doubt, don't install it and look for an alternative with narrower permissions.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000053",
    scenarioCode: "EN-SCENARIO-000053",
    slug: "unexpected-sign-in-again-tab",
    version: 1,
    attackCode: "WEB-000008",
    channel: "web",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fictional email service, in a tab left open",
    teaser:
      "You come back to a tab left open in the background: it asks you to sign in again.",
    content: {
      sender: "Tab left open while you were browsing another site",
      body: "Your session has expired.\nPlease sign in again to continue.\n\nEmail address: ____\nPassword: ____\n\n[ Sign in again ]",
      ui: "web",
    },
    choices: [
      {
        id: "reconnect",
        label: "I sign in again: it's my email tab, open for a while",
        mistakePatternCodes: ["TRUSTED_DISPLAY_NAME", "SHARED_CREDENTIAL"],
      },
      {
        id: "check-url-only",
        label:
          "I take a quick look at the address shown, it seems correct, so I sign in again",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN"],
      },
      {
        id: "close-reopen",
        label: "I close this tab and reopen the service from a bookmark",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["close-reopen"],
    explanations: {
      reconnect: {
        technique: "Tabnabbing",
        indicator: "Sign-in request on a tab left open in the background",
        whyDangerous:
          "A tab left open can have its content changed while you were elsewhere, with nothing to alert you: you give it the trust it had when you opened it, not the trust it deserves now. A session that really expires doesn't always do so this way.",
        reflex:
          "An old tab has no more legitimacy than a link you received: what it shows may have changed while it was in the background.",
      },
      "check-url-only": {
        technique: "Tabnabbing",
        indicator: "Address glanced at rather than read in full",
        whyDangerous:
          "A quick glance at an address often misses the difference that matters, especially on a tab you already assume is legitimate. Reading an address means reading it as if the tab had just been opened, not confirming an impression you've already formed.",
        reflex:
          "Checking an address by confirming an impression isn't the same as actually reading it.",
      },
      "close-reopen": {
        technique: "Tabnabbing",
        indicator:
          "Sign-in requested without any explicit navigation on your part",
        whyDangerous:
          "This is the right answer. Closing the tab and reopening the service from a bookmark means ignoring entirely what the tab was showing, which defeats the attack however it looks.",
        reflex:
          "Faced with an unexpected sign-in request on an old tab, close it and reopen the service by your own means.",
      },
      unsure: {
        technique: "Tabnabbing",
        indicator: "Familiar look of the usual service",
        whyDangerous:
          "Closing the tab and opening a new one loses you no legitimate session, which will ask you to sign in the same way.",
        reflex:
          "When in doubt about an unexpected sign-in request, close the tab and start again from a bookmark.",
      },
    },
  },
];
