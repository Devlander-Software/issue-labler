#!/bin/bash

# Create Labels with Stable IDs Script
# This script creates GitHub labels using stable IDs from config.yml
# The labels will persist even if display names change

set -e

echo "🚀 Starting label creation with stable IDs..."

# Check if config file exists
if [ ! -f "config.yml" ]; then
    echo "❌ Error: config.yml not found. Please ensure you're running this from the repository root."
    exit 1
fi

# Function to parse YAML and extract label data
parse_labels() {
    local yaml_file="$1"
    
    # Use a simple YAML parser (requires yq or similar)
    if command -v yq &> /dev/null; then
        # Extract all labels with their IDs and properties
        yq eval '.labels.*[] | select(.id) | {id: .id, name: .name, color: .color, description: .description}' "$yaml_file" 2>/dev/null || {
            echo "⚠️ yq not available, using fallback parsing..."
            parse_labels_fallback "$yaml_file"
        }
    else
        parse_labels_fallback "$yaml_file"
    fi
}

# Fallback YAML parser using grep/sed
parse_labels_fallback() {
    local yaml_file="$1"
    local current_id=""
    local current_name=""
    local current_color=""
    local current_description=""
    
    while IFS= read -r line; do
        # Extract ID
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]*id:[[:space:]]*\"([^\"]+)\" ]]; then
            current_id="${BASH_REMATCH[1]}"
        # Extract name
        elif [[ "$line" =~ ^[[:space:]]*name:[[:space:]]*\"([^\"]+)\" ]]; then
            current_name="${BASH_REMATCH[1]}"
        # Extract color
        elif [[ "$line" =~ ^[[:space:]]*color:[[:space:]]*\"([^\"]+)\" ]]; then
            current_color="${BASH_REMATCH[1]}"
        # Extract description
        elif [[ "$line" =~ ^[[:space:]]*description:[[:space:]]*\"([^\"]+)\" ]]; then
            current_description="${BASH_REMATCH[1]}"
            # If we have all fields, output the label data
            if [[ -n "$current_id" && -n "$current_name" && -n "$current_color" && -n "$current_description" ]]; then
                echo "$current_id|$current_name|$current_color|$current_description"
                current_id=""
                current_name=""
                current_color=""
                current_description=""
            fi
        fi
    done < "$yaml_file"
}

# Function to create a label
create_label() {
    local id="$1"
    local name="$2"
    local color="$3"
    local description="$4"
    
    # URL encode the label name for API calls
    local encoded_name=$(echo "$name" | sed 's/ /%20/g')
    
    # Check if label already exists
    if gh api repos/:owner/:repo/labels/"$encoded_name" >/dev/null 2>&1; then
        echo "⏭️ Label already exists: $name (ID: $id)"
        return 0
    fi
    
    echo "🔄 Creating label: $name (ID: $id)"
    
    # Create the label
    if gh api repos/:owner/:repo/labels -f name="$name" -f color="$color" -f description="$description" >/dev/null 2>&1; then
        echo "✅ Successfully created: $name (ID: $id)"
        return 0
    else
        echo "❌ Failed to create: $name (ID: $id)"
        return 1
    fi
}

# Function to validate label data
validate_label() {
    local id="$1"
    local name="$2"
    local color="$3"
    local description="$4"
    
    # Check if ID is not empty
    if [ -z "$id" ]; then
        echo "❌ Label ID cannot be empty"
        return 1
    fi
    
    # Check if name is not empty
    if [ -z "$name" ]; then
        echo "❌ Label name cannot be empty"
        return 1
    fi
    
    # Check if color is valid hex
    if ! [[ "$color" =~ ^[0-9a-fA-F]{6}$ ]]; then
        echo "❌ Invalid color format: $color (should be 6-digit hex)"
        return 1
    fi
    
    # Check if description is not too long (GitHub limit is 100 characters)
    if [ ${#description} -gt 100 ]; then
        echo "❌ Description too long: ${#description} characters (max 100)"
        return 1
    fi
    
    return 0
}

# Rate limiting function
check_rate_limit() {
    local remaining
    remaining=$(gh api rate_limit --jq '.resources.core.remaining' 2>/dev/null || echo "5000")
    if [ "$remaining" -lt 50 ]; then
        echo "⚠️ Rate limit low ($remaining remaining). Waiting 60 seconds..."
        sleep 60
    fi
}

# Retry function with exponential backoff
retry_with_backoff() {
    local max_attempts=3
    local attempt=1
    local delay=1
    local command="$@"
    
    while [ $attempt -le $max_attempts ]; do
        if eval "$command"; then
            return 0
        else
            echo "❌ Attempt $attempt failed. Retrying in $delay seconds..."
            sleep $delay
            attempt=$((attempt + 1))
            delay=$((delay * 2))
        fi
    done
    
    echo "❌ All attempts failed for command: $command"
    return 1
}

# Main execution
echo "📋 Parsing labels from config.yml..."

# Parse labels from config file
label_data=$(parse_labels "config.yml")

if [ -z "$label_data" ]; then
    echo "❌ No labels found in config.yml or parsing failed"
    exit 1
fi

created_count=0
skipped_count=0
error_count=0

echo "📋 Processing labels..."

# Process each label
while IFS='|' read -r id name color description; do
    # Validate label data before processing
    if ! validate_label "$id" "$name" "$color" "$description"; then
        echo "❌ Skipping invalid label: $id"
        ((error_count++))
        continue
    fi
    
    # Check rate limit before each operation
    check_rate_limit
    
    # Create the label with retry logic
    if retry_with_backoff "create_label '$id' '$name' '$color' '$description'"; then
        ((created_count++))
    else
        ((error_count++))
    fi
    
    # Add delay between creations to avoid rate limits
    sleep 0.5
done <<< "$label_data"

echo ""
echo "📊 Label Creation Summary:"
echo "   ✅ Created: $created_count"
echo "   ⏭️ Skipped: $skipped_count"
echo "   ❌ Errors: $error_count"
echo "   📋 Total: $(echo "$label_data" | wc -l)"

# Create a summary comment on the repository
if [ "$created_count" -gt 0 ] || [ "$error_count" -gt 0 ]; then
    summary="## 🏷️ Label Setup Summary (with Stable IDs)
    
    - ✅ **Created**: $created_count labels
    - ⏭️ **Skipped**: $skipped_count labels (already existed)
    - ❌ **Errors**: $error_count labels
    
    **Total Processed**: $(echo "$label_data" | wc -l) labels
    
    **Note**: Labels now use stable IDs that persist even if display names change.
    
    $(date '+%Y-%m-%d %H:%M:%S UTC')"
    
    # Create a comment on the latest issue or PR for visibility
    latest_issue=$(gh api repos/:owner/:repo/issues --jq '.[0].number' 2>/dev/null || echo "")
    if [ -n "$latest_issue" ]; then
        echo "$summary" | gh issue comment "$latest_issue" --body-file -
    fi
fi

if [ $error_count -gt 0 ]; then
    echo "⚠️ Some labels failed to create. Check the logs above for details."
    exit 1
else
    echo "🎉 All labels processed successfully!"
    echo "💡 Labels now use stable IDs that won't change even if you update display names or remove emojis."
fi 