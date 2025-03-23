#!/usr/bin/env bash

# Set your GitHub repository (update this!)
REPO="hive-helsinki-projects/ft_transcendence"

# Set Milestones
MILESTONE1="Project Setup & Environment"
MILESTONE2="Core Features: Pong Game"
MILESTONE3="Frontend Development"
MILESTONE4="Backend & Database Integration"
MILESTONE5="Multiplayer & Matchmaking"
MILESTONE6="Security & Authentication"
MILESTONE7="Accessibility & UI Optimization"
MILESTONE8="Final Testing & Submission"

# Set due dates (7, 14, 21, 28 days from now)
ONE_WEEK_LATER=$(date -v+7d +'%Y-%m-%dT%H:%M:%SZ')
TWO_WEEKS_LATER=$(date -v+14d +'%Y-%m-%dT%H:%M:%SZ')
THREE_WEEKS_LATER=$(date -v+21d +'%Y-%m-%dT%H:%M:%SZ')
FOUR_WEEKS_LATER=$(date -v+28d +'%Y-%m-%dT%H:%M:%SZ')
FIVE_WEEKS_LATER=$(date -v+35d +'%Y-%m-%dT%H:%M:%SZ')
SIX_WEEKS_LATER=$(date -v+42d +'%Y-%m-%dT%H:%M:%SZ')
SEVEN_WEEKS_LATER=$(date -v+49d +'%Y-%m-%dT%H:%M:%SZ')
EIGHT_WEEKS_LATER=$(date -v+56d +'%Y-%m-%dT%H:%M:%SZ')

# Authenticate if needed
gh auth status || gh auth login

# Delete all milestones
gh api repos/$REPO/milestones --jq '.[].number' | xargs -I {} gh api repos/$REPO/milestones/{} -X DELETE

# Delete all issues
gh issue list --repo "$REPO" --state all --json number --jq '.[].number' | xargs -I {} gh issue delete {} --repo "$REPO"

# Function to check if a milestone exists
milestone_exists() {
    local TITLE="$1"
    local RESULT=$(gh api repos/$REPO/milestones --jq ".[] | select(.title==\"$TITLE\")")
    echo "Checking milestone: $TITLE"
    echo "Result: $RESULT"
    [ -n "$RESULT" ]
}

# Function to create milestones only if they don't exist
create_milestone() {
    local TITLE="$1"
    local DESC="$2"
    local DUE_DATE="$3"

    if milestone_exists "$TITLE"; then
        echo "⚠️ Milestone already exists: $TITLE"
    else
        gh api repos/$REPO/milestones -f title="$TITLE" -f description="$DESC" -f due_on="$DUE_DATE" -f state=open
        echo "✅ Created Milestone: $TITLE (Due: $DUE_DATE)"
    fi
}

# Create milestones with due dates (macOS `date -v` format)
create_milestone "$MILESTONE1" "Repo, project board, Docker, HTTPS, Fastify setup." "$ONE_WEEK_LATER"
create_milestone "$MILESTONE2" "Pong mechanics, same keyboard multiplayer." "$TWO_WEEKS_LATER"
create_milestone "$MILESTONE3" "UI with Tailwind CSS, TypeScript SPA, Firefox Support." "$THREE_WEEKS_LATER"
create_milestone "$MILESTONE4" "Fastify with Node.js, SQLite, User Input Validation." "$FOUR_WEEKS_LATER"
create_milestone "$MILESTONE5" "Remote Multiplayer, Tournament System, AI Opponent." "$FIVE_WEEKS_LATER"
create_milestone "$MILESTONE6" "SQL Injection Prevention, XSS, HTTPS, JWT (if used)." "$SIX_WEEKS_LATER"
create_milestone "$MILESTONE7" "Expand browser support, multilingual support, and UI improvements." "$SEVEN_WEEKS_LATER"
create_milestone "$MILESTONE8" "Final testing, security reviews, and submission." "$EIGHT_WEEKS_LATER"

echo "✅ All milestones checked/created."

# Function to check if an issue exists
issue_exists() {
    local TITLE="$1"
    local RESULT=$(gh issue list --repo "$REPO" --state "open" --json title --jq ".[] | select(.title==\"$TITLE\")")
    echo "Checking issue: $TITLE"
    echo "Result: $RESULT"
    [ -n "$RESULT" ]
}

# Function to create issues only if they don't exist
create_issue() {
    local TITLE="$1"
    local BODY="$2"
    local MILESTONE="$3"
    local STATUS="$4"

    if issue_exists "$TITLE"; then
        echo "⚠️ Issue already exists: $TITLE"
    else
        if [ "$STATUS" == "draft" ]; then
            gh issue create --repo "$REPO" --title "$TITLE" --body "$BODY" --milestone "$MILESTONE" --draft
            echo "✅ Created Draft Issue: $TITLE (Milestone: $MILESTONE)"
        else
            gh issue create --repo "$REPO" --title "$TITLE" --body "$BODY" --milestone "$MILESTONE"
            echo "✅ Created Issue: $TITLE (Milestone: $MILESTONE)"
        fi
    fi
}

# Create GitHub issues
create_issue "Setup Git Repo & Project Board" "Set up GitHub repository and project board." "$MILESTONE1" "open"
create_issue "Setup Docker & HTTPS" "Set up Docker and HTTPS for the project." "$MILESTONE1" "open"
create_issue "Setup Fastify" "Set up Fastify for the backend." "$MILESTONE1" "open"


echo "✅ All issues checked/created."
echo "🎯 GitHub setup complete!"