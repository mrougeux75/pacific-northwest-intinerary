# Pacific Northwest Itinerary · August 16–25, 2026

A mobile-friendly, offline-capable GitHub Pages itinerary built from the 12 supplied Word documents.

## Publish on GitHub Pages

1. Create a new public or private GitHub repository.
2. Upload everything in this folder to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will show the site address after publishing finishes.

The site can also be previewed by opening `index.html`. Offline caching activates after the site is served by GitHub Pages and visited once.

## On iPhone

Open the published site in Safari, tap **Share**, then **Add to Home Screen**. Open every day at least once while online before relying on the offline copy. Google Maps and external condition/tide pages still require a connection unless separately downloaded.

## What is included

- Ten day-by-day itinerary screens
- Dates, routes, drive-time estimates, hotels, phone numbers and check-in times
- Flights and prepaid Avis rental-car information
- Hiking, sightseeing, meals, tide, road-condition and safety notes
- Lower Deschutes fly-fishing guide and logistics
- Google Maps buttons
- Search, device-saved checklist and device-only private notes
- Offline caching after the first hosted visit

## Source reconciliation and remaining ambiguities

The master document, `Pacific NW Itinerary2.docx`, was used to resolve obvious heading errors:

- Day 6 is **Friday, August 21**, although its detail-document heading says August 22.
- Day 7 is **Saturday, August 22**, although its detail-document heading says Sunday.
- The final travel day is **Day 10, Tuesday, August 25**. Its filename says August 15, its body says only “DAY 10,” and the master labels it “Day 11”; the continuous August 16–25 sequence makes the intended date and day number clear.

The following source differences or open questions were preserved rather than guessed:

- Day 3 Olympic Lodge → Mount Rainier is listed as **159 miles / 3 hours** in the master and **176 miles / 3.5 hours** in the day detail. Both estimates appear in the site.
- Day 3 Rainier hiking varies between a **4–6 mile Skyline Trail** in the master and a shorter **2–4 mile partial Skyline walk** plus other short walks in the detail.
- Day 4 says to check “Highway 100” on TripCheck. The site retains the reminder but asks the traveler to verify the intended Historic Columbia River Highway listing.
- Day 4 offers several mutually exclusive afternoon hike choices; no single option is confirmed.
- Day 8 does not state a guide meeting time.
- Day 8 asks whether **flies, tippet and leaders** are supplied or are add-ons; this remains a pre-trip confirmation item.
- The outbound document lists Delta flights **DL 1610 and DL 774** but does not identify the connecting airport or individual leg times.
- No hotel reservation confirmation numbers are present in the source documents.

## Before travel

Road, park, trail, tide, restaurant and access information can change. Verify official conditions shortly before each relevant day, especially Mount Rainier, Mount St. Helens, the Historic Columbia River Highway, Cape Perpetua tides and Crater Lake.

## Privacy

The site contains the Avis confirmation number supplied in the source. If the repository is public, anyone can see it. Consider replacing it with a placeholder in `data.js` and storing the number in the site’s **Trip → Private confirmation notes** field instead; that field remains only in the current browser.
