# Specification

## Summary
**Goal:** Activate a full online gaming experience with real game URLs, category filters, a live leaderboard, and a polished professional UI.

**Planned changes:**
- Add `gameUrl` field to the backend game data model; update `addGame` and `getGames` accordingly
- Seed backend with at least 2 real online game URLs per sport (Cricket, Football, Basketball, Tennis)
- Update "Play Now" button on each GameCard to open the game's URL in a new browser tab
- Add a sport category filter bar (All, Cricket, Football, Basketball, Tennis) on the Games page with gold/red active highlight
- Make the Leaderboard page fully functional: visible score submission form (username, score, sport), auto-refresh after submission, and a manual "Refresh" button showing top 10 players with rank/username/sport/score
- Add animated hover effects on game cards (scale + gold/red glow border)
- Add a "Featured Games" horizontal scroll section on the Home page showing 4–6 games from the backend
- Add a "Top Player" banner/ticker on the Home page showing the current leaderboard #1 entry
- Add smooth page transition animations between routes
- Add a thin top loading progress bar during data fetch states

**User-visible outcome:** Users can browse games by sport category, click "Play Now" to open real online games in a new tab, submit scores to a live leaderboard that updates instantly, and experience a polished gaming platform with animated cards, featured games, a top player banner, and smooth transitions.
