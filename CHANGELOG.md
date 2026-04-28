# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-22

### Added

- Initial implementation of **Office** and **RMA**
- **Companies**: List view, detail view with company-specific pages, and new company creation
  - Company Infos, Details and Logos
  - Dealer Locator: Manage companies and dealers listed in Meinl Dealer Locator
  - Maps Integration: Google Maps API for location display
  - Notes: Add general information to a company
- **People**: List view, detail view, and new person creation pages
  - Personal & Private Data
  - B2B Access: Manage access, downloads and set a new password
- **Campaigns**: List view, detail view, and new campaign creation pages for brand campaigns
- **RMA Tickets**: List view, detail view, and new ticket creation pages, plus first draft of analytics
  - Status Management, Comments and Attachments
  - Tracking Sheet Generation: PDF creation with barcode and QR code
  - Return Tracking: DHL Return and GLS PickUp handling
- **Authentication**: With Azure AD
- **Internationalization**: i18n support for German & English
- **Locations**: Support for Meinl Germany & USA in a single application
- **Responsive Design**: Mobile-friendly UI
