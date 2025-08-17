// Fake email domains
const fakeEmailDomains = [
  "example.com",
  "test.com",
  "mail.com",
  "tempmail.com",
  "myinbox.com",
  "mailinator.com",
  "fakemail.com",
  "nowhere.com",
  "nomail.com",
  "nospam.com",
  "mailtest.com",
  "testingmail.com",
  "samplemail.com",
  "mockmail.com",
  "demomail.com",
  "trialmail.com",
  "placeholder.com",
  "bogusmail.com",
  "spammail.com",
  "trashmail.com",
  "discardmail.com",
  "shamail.com",
  "fakemailbox.com",
  "tempinbox.com",
  "mailsample.com",
  "unrealmail.com",
  "mailplaceholder.com",
  "fauxmail.com",
  "noemail.com",
  "fakebox.com",
  "mailbogus.com",
  "mockinbox.com",
  "spamfree.com",
  "mailtrash.com",
  "tempobox.com",
  "fakeaddress.com",
  "randommail.com",
  "madeupmail.com",
  "sampleinbox.com",
  "ghostmail.com",
  "junkmail.com",
  "nomailbox.com",
  "trialinbox.com",
  "mymail.com",
  "falsemail.com",
  "bogomail.com",
  "maildrop.com",
  "testbox.com",
  "fakemail.net",
  "mailjunk.com",
  "spoofmail.com",
  "fakemail.org",
  "disposablemail.com",
  "mailalias.com",
  "mailmask.com",
  "noaddress.com",
  "fakeserver.com",
  "mytempemail.com",
  "fakecontact.com",
  "tempmailplus.com",
  "burnmail.com",
  "spoofinbox.com",
  "nomailrequired.com",
  "mailmask.net",
  "junkbox.com",
  "tempmailer.com",
  "fakeremail.com",
];
const roles = ["admin", "user"];
function getRoles() {
  return roles[Math.floor(Math.random() * 2)];
}
function randomEmailName(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Generate random email
function randomEmail() {
  const username = randomEmailName(10);
  const domain = fakeEmailDomains[Math.floor(Math.random() * fakeEmailDomains.length)];
  return `${username}@${domain}`;
}

// Generate random password
function randomPassword(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ372938*!@#$%^&*()_+_";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Send POST request
async function sendRandomUser() {
  const NUM = 1000000;
  let users = [];
  for (let i = 0; i < NUM; i++) {
    users.push({
      email: randomEmail(),
      password: randomPassword(),
      role: getRoles(),
    });
    if ((i + 1) % 100000 === 0) {
      console.log(i + 1);
      await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      });
      users = [];
    }
  }
}

// Run it
sendRandomUser();
