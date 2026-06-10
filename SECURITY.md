# Security Notes

- Aadhaar is local-only in this scope. No UIDAI/e-KYC integration.
- Aadhaar-like values are encrypted before storage and masked in UI.
- Demo OTP and demo admin PIN must be replaced before production.
- All exports and settings changes are audit logged.
- Uploaded files are restricted by MIME type and size in this scaffold.
- Production must move file storage to approved encrypted storage and add antivirus scanning.
- PostgreSQL RLS migrations are included as foundation; strict policies must be finalized with the application session variable strategy.


## CERT-In Related Features Added

- Incident register with severity, detected time, reported time and reference number.
- Security control checklist for audit evidence readiness.
- Audit hash-chain entries for incident creation/reporting and control updates.
- Settings for incident reporting window and log retention period.
- Exportable JSON report using `npm run certin:report`.

## DPDP Consent Features Added

- Versioned consent notice.
- Consent record per applicant, purpose, notice version and timestamp.
- Applicant consent history page.

## DoPT / CSIR Validation Features Added

- Category-wise vacancy model per post.
- Age relaxation and crucial-date validation service.
- Minimum qualification/experience validation foundation.
- Vacancy availability validation by category.
