# Specification

## Summary
**Goal:** Add three new sport categories (Racing, Badminton, Shooting), update the homepage hero section with the R2S Sports Champion Pro description, and create a Terms & Conditions page with footer link.

**Planned changes:**
- Add Racing, Badminton, and Shooting as new sport categories in the backend with at least 2 game entries each (name, category, description, thumbnailUrl, gameUrl)
- Update backend category validation/enums to include the three new categories
- Add filter buttons for Racing, Badminton, and Shooting to the Games page (/games) category filter bar
- Update the homepage hero/about section to display the R2S Sports Champion Pro tagline, all six sports with emojis, and feature highlights (smooth controls, offline & online play, achievements, global leaderboard)
- Create a Terms & Conditions page at route /terms with 11 sections styled in the dark red/gold VIPbansal theme; contact email mjkjbansal@gmail.com and "Last Updated: 2026" footer note
- Add a "Terms & Conditions" link in the Footer component next to the Privacy Policy link
- Register the /terms route in the TanStack Router configuration in App.tsx

**User-visible outcome:** Users can filter and play games in Racing, Badminton, and Shooting categories, see an updated homepage hero describing the full R2S Sports Champion Pro experience, and access a styled Terms & Conditions page linked from the footer.
