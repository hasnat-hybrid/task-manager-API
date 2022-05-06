var postmark = require("postmark");

var client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

const welcomeEmail = (email, name) => {
    client.sendEmail({
        "From": "bsem-f18-136@superior.edu.pk",
        "To": email,
        "Subject": "Hello from Postmark",
        "HtmlBody": `<strong>Hello</strong> dear ${name}!`,
        "TextBody": "Hello from Postmark!",
        "MessageStream": "welcome-email"
      })
}

const lastEmail = (email, name) => {
    client.sendEmail({
        "From": "bsem-f18-136@superior.edu.pk",
        "To": email,
        "Subject": "Hello from Postmark",
        "HtmlBody": `<strong>Hello</strong> dear ${name}!`,
        "TextBody": "goodbye from us!",
        "MessageStream": "last-email"
      })
}

module.exports = {
    welcomeEmail,
    lastEmail
}