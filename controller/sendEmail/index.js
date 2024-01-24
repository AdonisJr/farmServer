const express = require('express');
const mailjet = require('node-mailjet').apiConnect(
    'ab73d9180dd049f6b3f586c35d927721',
    '3d39d212d1c02164a47ddb7cb7b34333'
);

const router = express.Router();

router.post('/', async (req, res) => {
    const { to, type, first_name, middle_name, last_name, status, subject, text, html } = req.body;

    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'elpmassample4@gmail.com',
                    Name: 'Administrator',
                },
                To: [
                    {
                        Email: to,
                        Name: 'Adon',
                    },
                ],
                Subject: "Distribution of Subsidy",
                // TextPart: `Type: ${type}`,
//                 textPart: `Dear recipient,

// We are pleased to inform you about the latest subsidy information. Please find the details below:

// Type: Subsidy
// Amount: $XXX
// Effective Date: [Effective Date]

// Thank you for your continued support.

// Best regards,
// [Your Organization]`,

  htmlPart: `<p>Dear ${first_name},</p>

<p>We are pleased to inform you about the latest subsidy information. Please find the details below:</p>

<ul>
  <li><strong>Type:</strong> ${type}</li>
  <li><strong>Status:</strong> ${status}</li>
</ul>
To check additional information you may log in to <a href="http://localhost:3000/">http://localhost:3000/</a>
<p>Thank you for your patience.</p>

<p>Best regards,<br />
Web-Based Farmer’s Cash and Crops Subsidies Management System</p>`
            },
        ],
    });

    try {
        const response = await request;
        // console.log('Email sent:', response.body);
        res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error.statusCode, error.response.body);
        res.status(error.statusCode || 500).json({ success: false, message: 'Error sending email.' });
    }
});

module.exports = router;