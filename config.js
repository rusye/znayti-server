"use strict";
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/znayti";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/test-znayti";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
exports.GOOGLEMAPS_API = process.env.GOOGLEMAPS_API;
exports.ZOHO_USER = process.env.ZOHO_USER;
exports.ZOHO_PASS = process.env.ZOHO_PASS;
exports.ALERT_EMAIL = process.env.ALERT_EMAIL;
exports.SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
exports.NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
