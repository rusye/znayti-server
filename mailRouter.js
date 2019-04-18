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
  let requiredFields = ["formID", "replyTo", "submitterName"];

  {
    req.body.formID === "edit"
      ? requiredFields.push("businessID", "comment")
      : null;
  }

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing "${field}" in request body`;
      console.error(message);
      return res.status(400).json({ code: 400, message });
    }
  });

  let userSubject =
    req.body.formID === "add"
      ? `Your Submission ${req.body.businessToAdd}`
      : `Your Edit Request For ${req.body.businessToEdit}`;

  let adminSubject =
    req.body.formID === "add"
      ? `New Submission ${req.body.businessToAdd}`
      : `New Edit Request For ${req.body.businessToEdit}`;

  let comment = req.body.comment ? req.body.comment : null;

  let userIntroHtml =
    req.body.formID === "add"
      ? `<p>${req.body.submitterName},</p>
    <p>We will be adding ${req.body.businessToAdd} to Znayti soon.`
      : `<p>${req.body.submitterName},</p>
    <p>We will be reviewing your edit request for ${req.body.businessToEdit}.`;

  let adminIntroHtml =
    req.body.formID === "add"
      ? "Please add this listing"
      : "Please review this edit request";

  let submissionDetails =
    req.body.formID === "add"
      ? `Name: ${req.body.businessToAdd}<br/>
        Telephone: ${req.body.newBusinessTelephone}<br/>
        Address: ${req.body.newBusinessAddress}<br/>
        Hours: ${req.body.newBusinessHours}<br/>
        Comment: ${comment}`
      : `Name: ${req.body.businessToEdit}<br/>
        Comment: ${comment}`;

  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false,
    auth: {
      user: `${ZOHO_USER}`,
      pass: `${ZOHO_PASS}`
    },
    tls: {
      ciphers: "SSLv3"
    },
    logger: true,
    debug: false
  });

  const mailOptions = [
    {
      from: `Znayti Support <${SUPPORT_EMAIL}>`,
      to: `${req.body.submitterName} <${req.body.replyTo}>`,
      subject: `${userSubject}`,
      html: `${userIntroHtml}  If you have any questions please feel free to reach out.</p>
        <p>${submissionDetails}</p>
        <p>Znayti - Helping you connect with a business that can communicate with you in Russian.</p>`
    },
    {
      from: `Znayti App <${NOTIFICATION_EMAIL}>`,
      to: `Znayti Support <${SUPPORT_EMAIL}>`,
      bcc: `Notification <${ALERT_EMAIL}>`,
      replyTo: `${req.body.replyTo}`,
      subject: `${adminSubject}`,
      html:
        `<h1>${adminIntroHtml}</h1><p>${submissionDetails}<br />` +
        (req.body.formID === "edit"
          ? `Business ID: ${req.body.businessID}`
          : null) +
        `</p>`
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
        res.status(201).json({ message: "Email successfully sent" });
      }
    });
  });
});

module.exports = { router };
