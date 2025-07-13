#!/usr/bin/env bats

# Load the script under test
load "${BATS_TEST_DIRNAME}/../../scripts/label-utils.sh"

@test "validate_label should accept valid label" {
  run validate_label "Bug" "ff0000" "Something is broken"
  [ "$status" -eq 0 ]
}

@test "validate_label should reject empty name" {
  run validate_label "" "ff0000" "Description"
  [ "$status" -eq 1 ]
}

@test "validate_label should reject invalid color format" {
  run validate_label "Bug" "red" "Description"
  [ "$status" -eq 1 ]
  
  run validate_label "Bug" "ff00" "Description"
  [ "$status" -eq 1 ]
  
  run validate_label "Bug" "ff00000" "Description"
  [ "$status" -eq 1 ]
}

@test "validate_label should reject description too long" {
  local long_description
  long_description=$(printf 'A%.0s' {1..101})
  run validate_label "Bug" "ff0000" "$long_description"
  [ "$status" -eq 1 ]
}

@test "validate_label should accept description at max length" {
  local max_description
  max_description=$(printf 'A%.0s' {1..100})
  run validate_label "Bug" "ff0000" "$max_description"
  [ "$status" -eq 0 ]
}

@test "detect_story_points should detect story points: 1" {
  result=$(detect_story_points "Story Points: 1 - Simple task")
  [ "$result" = "⏳ Story Points: 1" ]
}

@test "detect_story_points should detect story points: 2-3" {
  result=$(detect_story_points "Story Points: 2-3 - Medium task")
  [ "$result" = "⏳ Story Points: 2-3" ]
}

@test "detect_story_points should detect story points: 5" {
  result=$(detect_story_points "Story Points: 5 - Complex task")
  [ "$result" = "⏳ Story Points: 5" ]
}

@test "detect_story_points should detect story points: 8" {
  result=$(detect_story_points "Story Points: 8 - Large task")
  [ "$result" = "⏳ Story Points: 8" ]
}

@test "detect_story_points should detect story points: 13" {
  result=$(detect_story_points "Story Points: 13 - Epic task")
  [ "$result" = "⏳ Story Points: 13" ]
}

@test "detect_story_points should detect story points: 20+" {
  result=$(detect_story_points "Story Points: 20+ - Massive task")
  [ "$result" = "⏳ Story Points: 20+" ]
}

@test "detect_story_points should return empty for no story points" {
  result=$(detect_story_points "Just a regular issue")
  [ "$result" = "" ]
}

@test "detect_story_points should be case insensitive" {
  result=$(detect_story_points "STORY POINTS: 1 - Simple task")
  [ "$result" = "⏳ Story Points: 1" ]
}

@test "detect_difficulty should detect simple difficulty" {
  result=$(detect_difficulty "Difficulty: Simple - Easy fix")
  [ "$result" = "🌱 Difficulty: Simple" ]
}

@test "detect_difficulty should detect easy difficulty" {
  result=$(detect_difficulty "Difficulty: Easy - Straightforward")
  [ "$result" = "👍 Difficulty: Easy" ]
}

@test "detect_difficulty should detect moderate difficulty" {
  result=$(detect_difficulty "Difficulty: Moderate - Some complexity")
  [ "$result" = "🛠️ Difficulty: Moderate" ]
}

@test "detect_difficulty should detect hard difficulty" {
  result=$(detect_difficulty "Difficulty: Hard - Complex implementation")
  [ "$result" = "🔥 Difficulty: Hard" ]
}

@test "detect_difficulty should detect very hard difficulty" {
  result=$(detect_difficulty "Difficulty: Very Hard - Extremely complex")
  [ "$result" = "🧠 Difficulty: Very Hard" ]
}

@test "detect_difficulty should detect epic difficulty" {
  result=$(detect_difficulty "Difficulty: Epic - Massive undertaking")
  [ "$result" = "⚫ Difficulty: Epic" ]
}

@test "detect_difficulty should return empty for no difficulty" {
  result=$(detect_difficulty "Just a regular issue")
  [ "$result" = "" ]
}

@test "detect_priority should detect critical priority" {
  result=$(detect_priority "Priority: Critical - Security issue")
  [ "$result" = "🚨 Priority: Critical" ]
}

@test "detect_priority should detect high priority" {
  result=$(detect_priority "Priority: High - Important feature")
  [ "$result" = "🚨 Priority: High" ]
}

@test "detect_priority should detect medium priority" {
  result=$(detect_priority "Priority: Medium - Nice to have")
  [ "$result" = "🚨 Priority: Medium" ]
}

