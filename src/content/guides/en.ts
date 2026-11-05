import { VERIFIED_REFERENCES as REF } from "@/content/attacks/types";
import type { GuideTranslation } from "./types";

/**
 * English translations of the guides, keyed by the French slug.
 *
 * Same convention as the English attack pages: the help services stay the
 * French ones, placed in context (« in France ») — no foreign service is
 * named, none having been verified for this site. Same structure as the
 * French guide, item for item: checked by `auditGuides`.
 */
const PHISHING_REF = {
  label:
    "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
  url: REF.phishing.url,
};
const FAKE_SUPPORT_REF = {
  label:
    "Cybermalveillance.gouv.fr — Fake tech support (French government cybersecurity assistance service)",
  url: REF.fakeSupport.url,
};
const ASSISTANCE_REF = {
  label:
    "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
  url: REF.cybermalveillance.url,
};

export const GUIDES_EN: Readonly<Record<string, GuideTranslation>> = {
  "verifier-un-lien-avant-de-cliquer": {
    slug: "check-a-link-before-clicking",
    title: "Check a link before you click",
    question: "How can I tell if a link is dangerous before opening it?",
    shortAnswer:
      "Read the domain name — the part just before the first slash — and read it from right to left. It is the only part of the address its owner cannot freely choose. And when the link leads somewhere you have to sign in or pay, don't use it at all: reach the service through a bookmark or its app.",
    why: "From a security point of view, everything else in an address is decoration: the subdomain, the path, the parameters, the text displayed instead of the link, and even the padlock — which only shows that the connection is encrypted, not that the site is honest. An attacker can write “mybank.com” anywhere in an address they don't own. The only thing they actually have to own is the domain name, so that is the only thing you need to read.",
    steps: [
      {
        title: "Reveal the real address",
        body: "On a computer, hover over the link without clicking: the address appears at the bottom of the window. On a phone, press and hold to open a preview. The visible text of the link means nothing — it can show one address and point to another.",
      },
      {
        title: "Find the domain name",
        body: "Find the first slash after “https://”: everything before it is the domain, and what counts is its END. In “login.mybank.com.dubious-example.test/”, the site belongs to “dubious-example.test” — the “mybank.com” in the middle is decoration, placed there to be read first. So read from right to left until you reach the organization's name: if it doesn't come straight away, you are not on its site. Watch out for compound extensions such as “.gouv.fr” or “.co.uk”, where the real name is the word just before: in “impots.gouv.fr” (France's tax site), it is “impots”.",
      },
      {
        title: "Compare it with what you expected",
        body: "One extra letter, an added hyphen, a different extension: these are separate domains, owned by someone else. An address starting with “xn--” signals non-Latin characters, which is not fraudulent in itself but has no business being there when you expected an ordinary name.",
      },
      {
        title: "For a login or a payment, take another route",
        body: "Never sign in from a link you received, even after checking it. Open a saved bookmark or the official app. Your password manager is a quiet ally here: it ties your credentials to the real domain, so if it stays silent on a site you normally use, that is a warning.",
      },
    ],
    pitfalls: [
      "Believing the padlock vouches for the site: it only vouches for the encryption of the connection.",
      "Reading the start of the address instead of the end of the domain name.",
      "Trusting a shortened link, which hides exactly the destination.",
      "Checking a message using the contact details that message provides.",
      "Typing a password by hand because the manager doesn't offer it: that is bypassing the only warning you got.",
    ],
    references: [PHISHING_REF],
  },

  "verifier-l-identite-d-un-interlocuteur": {
    slug: "verify-who-you-are-talking-to",
    title: "Verify who you are really talking to",
    question:
      "How can I be sure the person contacting me is who they claim to be?",
    shortAnswer:
      "Switch channels. Get back in touch through a route you already had before this message: the number on the back of your card, the one saved in your contacts, the official app. Checking by replying to the message means asking the stranger to confirm they are who you think.",
    why: "No sign you receive proves an identity, because they can all be reproduced: an email's display name is a free-text field, a text message's sender is just a label, a caller's number can be spoofed, a profile photo can be copied. Even a genuine account can be compromised, in which case the message really does come from the right account. What stays out of the attacker's reach is not a sign but a route: the one you choose yourself.",
    steps: [
      {
        title: "Break off the exchange",
        body: "Hang up, don't reply, close the conversation. Nothing you are being asked to do stops being valid in ten minutes, and someone who claims otherwise has just told you something.",
      },
      {
        title: "Choose a route that predates the message",
        body: "The test is the date: the number must have been in your hands before the request arrived. The back of your bank card, a long-saved contact, a paper bill, the official app installed from an app store.",
      },
      {
        title: "For someone close to you, call, don't write",
        body: "A message from a “new number” is checked by calling the old one, not by writing to the new one. If no one answers, call someone else in the family. A voice is still, for now, harder to imitate than text — but bear in mind that voices can now be cloned: a question only the real person can answer is still useful.",
      },
      {
        title: "At work, follow the procedure rather than your judgment",
        body: "Two-person approval of a transfer exists for the days when the message is convincing. Suspending it “just this once” is exactly what the fraud asks for; applying it never needs justifying.",
      },
    ],
    pitfalls: [
      "Calling back the number shown by the incoming call: it can be spoofed.",
      "Replying to the message to ask for confirmation: the answer goes to the attacker.",
      "Treating an accurate detail about you as proof: it often comes from a data breach.",
      "Not checking out of politeness, when checking never has to be announced as a doubt.",
      "Calling back straight away without hanging up properly: the line can stay open.",
    ],
    references: [PHISHING_REF],
  },

  "comment-un-mot-de-passe-est-vole": {
    slug: "how-passwords-get-stolen",
    title: "How a password actually gets stolen",
    question: "How do hackers get hold of a password?",
    shortAnswer:
      "There are three routes, and guessing is not one of them. Either they already have it, because it leaked from a service you used and they try it elsewhere. Or you type it in yourself, on a page imitating a site you know. Or software installed on your machine collects it. A password's length protects against none of the three — only its uniqueness does.",
    why: "The image of a hacker “cracking” a password character by character misdescribes what happens, for a mechanical reason: services limit attempts and lock the account after a few tries, which makes that route impractical however much computing power is involved. The three routes below get around the problem instead of tackling it — they don't need to guess. That is why useful advice is about uniqueness and a second factor rather than complexity: complexity only defends against the route nobody takes.",
    steps: [
      {
        title: "A breach elsewhere, then reuse",
        body: "A site is compromised, its credentials circulate in batches, and an attacker automatically tries them on dozens of other services. Nothing is guessed: your password is known, and it opens everything that shares it. This route costs the attacker almost nothing — no flaw to find, no victim to convince — and the only remedy is a different password for each service.",
      },
      {
        title: "Typing it into a fake page",
        body: "A page imitating a legitimate service collects what you type into it. No flaw is exploited: you type it in willingly, which makes the attack independent of how strong the password is.",
      },
      {
        title: "Software installed on your device",
        body: "A program collects the passwords saved in the browser, session cookies and keystrokes. It had to be installed, which takes an action on your part: a file opened, a fake update accepted, an app taken from somewhere other than an official store. That is what makes it avoidable.",
      },
      {
        title: "Getting around the second factor",
        body: "When a password is no longer enough, the attacker asks for the code — on the phone, the second after it is sent — or floods the victim with approval requests. Receiving a code you didn't ask for means one thing only: someone already knows your password.",
      },
    ],
    pitfalls: [
      "Aiming for complexity rather than uniqueness: a very long password is still useless once it has leaked and is reused.",
      "Neglecting an old account of no value: it often carries a password still used elsewhere.",
      "Changing the password of the one account that raised an alert, and leaving the others that share it.",
      "Thinking a password manager is risky: the risk it removes — reuse — is the one behind most account takeovers.",
      "Relying on text messages alone as a second factor, when the number itself can be hijacked.",
    ],
    references: [ASSISTANCE_REF],
  },

  "activer-la-double-authentification": {
    slug: "turn-on-two-factor-authentication",
    title: "Turn on two-factor authentication, and choose it well",
    question: "How do I protect my accounts with two-factor authentication?",
    shortAnswer:
      "Turn it on for your main email account first, even before your bank: that is the account that can reset all your others. Prefer an authenticator app or a physical key to a code by text message. And write down your backup codes somewhere other than the phone that generates the codes.",
    why: "Two-factor authentication adds a proof the attacker cannot get with the password alone. Not all methods are equal: a text message depends on your number, which can be moved to another SIM card without your knowledge; an app generates the codes offline on your device; a physical key also checks the site's domain, which makes it immune to fake pages. The order in which you turn it on matters as much as the method, because an unprotected email account cancels out the protection of everything else.",
    steps: [
      {
        title: "Start with your main email account",
        body: "It is the account that opens the others: your services' “forgot password” feature sends its links there. Protect it before your bank, before your social media.",
      },
      {
        title: "Choose the strongest method offered",
        body: "A physical security key if the service accepts one, otherwise an authenticator app, and text messages only as a last resort. A text message is still far better than no second factor at all: if it is the only option, take it.",
      },
      {
        title: "Keep the backup codes safe",
        body: "They are for the day the device is lost or stolen. Keep them off that same device: on paper, or in a password manager you can reach from elsewhere. Backup codes stored only on the phone that generates the codes protect against nothing.",
      },
      {
        title: "Check the recovery options",
        body: "Backup email address, phone number, security questions: these are your account's back doors, and they are the first things an attacker changes. Check them when you turn the feature on, then from time to time.",
      },
    ],
    pitfalls: [
      "Protecting the bank and leaving the email account without a second factor.",
      "Giving a verification code to anyone: no service ever asks for one, through any channel.",
      "Approving a sign-in request to make repeated notifications stop.",
      "Keeping the backup codes on the device that generates the codes.",
      "Leaving security questions whose answers are on your public profiles.",
    ],
    references: [ASSISTANCE_REF],
  },

  "que-faire-apres-avoir-paye-une-arnaque": {
    slug: "what-to-do-after-paying-a-scammer",
    title: "What to do in the hour after a fraudulent payment",
    question: "I paid a scammer, what do I do now?",
    shortAnswer:
      "Call your bank straight away, before anything else. Time is the only factor you still control: a very recent transfer can sometimes be recalled, a card payment disputed. Keep everything, don't call the scammer back, and file a police report afterwards.",
    why: "What decides the outcome is not the amount but the time that has passed and the payment method used. A transfer leaves your account for good once it has gone through, but as long as the funds have not been withdrawn from the receiving account, the bank can attempt a recall. A card payment falls under a dispute procedure. Irreversible methods — cash money orders, prepaid cards, cryptocurrency — offer almost no recourse, which is why scammers ask for them.",
    steps: [
      {
        title: "Call the bank, within the hour if you can",
        body: "Explicitly ask for the transaction to be blocked and, for a transfer, for a recall of the funds. Block the card if it was used or typed in somewhere. This is the only step where every minute truly counts.",
      },
      {
        title: "Cut off contact, without deleting anything",
        body: "Stop replying, don't call back, don't try to negotiate. But don't delete anything: conversations, the listing, the bank details you were sent, transfer references, a screenshot of the payment page. They are the evidence for your police report.",
      },
      {
        title: "Change whatever may have been exposed",
        body: "If you typed credentials into a page, change that password and every one like it, starting with your email. If identity documents were sent, watch for letters from lenders you never contacted.",
      },
      {
        title: "File a police report, then report it",
        body: "The police report is what frames your later dealings with the bank. Then report what happened to Cybermalveillance.gouv.fr (in France) and, where relevant, to the platform where the exchange took place — it protects the next people.",
      },
    ],
    pitfalls: [
      "Waiting until the next day to call the bank: it is the only window that closes.",
      "Paying an extra amount presented as necessary to recover the first.",
      "Deleting the conversation out of shame or anger: it is your evidence.",
      "Trusting someone who then offers to help you recover the money: they are often the same people.",
      "Not filing a report because the amount seems too small: reports are cross-checked against each other.",
    ],
    references: [ASSISTANCE_REF],
  },

  "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site": {
    slug: "entered-my-password-on-a-fake-site",
    title: "I entered my password on a fake site: what to do",
    question:
      "I clicked a link and entered my password on a fake page, what do I do?",
    shortAnswer:
      "Change that password right away, from the real service opened by your own means — a bookmark or the app, never the link you received — then sign out every open session on the account. Then change the same password everywhere you used it, starting with your email. If you also entered a bank card, call your bank before anything else.",
    why: "A fake page doesn't need to break anything: you gave it the password, and it can pass it on at once to someone who signs in in your place while you are still reading the page. Two things follow. First, a session the attacker has already opened survives the password change unless you sign out active sessions. Second, the stolen password is not only worth something for that service: it will be tried everywhere else, and your email matters more than anything because it can reset your other accounts.",
    steps: [
      {
        title: "Change the password from the real service",
        body: "Close the page you were sent to. Open the service through a saved bookmark or its official app, then change the password. Don't go through any link in the message, not even to “check”: it is what led you to the copy.",
      },
      {
        title: "Sign out active sessions",
        body: "In the account's security settings, sign out all devices and sessions. A sign-in relayed in real time by the fake page stays open after the password change: this step is what cuts it off.",
      },
      {
        title: "Change it everywhere it was reused",
        body: "The stolen password will be tried on other services. Start with your main email, then your bank, then the rest. Take the opportunity to turn on two-factor authentication, at least for your email and your bank.",
      },
      {
        title: "Check what the attacker may have changed",
        body: "Recovery email and number, email forwarding rules, connected devices: these are the first things an attacker changes to keep access. If bank details were entered on the page, block the card with your bank. Then report what happened to Cybermalveillance.gouv.fr (in France); if the link came by text message, the message can be forwarded to 33700 (France's spam-text reporting number).",
      },
    ],
    pitfalls: [
      "Going back to the page through the same link to “check” or undo what you typed.",
      "Changing the password without signing out open sessions, which stay valid.",
      "Only changing the account concerned, when the same password opens other services.",
      "Ignoring a verification code you received without asking for it: it means someone already knows the password.",
      "Waiting to see whether something happens: the delay only helps the attacker.",
    ],
    references: [PHISHING_REF, ASSISTANCE_REF],
  },

  "j-ai-donne-mes-coordonnees-bancaires-ou-un-code": {
    slug: "gave-my-card-details-or-a-code",
    title: "I gave out my card details or a code: what to do",
    question:
      "I gave my bank card or a verification code to a scammer, what do I do?",
    shortAnswer:
      "Call your bank immediately, on the number on the back of your card or in the official app, and block your card. Do it even if no money has been taken yet: a card number or code that has been handed over is used to pay or approve a transaction within minutes. Then write down what happened and file a police report.",
    why: "A card number or verification code is only worth something to the scammer while it works. Blocking the card makes it useless, and it is the only step whose effectiveness depends on how fast you are. The number you call matters as much as the speed: the one your caller gave you, or the one that showed during the call, can lead back to the same person. A bank never asks you to move money to protect it, and no service ever asks you to give it a verification code — if you were asked for one, the transaction under way is the scammer's.",
    steps: [
      {
        title: "Hang up, then call the bank yourself",
        body: "If the exchange is still going on, end it. Then dial the number on the back of your card or use the official app. Wait a few minutes or use another line: a line can stay open if you don't hang up properly.",
      },
      {
        title: "Block the card and report the transaction",
        body: "Ask for the card to be blocked and report any transaction you didn't make or that you approved under pressure. Don't approve any further notification or code until the bank has confirmed the situation is under control.",
      },
      {
        title: "Write down the details while they are fresh",
        body: "Time of the call, number displayed, name given by the caller, amounts mentioned, messages received. Don't delete anything: these are the elements of your police report and your dispute.",
      },
      {
        title: "File a report, report it, secure the rest",
        body: "File a police report, then report what happened to Cybermalveillance.gouv.fr (in France). If you also gave out a login or a password, change it from a clean device and sign out the account's active sessions.",
      },
    ],
    pitfalls: [
      "Calling back the number that was displayed, or the one given during the call.",
      "Waiting to see a charge before reacting: blocking the card is meant to prevent it.",
      "Approving “to cancel” a notification or code that arrives just after the call.",
      "Believing a caller who knew your details must have been genuine: those details often come from a data breach.",
      "Not filing a report out of embarrassment: it is also the basis for your dealings with the bank.",
    ],
    references: [ASSISTANCE_REF],
  },

  "mon-compte-a-ete-pirate": {
    slug: "my-account-was-hacked",
    title: "Take back a hacked account (email, social media)",
    question: "My account was hacked, how do I get it back?",
    shortAnswer:
      "Start the service's recovery procedure without waiting, from a clean device. Once you have the account back, sign out every session, remove what the attacker added — forwarding rules, connected apps — and restore your recovery options before anything else. Then warn your contacts through another channel.",
    why: "Taking back an account is not enough to keep it. An attacker who changed the backup email, the recovery number or added a forwarding rule can repeat the move as often as they like: until those are restored, changing the password achieves nothing. Speed matters for another reason too: recovery procedures get harder once the associated email address has been replaced. Finally, a hacked account is often used to write to the people close to you in your name, and they are the ones to protect.",
    steps: [
      {
        title: "Recover the account from a clean device",
        body: "Use the service's official recovery procedure. If you suspect malicious software on your device — a recently installed program, an unknown extension — do it from another device.",
      },
      {
        title: "Sign out sessions, then change the password",
        body: "Sign out all devices and sessions, then change the password. This order matters when session cookies have been stolen: they stay valid as long as the session is not closed. Then generate new backup codes.",
      },
      {
        title: "Remove what the attacker left behind",
        body: "Delete any unknown forwarding or filtering rule in your email, revoke authorized third-party apps, and restore the recovery email address and number. Turn on two-factor authentication.",
      },
      {
        title: "Protect linked accounts and your contacts",
        body: "Change the passwords of the accounts tied to this address, starting with your bank. Warn your contacts through another channel and, if needed, post a message flagging the requests sent in your name. If someone close to you sent money, they must contact their bank immediately and file a police report themselves. Report what happened to Cybermalveillance.gouv.fr (in France).",
      },
    ],
    pitfalls: [
      "Changing the password without checking the recovery email and number.",
      "Forgetting the email forwarding rules, which keep sending your messages to the attacker.",
      "Running the recovery from the device that may have been used to steal access.",
      "Waiting before starting recovery: it gets harder once the associated address has been changed.",
      "Not warning anyone, while your contacts receive requests in your name.",
    ],
    references: [ASSISTANCE_REF],
  },
  "j-ai-laisse-quelqu-un-prendre-la-main-sur-mon-appareil": {
    slug: "let-someone-take-control-of-my-device",
    title: "I let someone take control of my device: what to do",
    question:
      "I installed software or let a “technician” take control of my computer, what do I do?",
    shortAnswer:
      "If you paid or gave out a card, call your bank first to block it. Then disconnect the device from the internet and uninstall any remote-control tool installed at your caller's request. From another, clean device, sign out your accounts' sessions and change the passwords, starting with your email and your bank. Finally, have the device checked.",
    why: "While they had control, the person had access to everything accessible in that session: files, email, passwords saved in the browser, open sessions. Two things follow. First, the device is no longer a safe base: passwords are changed from another device. Second, uninstalling the program isn't enough to establish that the machine is clean, and software that works normally proves nothing: that is an argument for discretion, not proof of harmlessness. On a device holding important data, reinstalling the system is the only reset you can vouch for.",
    steps: [
      {
        title: "If money is involved, your bank comes first",
        body: "If you paid, or gave out a card or a code during the exchange, contact your bank to dispute the transaction and block it: the sooner you act, the more effective it is. Call the number on the back of your card, never the one your caller gave you.",
      },
      {
        title: "Cut off the access",
        body: "Disconnect the device from the internet. Then uninstall any remote-control tool installed at your caller's request, and any program they had you install.",
      },
      {
        title: "Change your passwords from another device",
        body: "Treat any credentials entered or saved on this machine as exposed. From another, clean device, sign out your accounts' open sessions, then change the passwords, starting with your email, which is used to reset your other accounts, and your bank.",
      },
      {
        title: "Have the device checked, or reset it",
        body: "Have the machine scanned, knowing what the check is worth: it finds what didn't try to hide, and a lack of detection proves nothing. On a device holding important data, reinstalling the system is the only reset you can vouch for. Don't then restore a backup made before the suspicion arose without having it examined, or you risk reinstalling what you just removed.",
      },
      {
        title: "Report it",
        body: "Report the incident to Cybermalveillance.gouv.fr (in France). On a work computer, notify IT before doing anything.",
      },
    ],
    pitfalls: [
      "Calling back the number shown by the alert, or the one the “technician” gave you.",
      "Changing your passwords from the device that was taken over.",
      "Settling for uninstalling the program: that doesn't prove the machine is clean.",
      "Feeling reassured because the computer, or the installed software, works normally.",
      "Restoring a backup made before the suspicion arose without having it examined: it can bring back what you just removed.",
      "Deleting everything right away when it's someone close to you who is watching the device: acting on it is visible to them. Read the stalkerware entry first.",
    ],
    references: [FAKE_SUPPORT_REF, ASSISTANCE_REF],
  },
};
