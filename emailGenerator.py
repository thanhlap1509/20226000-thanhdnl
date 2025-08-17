import random
import string
import csv
import requests 
import json
OUTPUT_FILE = 'sample_test_data.csv'
URL = "http://localhost:5000/api/user"

# --- Configuration ---
NUM_ENTRIES = 29000000
PASSWORD_LENGTH = 12
OUTPUT_FILE = 'sample_test_data.csv'
DOMAINS = ['example.com', 'test.org', 'sample-data.net', 'gmail.com', 'sis.hust.edu.vn', 'abc.org.zx',  
    "example.com", "test.com", "mail.com", "inbox.com", "fakeemail.com",
    "tempmail.com", "myinbox.com", "mailinator.com", "fakemail.com", "nowhere.com",
    "nomail.com", "nospam.com", "mailtest.com", "testingmail.com", "samplemail.com",
    "mockmail.com", "demomail.com", "trialmail.com", "placeholder.com", "bogusmail.com",
    "spammail.com", "trashmail.com", "discardmail.com", "shamail.com", "fakemailbox.com",
    "tempinbox.com", "mailsample.com", "unrealmail.com", "mailplaceholder.com", "fauxmail.com",
    "noemail.com", "fakebox.com", "mailbogus.com", "mockinbox.com", "spamfree.com",
    "mailtrash.com", "tempobox.com", "fakeaddress.com", "randommail.com", "madeupmail.com",
    "sampleinbox.com", "ghostmail.com", "junkmail.com", "nomailbox.com", "trialinbox.com",
    "mymail.com", "falsemail.com", "bogomail.com", "maildrop.com", "testbox.com",
    "fakemail.net", "mailjunk.com", "spoofmail.com", "fakemail.org", "disposablemail.com",
    "mailalias.com", "mailmask.com", "noaddress.com", "fakeserver.com", "mytempemail.com",
    "tempmailbox.com", "mailnull.com", "maildemo.com", "mailfaux.com", "burnermail.com",
    "tempmailservice.com", "nospammail.com", "spamblock.com", "tempmailnow.com", "inboxfake.com",
    "mailshield.com", "trashbox.com", "testemail.com", "invalidmail.com", "demoemail.com",
    "bogusbox.com", "testinbox.com", "mailmock.com", "spamless.com", "ghostinbox.com",
    "emailtest.com", "tempmailbox.net", "fakemailbox.net", "testmailserver.com", "spamstop.com",
    "tempaddress.com", "mailtester.com", "trialaddress.com", "mailmasker.com", "mockaddress.com",
    "fakeid.com", "fakecontact.com", "tempmailplus.com", "burnmail.com", "spoofinbox.com",
    "nomailrequired.com", "mailmask.net", "junkbox.com", "tempmailer.com", "fakeremail.com"
]


def generate_random_string(length):
    """Generates a random string of letters and digits."""
    characters = string.ascii_letters.lower() + string.digits
    return ''.join(random.choice(characters) for i in range(length))

# --- Main script --- #

print(f"Generating {NUM_ENTRIES} sample entries into '{OUTPUT_FILE}'...")

for i in range(NUM_ENTRIES):
    # Create a fake username
    username = f'{generate_random_string(20)}'

    # Select a random domain
    domain = random.choice(DOMAINS)

    # Combine into a fake email
    email = f'{username}@{domain}'

    # Generate a random password
    password = generate_random_string(PASSWORD_LENGTH)

    data = {
            "email": email,
            "password": password
    }
    response = requests.post(url = URL, json = data)

print("Sample data generation complete.")