@test "detect_priority should detect low priority" {
  result=$(detect_priority "Priority: Low - Cosmetic change")
  [ "$result" = "🚨 Priority: Low" ]
}

@test "detect_priority should return empty for no priority" {
  result=$(detect_priority "Just a regular issue")
  [ "$result" = "" ]
}

@test "detect_development_area should detect frontend" {
  result=$(detect_development_area "Need to fix the React component styling")
  echo "$result" | grep -q "🎨 Client Side"
}

@test "detect_development_area should detect backend" {
  result=$(detect_development_area "The API endpoint is returning 500 errors")
  echo "$result" | grep -q "🖥️ Backend"
}

@test "detect_development_area should detect cloud infrastructure" {
  result=$(detect_development_area "Need to set up AWS EC2 instances")
  echo "$result" | grep -q "☁️ Cloud Infrastructure"
}

@test "detect_development_area should detect devops" {
  result=$(detect_development_area "Set up CI/CD pipeline with GitHub Actions")
  echo "$result" | grep -q "⚙️ DevOps"
}

@test "detect_development_area should detect multiple areas" {
  result=$(detect_development_area "Need to update React component and API endpoint, then deploy with Docker")
  echo "$result" | grep -q "🎨 Client Side"
  echo "$result" | grep -q "🖥️ Backend"
  echo "$result" | grep -q "⚙️ DevOps"
}

@test "parse_checked_checkboxes should detect story points checkbox" {
  local body="- [x] **Story Points: 5**"
  result=$(parse_checked_checkboxes "$body")
  echo "$result" | grep -q "⏳ Story Points: 5"
}

@test "parse_checked_checkboxes should detect difficulty checkbox" {
  local body="- [X] **Difficulty: Hard**"
  result=$(parse_checked_checkboxes "$body")
  echo "$result" | grep -q "🔥 Difficulty: Hard"
}

@test "parse_checked_checkboxes should detect priority checkbox" {
  local body="- [x] **Priority: High**"
  result=$(parse_checked_checkboxes "$body")
  echo "$result" | grep -q "🚨 Priority: High"
}

@test "parse_checked_checkboxes should detect multiple checkboxes" {
  local body="- [x] **Story Points: 5**
- [X] **Difficulty: Hard**
- [x] **Priority: High**"
  result=$(parse_checked_checkboxes "$body")
  echo "$result" | grep -q "⏳ Story Points: 5"
  echo "$result" | grep -q "🔥 Difficulty: Hard"
  echo "$result" | grep -q "🚨 Priority: High"
}

@test "parse_checked_checkboxes should ignore unchecked boxes" {
  local body="- [ ] **Story Points: 5**
- [x] **Difficulty: Hard**"
  result=$(parse_checked_checkboxes "$body")
  echo "$result" | grep -v "⏳ Story Points: 5"
  echo "$result" | grep -q "🔥 Difficulty: Hard"
}

@test "detect_all_labels should detect labels from checkboxes" {
  local title="Bug fix"
  local body="- [x] **Story Points: 5**
- [X] **Difficulty: Hard**"
  
  result=$(detect_all_labels "$title" "$body")
  echo "$result" | grep -q "⏳ Story Points: 5"
  echo "$result" | grep -q "🔥 Difficulty: Hard"
}

@test "detect_all_labels should fall back to keyword detection" {
  local title="Bug fix"
  local body="This is a bug that needs fixing"
  
  result=$(detect_all_labels "$title" "$body")
  echo "$result" | grep -q "🪲 Bug"
}

@test "detect_all_labels should remove duplicates" {
  local title="Frontend bug with React components"
  local body="The UI components are broken. Need to fix the frontend code and update the CSS styling."
  
  result=$(detect_all_labels "$title" "$body")
  local client_side_count=$(echo "$result" | grep -c "🎨 Client Side" || echo "0")
  [ "$client_side_count" -eq 1 ]
}

@test "detect_all_labels should handle empty input" {
  result=$(detect_all_labels "" "")
  [ "$result" = "" ]
}

@test "detect_all_labels should handle case insensitive keywords" {
  local title="BUG: login fails"
  local body="PRIORITY: HIGH. STORY POINTS: 1. DIFFICULTY: EASY."
  
  result=$(detect_all_labels "$title" "$body")
  echo "$result" | grep -q "🪲 Bug"
  echo "$result" | grep -q "🚨 Priority: High"
  echo "$result" | grep -q "⏳ Story Points: 1"
  echo "$result" | grep -q "👍 Difficulty: Easy"
} 