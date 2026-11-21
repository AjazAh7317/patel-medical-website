# Patel Medical Store & Physiotherapy Clinic website

A responsive, static website built with HTML, CSS, and vanilla JavaScript. No framework or build step is required.


## Folder structure

```
patel-medical-website/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    └── logo.svg
```

## Run locally

1. Download or unzip the folder.
2. Open `index.html` in a browser. For best local development, use VS Code with the Live Server extension.

## Customize

- **WhatsApp number:** edit `WHATSAPP_NUMBER` at the top of `script.js` (digits only, with country code). The primary number currently receives the enquiry messages.
- **Call links:** update the two phone numbers in `index.html` and `PHONE_PRIMARY` / `PHONE_SECONDARY` in `script.js` if details change.
- **Store hours:** edit the hours placeholder text in the Location section of `index.html` after confirming the business hours.
- **Photos:** replace the custom vector artwork sections with real storefront, staff, or clinic images once provided. No real staff photos were supplied for this build.
- **Reviews:** add real customer testimonials only after receiving permission and verified text.
- **Map pin:** the map card is a decorative locator, not a precise map. The Get Directions / Open Google Maps links launch a search for the business/address and may need a verified Google Maps pin URL later.
- **Bilingual content:** English content is used for now. Hindi text can be added alongside labels or with a language toggle in a future update.

## Form behavior

- Medicine enquiries create a WhatsApp message with product and optional quantity. The prescription filename is included if selected, but browsers cannot attach files directly to a WhatsApp `wa.me` message. The visitor must attach the selected file manually in WhatsApp after it opens.
- Physiotherapy appointment requests open WhatsApp with patient details, preferred date/time, concern and optional message. These are **requests**, not confirmed appointments.
- The forms do not submit to or store information on a server. WhatsApp opens in a new tab/window; if a popup is blocked, allow popups for this page or use the clinic's WhatsApp contact directly.
- This is an enquiry website, not an online pharmacy checkout. It does not sell prescription medicines online.

## Deploy to GitHub Pages

1. Create or open a GitHub repository.
2. Upload all files/folders from this project to the repository root.
3. In repository **Settings → Pages**, select **Deploy from a branch**.
4. Choose `main` (or your default branch) and `/ (root)`, then save.
5. Wait for the Pages deployment, then open the provided site URL.


## Deploy to Netlify

1. Sign in to Netlify and choose **Add new site → Deploy manually**.
2. Drag the project folder (or the folder contents) into the deploy area. Alternatively, connect your Git repository.
3. No build command is required. Publish directory is the project root (`.`).

## Before public launch checklist

- Confirm business hours and holiday schedule.
- Verify which WhatsApp number should receive enquiries.
- Replace illustrative avatars/artwork with authentic business/clinic photos if available and approved.
- Verify Google Maps pin and directions URL.
- Add a privacy policy page if collecting information beyond WhatsApp handoff.
- Test call/WhatsApp links on an actual mobile phone.
- Review all clinic/pharmacy service descriptions for accuracy.
