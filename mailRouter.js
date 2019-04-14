"use strict";

const express = require("express");
const router = express.Router();
const axios = require("axios");

const nodemailer = require("nodemailer");

const {
  ZOHO_USER,
  ZOHO_PASS,
  ALERT_EMAIL,
  SUPPORT_EMAIL,
  NOTIFICATION_EMAIL
} = require("./config");

router.post("/", (req, res) => {
  let contactName = req.body.contactName
    ? req.body.contactName
    : "No specific contact";

  let newBusinessDetails = `<p>
      Name: ${req.body.businessToAdd}<br />
      Telephone: ${req.body.newBusinessTelephone}<br />
      Contact: ${contactName}<br />
      Address: ${req.body.newBusinessAddress}<br />
      Hours: ${req.body.newBusinessHours}
    </p>`;

  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    auth: {
      user: `${ZOHO_USER}`,
      pass: `${ZOHO_PASS}`
    },
    logger: true,
    debug: false
  });

  const mailOptions = [
    {
      from: `Znayti Support <${SUPPORT_EMAIL}>`,
      to: `${req.body.submitterName} <${req.body.replyTo}>`,
      subject: `Your submission ${req.body.businessToAdd}`,
      html: `<p>${req.body.submitterName},</p>
        <p>We will be adding ${
          req.body.businessToAdd
        } to Znayti soon.  If you have any questions please feel free to reach out.</p>
        <p>${newBusinessDetails}</p>
        <p>Znayti - Helping you connect with a business that can communicate with you in Russian.</p>`
    },
    {
      from: `Znayti App <${NOTIFICATION_EMAIL}>`,
      to: `Znayti Support <${SUPPORT_EMAIL}>`,
      bcc: `Notification <${ALERT_EMAIL}>`,
      replyTo: `${req.body.replyTo}`,
      subject: `New Submission ${req.body.businessToAdd}`,
      html: `<h1>Please add this listing</h1><p>${newBusinessDetails}</p>`
    }
  ];

  mailOptions.forEach(mail => {
    transporter.sendMail(mail, function(err, info) {
      if (err) {
        console.error(err.message);
        res
          .status(500)
          .json({ message: "Something went wrong, please try again later" });
      } else {
        res.status(201).json({ message: "Email successfully send" });
      }
    });
  });
});

module.exports = { router };
