import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the AI and synthetic content family — see social-engineering.ts
 * for the shared authoring rules (independent content, locale-invariant
 * attackCode, disjoint versionId range). Each mirrors the French scenario
 * for the same attack: same choices, same correct answer, same mistake
 * patterns; fictional names and `.test` domains are rewritten in English.
 */
export const SIMULATIONS_EN_AI_AND_SYNTHETIC_CONTENT: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000044",
    scenarioCode: "EN-SCENARIO-000044",
    slug: "viral-celebrity-investment-video",
    version: 1,
    attackCode: "AI-000001",
    channel: "social_media",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fictional public figure",
    teaser:
      "A circulating video shows a well-known figure recommending a financial investment.",
    content: {
      sender: "Video shared by an account created last week",
      body: "“This investment let me multiply my capital in a few months. I recommend this platform to anyone who wants to secure their future.”\n— Video clip, passed around with no link to an identifiable original source.\n\nLink to the platform in the pinned comment.",
      ui: "web",
    },
    choices: [
      {
        id: "invest",
        label: "I click the link: if this person says it, it inspires trust",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "watch-again",
        label:
          "I watch the video a second time to see whether the face and voice are convincing",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "search-source",
        label:
          "I check whether this statement is reported by an identifiable source before touching it",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["search-source"],
    explanations: {
      invest: {
        technique: "Deepfake video",
        indicator:
          "Recent account, cropping that prevents tracing an original source",
        whyDangerous:
          "Using a well-known figure to recommend an investment is a recurring scenario, and how the video looks no longer guarantees anything: a recognizable face and voice can be reproduced. Doubt has to move from the image to where it came from.",
        reflex:
          "No legitimate investment is offered through a video passed around without a source, whoever seems to be speaking in it.",
      },
      "watch-again": {
        technique: "Deepfake video",
        indicator: "Short, cropped video, with no wide head movements",
        whyDangerous:
          "Visual inspection isn't conclusive on its own: a well-made video holds up to a second viewing, and a genuine but poor-quality video can on the contrary raise unfounded doubt. That isn't where the reliable answer lies.",
        reflex:
          "Analyzing the image comes last; it never settles things on its own.",
      },
      "search-source": {
        technique: "Deepfake video",
        indicator: "Important statement that no identifiable source reports",
        whyDangerous:
          "This is the right answer. A real statement by a well-known person leaves multiple, consistent traces; the absence of any coverage by an identifiable source is the sign that counts, regardless of the video's quality.",
        reflex:
          "Look for the statement elsewhere before judging the image: a real public statement can always be found in several places.",
      },
      unsure: {
        technique: "Deepfake video",
        indicator: "Well-produced video, recognizable figure",
        whyDangerous:
          "Doing nothing loses you no real opportunity: a legitimate investment remains available through its usual channels.",
        reflex:
          "When in doubt, don't share and don't click anything before finding an independent source.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000045",
    scenarioCode: "EN-SCENARIO-000045",
    slug: "urgent-call-relative-voice",
    version: 1,
    attackCode: "AI-000002",
    channel: "phone",
    targetProfile: "senior",
    difficulty: 4,
    impersonatedEntity: "Voice of a fictional relative",
    teaser:
      "A panicked call: the voice, which you recognize, asks for an immediate transfer for an emergency.",
    content: {
      sender: "Incoming call — unknown number",
      body: "“It's me, I've had an accident, I need you to send me money right now, I can't explain now, please do it quickly.”\n\nThe voice sounds a lot like your relative's. The call cuts off before you've been able to ask many questions.",
      ui: "call",
    },
    choices: [
      {
        id: "transfer",
        label:
          "I send the money immediately, it's their voice, I don't want to waste time",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "TRUSTED_AUTHORITY"],
      },
      {
        id: "ask-question",
        label:
          "I ask a personal question during the call to check it really is them",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "callback",
        label: "I hang up and call my relative back on their usual number",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["callback"],
    explanations: {
      transfer: {
        technique: "Voice cloning",
        indicator:
          "Urgency that prevents any check, call that cuts off quickly",
        whyDangerous:
          "A recognizable voice is no longer enough to confirm an identity: a few seconds of a public recording can be enough to reproduce it. The urgency and the call cutting off quickly are exactly what prevents the check that would settle it.",
        reflex:
          "A recognized voice, on its own, no longer proves anything. The call's urgency is a warning sign, not a reason to act faster.",
      },
      "ask-question": {
        technique: "Voice cloning",
        indicator: "Short answers, a deliberately vague context",
        whyDangerous:
          "Asking a question during the call may seem cautious, but the caller can avoid answering precisely, claim a bad connection, or push you to carry on without really answering. It isn't a check that holds up, unlike an independent call back.",
        reflex:
          "A question asked during the call stays under the control of whoever is talking to you; a call back to a number you had before isn't.",
      },
      callback: {
        technique: "Voice cloning",
        indicator: "No independent check has happened yet",
        whyDangerous:
          "This is the right answer. Hanging up and calling your relative back on their usual number is the only check that doesn't depend on what you hear during the original call.",
        reflex:
          "Hang up and call back on a number you had before the call. That's the check that holds, however good the voice sounds.",
      },
      unsure: {
        technique: "Voice cloning",
        indicator: "Apparent distress, immediate request for money",
        whyDangerous:
          "Sending nothing right away puts a relative who is really in trouble at no risk: they can still be reached in other ways.",
        reflex:
          "When in doubt, hang up and check through a channel you control before sending any money.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000046",
    scenarioCode: "EN-SCENARIO-000046",
    slug: "dating-profile-perfect-photo",
    version: 1,
    attackCode: "AI-000003",
    channel: "social_media",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional profile on a dating app",
    teaser:
      "A very attractive profile starts a conversation. A single, perfectly framed photo.",
    content: {
      sender: "Profile “Camille, 34” — dating app",
      body: "Single profile photo: sharp portrait, centered gaze, blurred background with no identifiable detail.\n\nBio: “Always up for new adventures.” No other photos, no mention of a place, no visible mutual friends.\n\nMessage received: “Hi! I liked your profile straight away, shall we chat?”",
      ui: "web",
    },
    choices: [
      {
        id: "chat",
        label: "I chat normally, the photo is nice and the message is friendly",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "reverse-image",
        label:
          "I do a reverse image search on the photo to see if it appears elsewhere",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "look-for-depth",
        label:
          "I check whether there are other photos, taken at different times and places, before chatting any further",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["look-for-depth"],
    explanations: {
      chat: {
        technique: "AI-generated fake profile",
        indicator:
          "Single, perfectly framed photo, no identifiable sign of a life",
        whyDangerous:
          "A profile photo that is too perfect, on its own, with no context, is exactly the form a fabricated face takes: nothing to identify in the background, no trace of a real life. Carrying on the conversation without paying attention opens the way to what this kind of profile is after next.",
        reflex:
          "A single perfect photo isn't a compliment to the profile, it's a sign to check.",
      },
      "reverse-image": {
        technique: "AI-generated fake profile",
        indicator: "Photo that may come from no earlier source",
        whyDangerous:
          "A reverse image search is still useful but no longer enough: an entirely fabricated face may never have existed anywhere else, so it returns nothing — and no result no longer proves anything either way.",
        reflex:
          "An empty reverse image search no longer rules anything out; it's just one element among others.",
      },
      "look-for-depth": {
        technique: "AI-generated fake profile",
        indicator:
          "Lack of depth: no place, no date, no verifiable connections",
        whyDangerous:
          "This is the right answer. A real account has a past: photos at different times and places, connections that overlap. That depth is what a fabricated profile lacks, and it is much more reliable than how a single image looks.",
        reflex:
          "Look for a profile's depth — several photos, places, connections that overlap — rather than the quality of a single image.",
      },
      unsure: {
        technique: "AI-generated fake profile",
        indicator: "Friendly message, attractive profile",
        whyDangerous:
          "Taking time to check loses you no real connection, which will survive the delay.",
        reflex:
          "When in doubt, look for the profile's depth before investing in the conversation.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000047",
    scenarioCode: "EN-SCENARIO-000047",
    slug: "perfectly-written-bank-email",
    version: 1,
    attackCode: "AI-000004",
    channel: "email",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fictional Bank",
    teaser:
      "An email without a single mistake, perfectly written, personalized with your first name and your branch.",
    content: {
      sender:
        "Fictional Bank <advisor@fictional-bank-secure.example-not-real.test>",
      body: "Hello [First name],\n\nFollowing a routine check of the accounts at the [Town] branch, we need to confirm your identity before processing a pending transaction on your account.\n\nThis secure, quick process takes less than two minutes.\n\nConfirm my identity: https://fictional-bank-secure.example-not-real.test/confirmation\n\nKind regards,\nYour Fictional Bank advisor",
      ui: "email",
    },
    choices: [
      {
        id: "trust-writing",
        label:
          "I click: it's written very professionally, without a single mistake",
        mistakePatternCodes: [
          "MISSED_SUSPICIOUS_DOMAIN",
          "TRUSTED_DISPLAY_NAME",
        ],
      },
      {
        id: "check-personalization",
        label:
          "The message knows my first name and my branch, that reassures me, so I carry on",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_AUTHORITY"],
      },
      {
        id: "check-domain",
        label:
          "I look at the sender's domain and reach my online banking by my own means",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["check-domain"],
    explanations: {
      "trust-writing": {
        technique: "AI-generated phishing",
        indicator: "Flawless writing, sender domain that isn't the bank's",
        whyDangerous:
          "The quality of the writing has stopped being a reliable clue: it no longer costs anything to get. The sender domain, however, hasn't changed in nature and is still the first thing that gives the message away.",
        reflex:
          "Perfect writing no longer proves anything. Switch your check to what hasn't changed: the domain.",
      },
      "check-personalization": {
        technique: "AI-generated phishing",
        indicator:
          "Personalization based on public or already-known information",
        whyDangerous:
          "A first name and a branch town can come from public sources or an earlier data breach; their accuracy doesn't guarantee where the message came from. Personalization makes the message more convincing, not more legitimate.",
        reflex:
          "Accurate personalization can come from somewhere other than your bank; it doesn't replace checking the domain.",
      },
      "check-domain": {
        technique: "AI-generated phishing",
        indicator:
          "Message structure unchanged despite the quality of the writing",
        whyDangerous:
          "This is the right answer. The domain, and reaching the service by your own means, are unaffected by the quality of the writing — which is exactly why they stay reliable when everything else no longer is.",
        reflex:
          "Read the domain, and always reach the service by a route you choose yourself, never through the link in the message.",
      },
      unsure: {
        technique: "AI-generated phishing",
        indicator:
          "Very polished message, identity request presented as a formality",
        whyDangerous:
          "Not clicking puts you at no risk: a real pending transaction remains visible in your online banking.",
        reflex:
          "When in doubt, ignore the link and log in to your online banking by your own means.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000048",
    scenarioCode: "EN-SCENARIO-000048",
    slug: "shock-article-unknown-news-site",
    version: 1,
    attackCode: "AI-000005",
    channel: "social_media",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional news site",
    teaser:
      "A shocking, well-written article, widely shared, comes from a site you didn't know.",
    content: {
      sender: "Shared article — direct-news-info.example-not-real.test",
      body: "“Exclusive revelation” — a long, detailed article, with no source cited, by an author you can't find any trace of elsewhere. The site mentions no address, no editor-in-chief and no visible creation date.",
      ui: "web",
    },
    choices: [
      {
        id: "share",
        label:
          "I share it: the article is well written and the information seems important",
        mistakePatternCodes: [
          "TRUSTED_BRAND_NAME",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "read-more",
        label:
          "I read other articles on the same site to judge its overall reliability",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-outlet",
        label:
          "I check that the outlet legally exists and whether an identifiable outlet has covered the same story",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["check-outlet"],
    explanations: {
      share: {
        technique: "AI-generated fake news site",
        indicator:
          "No source cited, author with no verifiable existence elsewhere",
        whyDangerous:
          "The quality of the writing says nothing about whether the content is true or whether the outlet really exists. Sharing amplifies information whose source and author can't be verified, which is precisely what this kind of site is after.",
        reflex:
          "Good writing isn't a source. Check the outlet before sharing, not after.",
      },
      "read-more": {
        technique: "AI-generated fake news site",
        indicator:
          "Many long articles, consistent with each other but with no verifiable anchor",
        whyDangerous:
          "An entirely fabricated site can produce a large number of mutually consistent articles without any of them being verifiable: the site's internal consistency doesn't replace an outside check that it legally exists.",
        reflex:
          "The number and consistency of a site's articles don't guarantee that it really exists.",
      },
      "check-outlet": {
        technique: "AI-generated fake news site",
        indicator: "No legal notice, no identifiable contact",
        whyDangerous:
          "This is the right answer. A real outlet has a legal existence you can check — legal notice, editor-in-chief, address — and important news is almost always reported by at least one other identifiable outlet.",
        reflex:
          "Check the outlet before the article: legal existence first, coverage by other sources next.",
      },
      unsure: {
        technique: "AI-generated fake news site",
        indicator: "Story presented as important, widely shared",
        whyDangerous:
          "Not sharing loses you no real information, which will remain available through verifiable outlets.",
        reflex:
          "When in doubt, don't share before checking that the outlet exists and finding another source.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000049",
    scenarioCode: "EN-SCENARIO-000049",
    slug: "online-support-text-code",
    version: 1,
    attackCode: "AI-000006",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional support service",
    teaser:
      "An online chat assistant, reached from an ad, asks for a code you received by text.",
    content: {
      sender: "Chat window — “Live support”",
      body: "Hello, I'm your virtual assistant. To verify your account and solve your problem, could you give me the 6-digit code you just received by text message?",
      ui: "web",
    },
    choices: [
      {
        id: "give-code",
        label: "I give the code, the assistant needs it to help me",
        mistakePatternCodes: ["SHARED_MFA_CODE", "TRUSTED_AUTHORITY"],
      },
      {
        id: "ask-why",
        label: "I ask why this code is needed before giving it",
        mistakePatternCodes: ["SHARED_MFA_CODE"],
      },
      {
        id: "refuse-and-leave",
        label:
          "I refuse to share the code and leave this chat to go to the service's official website",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["refuse-and-leave"],
    explanations: {
      "give-code": {
        technique: "Malicious chatbot",
        indicator:
          "Support reached through an ad, request for a code received by text",
        whyDangerous:
          "A one-time code received by text is used to confirm an action on your account — often a sign-in or a reset started elsewhere. Sharing it lets whoever asked for it complete that action in your place.",
        reflex:
          "No support, human or automated, ever asks for a code received by text, whatever the pretext.",
      },
      "ask-why": {
        technique: "Malicious chatbot",
        indicator:
          "Step-by-step questions drifting toward authentication information",
        whyDangerous:
          "Asking for an explanation still keeps the conversation going, and a chatbot designed for this has a plausible answer ready. What settles it isn't how good the justification is, it's the nature of what is being asked for.",
        reflex:
          "The reason given for asking for a text code doesn't matter: the request itself is the warning sign.",
      },
      "refuse-and-leave": {
        technique: "Malicious chatbot",
        indicator:
          "Support reached through a link rather than the official website",
        whyDangerous:
          "This is the right answer. Reaching support through the official website, chosen by you, takes all power away from an assistant designed to obtain this code, and genuine support remains easy to reach that way.",
        reflex:
          "Always reach support through the service's official website. No legitimate support asks for a code received by text.",
      },
      unsure: {
        technique: "Malicious chatbot",
        indicator: "Professional tone, request presented as a routine check",
        whyDangerous:
          "Refusing the code blocks no real support, which is available through the official website.",
        reflex:
          "When in doubt, never share a code received by text, whoever is asking.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000050",
    scenarioCode: "EN-SCENARIO-000050",
    slug: "free-image-generator-app",
    version: 1,
    attackCode: "AI-000007",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional image generation app",
    teaser:
      "An app promises free, unlimited access to a tool that is usually paid for.",
    content: {
      sender: "Search result — “Free Image Creator App”",
      body: "Free Image Creator — Unlimited access to all premium features, no subscription.\n\nPublisher: FictionalAppStudio (different from the official publisher of the imitated tool)\n\n[ Sign in with my existing account ]  [ Install ]",
      ui: "web",
    },
    choices: [
      {
        id: "connect",
        label: "I sign in with my existing account, it'll be quicker",
        mistakePatternCodes: ["TRUSTED_BRAND_NAME", "SHARED_CREDENTIAL"],
      },
      {
        id: "install-first",
        label:
          "I install it first to see if it works before signing in with anything",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "official-site",
        label:
          "I start from the official publisher's website rather than this search result",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["official-site"],
    explanations: {
      connect: {
        technique: "Fake AI app",
        indicator:
          "Publisher different from that of the advertised tool, free access presented as exceptional",
        whyDangerous:
          "Signing in with an existing account on an app from a different publisher potentially hands your credentials to that publisher, not to the service you think you're using. Completely free access to a tool that is usually paid for is the sign that should have stopped you before this step.",
        reflex:
          "Never connect an existing account to an app whose publisher differs from the original service's.",
      },
      "install-first": {
        technique: "Fake AI app",
        indicator:
          "App promising free access to features that are usually paid for",
        whyDangerous:
          "The installation “working” tells you nothing about what else it does — an app can show exactly what you expect while collecting data in the background. This test doesn't replace checking the publisher.",
        reflex:
          "An app appearing to work properly says nothing about what else it does.",
      },
      "official-site": {
        technique: "Fake AI app",
        indicator:
          "Search result for the tool's name, rather than its publisher's website",
        whyDangerous:
          "This is the right answer. Starting from the official publisher's website and following the link it gives to its app avoids the search itself, which is the ground this attack plays on.",
        reflex:
          "Always start from the official publisher rather than from the name of the tool you're searching for.",
      },
      unsure: {
        technique: "Fake AI app",
        indicator: "Promise of unlimited, free access",
        whyDangerous:
          "Installing nothing loses you no real access to the genuine tool, available through its publisher.",
        reflex:
          "When in doubt, look for the official publisher before installing anything.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000051",
    scenarioCode: "EN-SCENARIO-000051",
    slug: "video-call-urgent-transfer",
    version: 1,
    attackCode: "AI-000008",
    channel: "web",
    targetProfile: "business",
    difficulty: 5,
    impersonatedEntity: "Fictional company management, on a video call",
    teaser:
      "A short video call with management asks for an urgent, confidential transfer.",
    content: {
      sender: "Video call — “Chief Executive”",
      body: "Fixed camera, tight framing. “I'm travelling, the connection isn't great. I need a confidential transfer today for an acquisition in progress, I'm sending you the details in writing right away. I have to go, only call me back if there's a problem.”\n\nThe call ends after less than two minutes.",
      ui: "web",
    },
    choices: [
      {
        id: "transfer",
        label:
          "I make the transfer: I saw and heard them on video, that's enough",
        mistakePatternCodes: [
          "TRUSTED_AUTHORITY",
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
        ],
      },
      {
        id: "ask-video-question",
        label:
          "I call back on video and ask a personal question to check before transferring",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "callback-known-number",
        label:
          "I call back on a number I had before this call and apply the usual two-person approval",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["callback-known-number"],
    explanations: {
      transfer: {
        technique: "Deepfake video call",
        indicator:
          "Short video call, tight framing, confidentiality and urgency combined",
        whyDangerous:
          "The video call, long seen as the check that settled things, no longer does so on its own: a face and a voice can be synthesized live. The combination of confidentiality and urgency serves precisely to prevent the two-person approval that would have revealed the anomaly.",
        reflex:
          "Seeing and hearing someone on video is no longer enough to confirm an identity for a financial decision.",
      },
      "ask-video-question": {
        technique: "Deepfake video call",
        indicator: "Short call, technical pretext to cut the exchange short",
        whyDangerous:
          "Resting the check on a new video exchange keeps the weakness of the first one: image and sound are exactly what can be manipulated. What's missing isn't another video call, it's a channel independent of it.",
        reflex:
          "A second video call adds nothing if it has the same weakness as the first.",
      },
      "callback-known-number": {
        technique: "Deepfake video call",
        indicator:
          "No check independent of the image and sound has taken place",
        whyDangerous:
          "This is the right answer. Calling back on a number you had before the call and two-person approval of a transfer depend on no image: these are the two checks that hold, however good the original video call was.",
        reflex:
          "For any financial decision, call back on a number known before the call and apply two-person approval — never on the strength of a video call alone.",
      },
      unsure: {
        technique: "Deepfake video call",
        indicator: "Plausible business context, urgency invoked",
        whyDangerous:
          "Delaying a transfer while you check jeopardizes no legitimate operation.",
        reflex:
          "When in doubt about a transfer request, two-person approval and calling back on a known number always take precedence over the image.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000052",
    scenarioCode: "EN-SCENARIO-000052",
    slug: "message-claiming-images-of-you",
    version: 1,
    attackCode: "AI-000009",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Unknown account",
    teaser:
      "A message from an unknown account claims to have images of you and demands a payment.",
    content: {
      sender: "Unknown account, recently created",
      body: "I got hold of photos of you and I altered them. If you don't want me to send them to your contacts, you have 24 hours to pay. Don't try to block me.",
      ui: "web",
    },
    choices: [
      {
        id: "pay",
        label: "I pay to stop it from being shared",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "negotiate",
        label:
          "I reply to try to negotiate or to understand exactly what they have",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "document-and-report",
        label:
          "I don't reply, I keep timestamped screenshots and I report the situation",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["document-and-report"],
    explanations: {
      pay: {
        technique: "AI misuse of photos",
        indicator: "24-hour deadline, threat of sharing",
        whyDangerous:
          "Paying stops nothing: it confirms that the target pays and that the pressure works, which generally leads to new demands rather than ending them. The deadline has no technical purpose: it serves only to stop you from thinking and from talking about it.",
        reflex:
          "Paying never makes this kind of demand stop; on the contrary, it confirms that it works.",
      },
      negotiate: {
        technique: "AI misuse of photos",
        indicator:
          "Explicit instruction not to block, aimed at keeping contact",
        whyDangerous:
          "Replying, even to negotiate or understand, provides additional information and keeps open a channel the author is precisely trying to preserve. There is nothing to gain from this exchange that improves the situation.",
        reflex:
          "There is nothing to check or negotiate with the author of such a message; engaging only plays along.",
      },
      "document-and-report": {
        technique: "AI misuse of photos",
        indicator:
          "No evidence kept, a situation that could get worse without a trace",
        whyDangerous:
          "This is the right answer. Keeping timestamped screenshots, page addresses and account usernames gives you what you'll need to report what happened, without ever engaging with the message's author.",
        reflex:
          "Don't reply, keep all timestamped evidence, and report the situation rather than dealing with it alone.",
      },
      unsure: {
        technique: "AI misuse of photos",
        indicator: "Precise threat, short deadline",
        whyDangerous:
          "Not replying makes nothing worse: it's replying that keeps up the contact the author is looking for.",
        reflex:
          "When in doubt, don't reply and keep all the evidence before reporting the situation.",
      },
    },
  },
];
