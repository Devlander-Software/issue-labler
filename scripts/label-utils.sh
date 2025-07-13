#!/usr/bin/env bash

# Label utility functions for testing
# These functions are extracted from the workflow for better testability

set -euo pipefail

# Source bats helpers if available
if [[ -f "${BATS_TEST_DIRNAME}/../../node_modules/.bats/bats-support/load.bash" ]]; then
  load "${BATS_TEST_DIRNAME}/../../node_modules/.bats/bats-support/load.bash"
  load "${BATS_TEST_DIRNAME}/../../node_modules/.bats/bats-assert/load.bash"
fi

# Validate label format
validate_label() {
  local name="$1"
  local color="$2"
  local description="$3"
  
  # Check if name is not empty
  if [[ -z "$name" ]]; then
    return 1
  fi
  
  # Check if color is valid hex
  if ! [[ "$color" =~ ^[0-9a-fA-F]{6}$ ]]; then
    return 1
  fi
  
  # Check if description is not too long (GitHub limit is 100 characters)
  if [[ ${#description} -gt 100 ]]; then
    return 1
  fi
  
  return 0
}

# Detect story points from text
detect_story_points() {
  local text="$1"
  local lower_text
  lower_text=$(echo "$text" | tr '[:upper:]' '[:lower:]')  # Convert to lowercase
  
  if [[ "$lower_text" =~ story[[:space:]]*points?[[:space:]]*:[[:space:]]*1 ]]; then
    echo "⏳ Story Points: 1"
  elif [[ "$lower_text" =~ story[[:space:]]*points?[[:space:]]*:[[:space:]]*2-3 ]]; then
    echo "⏳ Story Points: 2-3"
  elif [[ "$lower_text" =~ story[[:space:]]*points?[[:space:]]*:[[:space:]]*5 ]]; then
    echo "⏳ Story Points: 5"
  elif [[ "$lower_text" =~ story[[:space:]]*points?[[:space:]]*:[[:space:]]*8 ]]; then
    echo "⏳ Story Points: 8"
  elif [[ "$lower_text" =~ story[[:space:]]*points?[[:space:]]*:[[:space:]]*13([^0-9]|$) ]]; then
    echo "⏳ Story Points: 13"
  elif [[ "$lower_text" =~ story[[:space:]]*points?[[:space:]]*:[[:space:]]*20\+ ]]; then
    echo "⏳ Story Points: 20+"
  else
    echo ""
  fi
}

# Detect difficulty from text
detect_difficulty() {
  local text="$1"
  local lower_text
  lower_text=$(echo "$text" | tr '[:upper:]' '[:lower:]')  # Convert to lowercase
  
  if [[ "$lower_text" =~ difficulty[[:space:]]*:[[:space:]]*simple ]]; then
    echo "🌱 Difficulty: Simple"
  elif [[ "$lower_text" =~ difficulty[[:space:]]*:[[:space:]]*easy ]]; then
    echo "👍 Difficulty: Easy"
  elif [[ "$lower_text" =~ difficulty[[:space:]]*:[[:space:]]*moderate ]]; then
    echo "🛠️ Difficulty: Moderate"
  elif [[ "$lower_text" =~ difficulty[[:space:]]*:[[:space:]]*hard ]]; then
    echo "🔥 Difficulty: Hard"
  elif [[ "$lower_text" =~ difficulty[[:space:]]*:[[:space:]]*very[[:space:]]*hard ]]; then
    echo "🧠 Difficulty: Very Hard"
  elif [[ "$lower_text" =~ difficulty[[:space:]]*:[[:space:]]*epic ]]; then
    echo "⚫ Difficulty: Epic"
  else
    echo ""
  fi
}

# Detect priority from text
detect_priority() {
  local text="$1"
  local lower_text
  lower_text=$(echo "$text" | tr '[:upper:]' '[:lower:]')  # Convert to lowercase
  
  if [[ "$lower_text" =~ priority[[:space:]]*:[[:space:]]*critical ]]; then
    echo "🚨 Priority: Critical"
  elif [[ "$lower_text" =~ priority[[:space:]]*:[[:space:]]*high ]]; then
    echo "🚨 Priority: High"
  elif [[ "$lower_text" =~ priority[[:space:]]*:[[:space:]]*medium ]]; then
    echo "🚨 Priority: Medium"
  elif [[ "$lower_text" =~ priority[[:space:]]*:[[:space:]]*low ]]; then
    echo "🚨 Priority: Low"
  else
    echo ""
  fi
}

# Detect development area from text
detect_development_area() {
  local text="$1"
  local lower_text
  lower_text=$(echo "$text" | tr '[:upper:]' '[:lower:]')  # Convert to lowercase
  local areas
  areas=()
  
  # Frontend/Client Side
  if [[ "$lower_text" =~ (ui|ux|frontend|front-end|client[[:space:]]*side|react|vue|angular|component|button|form|layout|design|styling|css|html|javascript|js) ]]; then
    areas+=("🎨 Client Side")
  fi
  
  # Backend
  if [[ "$lower_text" =~ (api|backend|back-end|server|database|db|sql|nosql|authentication|auth|middleware|controller|service|model) ]]; then
    areas+=("🖥️ Backend")
  fi
  
  # Cloud Infrastructure
  if [[ "$lower_text" =~ (aws|ec2|s3|rds|lambda|cloud|infrastructure|deployment|terraform|kubernetes|docker|container) ]]; then
    areas+=("☁️ Cloud Infrastructure")
  fi
  
  # DevOps
  if [[ "$lower_text" =~ (ci|cd|pipeline|automation|deploy|devops|jenkins|github[[:space:]]*actions|docker|kubernetes|monitoring|logging) ]]; then
    areas+=("⚙️ DevOps")
  fi
  
  # Return array as space-separated string
  if [[ ${#areas[@]:-0} -gt 0 ]]; then
    printf '%s\n' "${areas[@]}"
  fi
}

# Parse checked checkboxes from markdown
parse_checked_checkboxes() {
  local text="$1"
  local labels
  labels=()
  
  # Story Points from checkboxes
  if [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Story[[:space:]]*Points:[[:space:]]*1\*\* ]]; then
    labels+=("⏳ Story Points: 1")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Story[[:space:]]*Points:[[:space:]]*2-3\*\* ]]; then
    labels+=("⏳ Story Points: 2-3")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Story[[:space:]]*Points:[[:space:]]*5\*\* ]]; then
    labels+=("⏳ Story Points: 5")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Story[[:space:]]*Points:[[:space:]]*8\*\* ]]; then
    labels+=("⏳ Story Points: 8")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Story[[:space:]]*Points:[[:space:]]*13\*\* ]]; then
    labels+=("⏳ Story Points: 13")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Story[[:space:]]*Points:[[:space:]]*20\+\*\* ]]; then
    labels+=("⏳ Story Points: 20+")
  fi
  
  # Difficulty from checkboxes
  if [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Difficulty:[[:space:]]*Simple\*\* ]]; then
    labels+=("🌱 Difficulty: Simple")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Difficulty:[[:space:]]*Easy\*\* ]]; then
    labels+=("👍 Difficulty: Easy")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Difficulty:[[:space:]]*Moderate\*\* ]]; then
    labels+=("🛠️ Difficulty: Moderate")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Difficulty:[[:space:]]*Hard\*\* ]]; then
    labels+=("🔥 Difficulty: Hard")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Difficulty:[[:space:]]*Very[[:space:]]*Hard\*\* ]]; then
    labels+=("🧠 Difficulty: Very Hard")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Difficulty:[[:space:]]*Epic\*\* ]]; then
    labels+=("⚫ Difficulty: Epic")
  fi
  
  # Priority from checkboxes
  if [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Priority:[[:space:]]*Critical\*\* ]]; then
    labels+=("🚨 Priority: Critical")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Priority:[[:space:]]*High\*\* ]]; then
    labels+=("🚨 Priority: High")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Priority:[[:space:]]*Medium\*\* ]]; then
    labels+=("🚨 Priority: Medium")
  elif [[ "$text" =~ -[[:space:]]*\[[xX]\][[:space:]]*\*\*Priority:[[:space:]]*Low\*\* ]]; then
    labels+=("🚨 Priority: Low")
  fi
  
  # Return array as space-separated string
  if [[ ${#labels[@]:-0} -gt 0 ]]; then
    printf '%s\n' "${labels[@]}"
  fi
}

# Main function to detect all labels
detect_all_labels() {
  local title="$1"
  local body="$2"
  local combined_text="$title $body"
  local labels
  labels=()
  
  # First check for checked checkboxes
  local checkbox_labels
  checkbox_labels=$(parse_checked_checkboxes "$body")
  if [[ -n "$checkbox_labels" ]]; then
    while IFS= read -r label; do
      if [[ -n "$label" ]]; then
        labels+=("$label")
      fi
    done <<< "$checkbox_labels"
  fi
  
  # If no checkboxes, fall back to keyword detection
  if [[ ${#labels[@]:-0} -eq 0 ]]; then
    # Story Points
    local story_points
    story_points=$(detect_story_points "$combined_text")
    if [[ -n "$story_points" ]]; then
      labels+=("$story_points")
    fi
    
    # Difficulty
    local difficulty
    difficulty=$(detect_difficulty "$combined_text")
    if [[ -n "$difficulty" ]]; then
      labels+=("$difficulty")
    fi
    
    # Priority
    local priority
    priority=$(detect_priority "$combined_text")
    if [[ -n "$priority" ]]; then
      labels+=("$priority")
    fi
    
    # Development areas
    local areas
    areas=$(detect_development_area "$combined_text")
    while IFS= read -r area; do
      if [[ -n "$area" ]]; then
        labels+=("$area")
      fi
    done <<< "$areas"
    
    # Issue types
    local lower_text
    lower_text=$(echo "$combined_text" | tr '[:upper:]' '[:lower:]')
    
    # Bug detection
    if [[ "$lower_text" =~ (bug|error|crash|broken|fix|issue|problem|fails|doesn\'t\s*work) ]]; then
      labels+=("🪲 Bug")
    fi
    
    # Feature detection
    if [[ "$lower_text" =~ (feature|enhancement|improvement|new|add|implement) ]]; then
      labels+=("✨ Feature")
    fi
    
    # Performance detection
    if [[ "$lower_text" =~ (performance|slow|speed|optimization|optimize|fast|latency|response\s*time) ]]; then
      labels+=("🚀 Performance")
    fi
    
    # Technical debt detection
    if [[ "$lower_text" =~ (technical\s*debt|refactor|cleanup|legacy|old\s*code|deprecated) ]]; then
      labels+=("📉 Technical Debt")
    fi
  fi
  
  # Remove duplicates and return
  if [[ ${#labels[@]:-0} -gt 0 ]]; then
    printf '%s\n' "${labels[@]}" | sort -u
  fi
} 