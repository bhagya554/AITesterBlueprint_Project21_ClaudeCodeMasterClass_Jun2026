---
description: Recap the last three previous conversations (sessions) for this project
allowed-tools: Bash(ls:*), Bash(stat:*), Glob, Read
---

# /recapme — Recap my last three conversations

When this command runs, produce a concise recap of the **three most recent previous
conversations (sessions)** I had with Claude Code in this project — NOT the current session.

## Where the conversations live

Each past session is stored as one `.jsonl` transcript file in this project's history
folder:

```
C:\Users\91733\.claude\projects\C--Users-91733-Documents-Testing-Academy-AI-AI-TesterBlueprint-2026-Project-21-ClaudeCodeMasterClass-Jun2026-SeleniumRepo\
```

Each line in a `.jsonl` file is one event (user message, assistant message, tool call,
etc.). The most recently modified files are the most recent sessions.

## Steps

1. List every `*.jsonl` file in the history folder above, sorted by last-modified time
   (newest first). Use Glob (it already sorts by modification time).
2. **Exclude the current session's transcript** (the file that is being written right
   now — it is the newest/active one). Take the next **three** files after it.
   - If fewer than three prior sessions exist, recap whatever is available and say so.
3. For each of those three transcripts, read it and extract:
   - The session's approximate date/time (from the first/last event timestamps).
   - What I (the user) asked for — the main goals in my own words.
   - What was actually done / decided / delivered.
   - Any unfinished or open items.
   - To stay within context, read selectively (first and last portions of large files)
     rather than dumping entire transcripts.

## Output format

Present newest → oldest, like:

```
## 1. <date/time> — <one-line title>
- **You asked:** ...
- **What happened:** ...
- **Open items:** ... (or "none")

## 2. <date/time> — <one-line title>
...

## 3. <date/time> — <one-line title>
...
```

Keep each recap to a few bullet points. Do not invent content — if a transcript is
empty or unreadable, say so and move to the next one.
