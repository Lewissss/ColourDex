#!/usr/bin/env bash
# Run locally after gh auth login with admin access to Lewissss/ColourDex.
set -euo pipefail
repo='Lewissss/ColourDex'
cd "$(dirname "$0")/.."
gh api "repos/$repo/branches/main" >/dev/null || { echo 'Create the initial README on main first; this script never commits to main.' >&2; exit 1; }
gh api --method PATCH "repos/$repo" -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false -F delete_branch_on_merge=true -F allow_auto_merge=false >/dev/null
gh api --method PUT "repos/$repo/branches/main/protection" --input scripts/main-protection.json >/dev/null
gh api --method PUT "repos/$repo/actions/permissions" -F enabled=true -f allowed_actions=all >/dev/null
gh api --method PUT "repos/$repo/actions/permissions/workflow" -f default_workflow_permissions=read -F can_approve_pull_request_reviews=false >/dev/null
gh api "repos/$repo/branches/main/protection"
gh api "repos/$repo/actions/permissions/workflow"
printf 'Main requires PRs, the content check, up-to-date branches and resolved conversations; force pushes and deletion are blocked.\n'
