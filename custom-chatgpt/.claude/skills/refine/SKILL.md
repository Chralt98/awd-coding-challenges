---
name: refine
description: Survey the existing codebase including route structure, data layer, and test setup for a user feature implementation.
---

1. Derive a short kebab-case slug from the feature being implemented (e.g. "Add a user-based chat history" → `user-based-chat-history`). Use this slug in place of `<feature>` below.
2. Spawn three agents to survey the codebase:
   - One agent to analyze the route structure and endpoints.
   - One agent to analyze the data layer and database interactions.
   - One agent to analyze the test setup and coverage.
3. Synthesize the findings from the three agents into a comprehensive report located in `plan/<feature>-refinement.md`.
