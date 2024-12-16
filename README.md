# rbdc_ex_1 Exercise 1 (Kids Typing Game)

*Progress*
Backend
- database set up on local, scheme defined and migrations done, seeding done

Frontend
-

TODO
- frontend nextjs app



*API Routes Plan*
User Authentication

    POST /api/auth/register: Register a new user.
    POST /api/auth/login: Log in an existing user.
    POST /api/auth/logout: Log out the current user.
    GET /api/auth/me: Fetch the currently logged-in user profile.

Game Levels

    GET /api/levels: Get all game levels with their details.
    GET /api/levels/:id: Get a specific game level.
    POST /api/levels: Create a new game level (admin only).
    PUT /api/levels/:id: Update a specific level's details (admin only).
    DELETE /api/levels/:id: Delete a level (admin only).

Game Progress

    POST /api/progress: Save user progress (e.g., scores, completed levels).
    GET /api/progress/:userId: Fetch progress for a specific user.

Achievements & Rewards

    GET /api/achievements: Get all possible achievements and badges.
    POST /api/rewards: Award a badge or achievement to a user.
    GET /api/rewards/:userId: Fetch a user's earned badges and achievements.

Daily Streaks & Goals

    POST /api/streaks: Update daily streak for a user.
    GET /api/streaks/:userId: Fetch a user's daily streaks and goals.

Miscellaneous

    GET /api/leaderboard: Fetch the leaderboard showing top-performing users.

