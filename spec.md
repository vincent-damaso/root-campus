# Root Campus — MVP Spec

## A. Final Product Spec

**Product:** Root Campus
**One-liner:** A campus-scoped project-sharing feed that helps students discover what their peers are building and connect with them in person.

**Problem:** Students build personal projects but have few easy ways to find and reach collaborators nearby. GitHub and LinkedIn surface projects but not proximity, so in-person collaboration between students at the same school rarely happens.

**Target user:** University students.

**Core job to be done:** "I want to share what I'm building and see what others are making so I can connect with like-minded people at my school."

**MVP scope:** A campus picker, a per-campus project feed, project posts with images/description/goal, upvote/downvote, nested comments, and a basic user profile. Gamification and corporate partnerships are explicitly excluded from the MVP.

---

## B. User Flow

```
Select campus (first visit)
        ↓
Land on that campus's project feed
        ↓
Browse / scroll project cards
        ↓
   ┌────┴────┐
   ↓         ↓
Post a      Vote / comment
project     on a project
   ↓         ↓
Others discover it, vote, comment
        ↓
Creator gets feedback, visibility, or collaborators (per selected goal)
        ↓
Creator posts updates / new projects
        ↓
Community grows
```

**Auth flow:** Sign up / log in (email) → select campus (one-time, editable later in profile) → feed.

---

## C. Feature List

### Must have (MVP)
- **Campus selection** — pick a campus from a list on first login; determines which feed you see.
- **Project feed** — scrollable, reverse-chronological feed of projects for the user's campus.
- **Create a project post** — requires: minimum 3 images, description, and a goal (`visibility`, `validation`, or `collaboration`). If `collaboration`, must specify the roles being sought.
- **Project cards** — image, title, description preview, goal badge, upvote/downvote count, comment count.
- **Voting** — one vote per user per project, upvote (+1) / downvote (−1), togglable/changeable, net score displayed.
- **Nested comments** — comment on a project, reply to a comment (one level of nesting is sufficient for MVP).
- **User profile** — name, tech stack, contact info, list of posted projects.
- **Auth** — email/password sign up and login.

### Nice to have (later)
- Joined/collaborated project list on profile.
- Notifications (new comment, new upvote, collaboration request).
- Deeper comment nesting / threaded view.
- Search and filtering within a feed (by goal, by tech stack).
- Editing a campus after initial selection.

### Not in MVP
- Gamification, points, achievements, leaderboards.
- Corporate partnership portal / recruiting features.
- Direct messaging between users.
- Multi-level (>1) comment nesting.

---

## D. Data Model

```
User
- id
- name
- email (unique)
- password_hash
- campus_id (FK → Campus)
- tech_stack (text/array)
- contact_info (text)
- created_at

Campus
- id
- name

Project
- id
- owner_id (FK → User)
- campus_id (FK → Campus, denormalized from owner for fast feed queries)
- title
- description
- goal (enum: visibility | validation | collaboration)
- roles_needed (text/array, only relevant when goal = collaboration)
- images (array of ≥3 image URLs)
- created_at

Vote
- id
- project_id (FK → Project)
- user_id (FK → User)
- value (enum: +1 | -1)
- unique constraint on (project_id, user_id)

Comment
- id
- project_id (FK → Project)
- author_id (FK → User)
- parent_comment_id (nullable FK → Comment, one level of nesting only for MVP)
- body
- created_at
```

**Relationships:**
- User belongs to one Campus.
- Project belongs to one User (owner) and one Campus.
- Vote belongs to one User and one Project (unique per pair).
- Comment belongs to one Project and one User; optionally replies to one parent Comment.

### Business rules
1. A user can vote on a given project at most once; casting a new vote updates or removes the existing one rather than adding a second row.
2. A user can only edit or delete their own projects and comments.
3. A project must have at least 3 images, a description, and a goal to be published.
4. `roles_needed` is required when `goal = collaboration`, otherwise ignored/empty.
5. Email must be unique per user.
6. Comments support exactly one level of nesting (a reply cannot itself be replied to) in the MVP.

---

## E. Recommended Stack

- **Framework:** Next.js (App Router) — current stable major version (16.x as of Sep 2026).
- **Backend/DB/Auth/Storage:** Supabase (Postgres + Row Level Security, Supabase Auth, Supabase Storage for project images).
- **Auth integration:** `@supabase/ssr` for server-side session handling in Next.js. Do **not** use `@supabase/auth-helpers-*` — that package is deprecated and no longer maintained.
- **Styling:** Tailwind CSS (pairs well with Next.js, minimal setup).
- **Hosting:** Vercel (Next.js) + Supabase Cloud free tier.

This is the simplest stack that satisfies "free to run," "beginner-friendly," and "deployable quickly," while matching the preferred Next.js + Supabase choice.

---

## F. Build Plan

1. **Project setup** — scaffold Next.js app, connect Supabase project, set up `@supabase/ssr` client utilities (browser + server).
2. **Database schema** — create `campuses`, `users` (or Supabase auth + profile table), `projects`, `votes`, `comments` tables with RLS policies enforcing the business rules above.
3. **Auth** — email/password sign up and login pages, session handling.
4. **Campus selection** — campus list page; store selected campus on the user's profile.
5. **Project feed** — fetch and render projects for the user's campus, newest first.
6. **Create project flow** — form with image upload (≥3 images), description, goal selector, conditional roles field for collaboration.
7. **Project card + voting** — render card UI, implement upvote/downvote with the one-vote-per-user constraint.
8. **Comments** — add comment, reply to comment (one level), render nested view.
9. **User profile** — display user info and their posted projects.
10. **States** — loading (skeletons/spinners/optimistic updates), empty (404/not-found screen), error screen.

---

## G. Agent Instructions

**Build:**
- Exactly the "Must have" features listed in section C, using the data model in section D and the stack in section E.
- Row Level Security policies that enforce: users edit only their own projects/comments; one vote per user per project.

**Do not build:**
- Gamification, points, achievements, or leaderboards.
- Corporate partnership portal.
- Direct messaging.
- More than one level of comment nesting.
- Any admin/moderation tooling beyond what's needed to satisfy RLS.

**Important business rules:** see section D, "Business rules" (1–6).

**Important edge cases:**
- A project submitted with fewer than 3 images or missing description/goal must be rejected client- and server-side.
- Switching a vote (upvote → downvote or vice versa) must update the existing vote row, not insert a duplicate.
- A reply-to-a-reply attempt should be disallowed or flattened to the top-level comment (pick one behavior and apply consistently).
- Deleting a user's project should also remove/cascade its votes and comments.

**How to know the work is finished:**
- A user can sign up, pick a campus, and see an empty feed for that campus.
- A user can create a project post that satisfies the validation rules and see it appear in the feed immediately.
- A second user can upvote/downvote and comment (including one reply) on that project, and counts update correctly.
- A user can view their own profile and see their posted projects listed.
- Loading, empty, and error states are visibly implemented (not just placeholders).

---

## H. Questions

None of the open items block MVP implementation. Reasonable assumptions made instead of asking:

- **Campus list source:** assumed to be a fixed, seeded list of campuses (no user-submitted campuses) for MVP.
- **Image storage:** assumed Supabase Storage buckets with public read access for project images.
- **Vote change behavior:** assumed a user can change their vote (up↔down) or remove it by re-clicking the same option.
- **Comment nesting depth:** assumed exactly one level (top-level comment + replies, replies cannot be replied to), per section D rule 6.
