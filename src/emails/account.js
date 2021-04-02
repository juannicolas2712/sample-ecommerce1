const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'juannicolas2712@gmail.com',
//     from: 'juannicolas2712@gmail.com',
//     subject: 'This is my first creation!',
//     text: 'I hope this one actually get to you'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'juannicolas2712@gmail.com',
        subject: 'Welcome Earthling!',
        text: `Soon you will be assimilated ${name}!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'juannicolas2712@gmail.com',
        subject: 'So you have chosen death...',
        text: `This will be your demise ${name}!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}