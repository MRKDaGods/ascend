# !/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
PACKAGE_ROOT=$(dirname "$SCRIPT_DIR")

# Ensure that we're in root
cd "$PACKAGE_ROOT" || {
    echo "Failed to navigate to package root"
    exit 1
}

echo "Working directory: $(pwd)"

SHARED_DIR="../shared/src/models"
OUTPUT_DIR="src/models"

# Ensure directory exists
mkdir -p "$OUTPUT_DIR"

convert_type() {
    local type=$1
    local rust_type=""

    # Union Types: "STR" | "STR"
    if [[ $type =~ [\"\'][a-zA-Z0-9_]+[\"\']([[:space:]]*\|[[:space:]]*[\"\'][a-zA-Z0-9_]+[\"\'])+ ]]; then
        rust_type="String /* Union type: $type */"
    # Union types: general
    elif [[ $type =~ \| ]]; then
        rust_type="String /* Union type: $type */"
    # 'any'
    elif [[ $type =~ ^[[:space:]]*any[[:space:]]*$ ]]; then
        rust_type="serde_json::Value"
    # Date
    elif [[ $type =~ ^[[:space:]]*Date[[:space:]]*$ ]]; then
        # Convert Date to chrono::DateTime<Utc>
        rust_type="chrono::DateTime<chrono::Utc>"
    else
        # TS to Rust type conversion
        rust_type=$(echo "$type" |
            sed -E 's/string/String/g' |
            sed -E 's/number/i32/g' |
            sed -E 's/boolean/bool/g' |
            sed -E 's/Date/chrono::DateTime<chrono::Utc>/g')

        # Convert array to Vec
        if [[ $rust_type =~ (.*)\[\] ]]; then
            element_type="${BASH_REMATCH[1]}"

            # Convert the element type if needed
            local converted_element_type=""
            converted_element_type=$(convert_type "$element_type")
            
            rust_type="Vec<$converted_element_type>"
        fi
    fi

    echo "$rust_type"
}

ts_to_rust() {
    local input_file=$1
    local output_file=$2

    echo "Converting $input_file -> $output_file"

    # Create output file with header
    echo "// Auto-generated from TypeScript definitions" >"$output_file"
    echo "" >>"$output_file"
    echo "" >>"$output_file"
    while IFS= read -r line; do
        # Check for export enum
        if [[ $line =~ ^export[[:space:]]+enum[[:space:]]+([a-zA-Z0-9_]+) ]]; then
            enum_name="${BASH_REMATCH[1]}"
            echo "#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]" >>"$output_file"
            echo "pub enum $enum_name {" >>"$output_file"

            # Process enum values
            inside_enum=true
            continue
        fi

        # Check for export interface/type
        if [[ $line =~ ^export[[:space:]]+(interface|type)[[:space:]]+([a-zA-Z0-9_]+)(.*)$ ]]; then
            interface_name="${BASH_REMATCH[2]}"
            rest_of_line="${BASH_REMATCH[3]}"
            
            # Check if the interface has the REF annotation
            all_fields_optional=false
            if [[ $rest_of_line =~ \/\*[[:space:]]*MRK_ATTR_REF[[:space:]]*\*\/ ]]; then
                all_fields_optional=true
                echo "// All fields optional due to REF annotation" >>"$output_file"
            fi
            
            echo "#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]" >>"$output_file"
            echo "pub struct $interface_name {" >>"$output_file"

            inside_interface=true
            continue
        fi

        # Process enum values
        if [[ $inside_enum == true ]]; then
            if [[ $line == "}" ]]; then
                echo "}" >>"$output_file"
                echo "" >>"$output_file"

                inside_enum=false
                continue
            fi

            # Extract enum value & initializer
            if [[ $line =~ ([a-zA-Z0-9_]+)[[:space:]]*=[[:space:]]*([^,]*), ]]; then
                enum_key="${BASH_REMATCH[1]}"
                enum_value="${BASH_REMATCH[2]}"

                # String values
                if [[ $enum_value =~ ^[\"\'](.*)[\"\']$ ]]; then
                    string_value="${BASH_REMATCH[1]}"
                    echo "    #[serde(rename = \"$string_value\")]" >>"$output_file"
                    echo "    $enum_key," >>"$output_file"
                # Integral values
                elif [[ $enum_value =~ ^[0-9]+$ ]]; then
                    echo "    #[serde(rename = $enum_value)]" >>"$output_file"
                    echo "    $enum_key," >>"$output_file"
                else
                    echo "    $enum_key, // = $enum_value" >>"$output_file"
                fi
            # Plain enum values without initializers
            elif [[ $line =~ ^[[:space:]]*([a-zA-Z0-9_]+)[[:space:]]*,$ ]]; then
                enum_key="${BASH_REMATCH[1]}"
                echo "    $enum_key," >>"$output_file"
            fi
        fi

        # Process interface fields
        if [[ $inside_interface == true ]]; then
            if [[ $line == "}" ]]; then
                echo "}" >>"$output_file"
                echo "" >>"$output_file"

                inside_interface=false
                continue
            fi

            # Extract field and type
            if [[ $line =~ ([a-zA-Z0-9_]+)(\?)?:[[:space:]]*([^;]*) ]]; then
                field="${BASH_REMATCH[1]}"
                is_optional="${BASH_REMATCH[2]}"
                type="${BASH_REMATCH[3]}"

                # Handle reserved keywords
                reserved_keywords=("type" "self" "loop" "in" "for" "while" "if" "else" "match" "impl" "true" "false"
                    "fn" "struct" "enum" "mod" "use" "pub" "where" "as" "break" "const" "continue"
                    "crate" "dyn" "extern" "let" "move" "ref" "return" "static" "super" "trait"
                    "unsafe" "async" "await" "try")

                for keyword in "${reserved_keywords[@]}"; do
                    if [[ "$field" == "$keyword" ]]; then
                        field="${field}_"
                        break
                    fi
                done

                # Convert the type
                rust_type=$(convert_type "$type")

                # Check if field is optional or if all fields should be optional
                if [[ -n "$is_optional" || "$all_fields_optional" == true ]]; then
                    echo "    pub $field: Option<$rust_type>," >>"$output_file"
                else
                    echo "    pub $field: $rust_type," >>"$output_file"
                fi
            fi
        fi
    done <"$input_file"

    echo "Conversion completed: $output_file"
}

# Find all model files
echo "Finding TypeScript models in $SHARED_DIR"
find "$SHARED_DIR" -name "*.ts" | while read -r file; do
    # Get relative path and create output file path
    rel_path=${file#$SHARED_DIR/}
    output_file="$OUTPUT_DIR/${rel_path%.ts}.rs"

    # Create output directory if needed
    mkdir -p "$(dirname "$output_file")"

    # Convert the file
    ts_to_rust "$file" "$output_file"
done

# Generate mod.rs
echo "Generating mod.rs in $OUTPUT_DIR"
{
    echo "// Auto-generated mod.rs"
    echo ""

    find "$OUTPUT_DIR" -name "*.rs" | while read -r file; do
        rel_path=${file#$OUTPUT_DIR/}

        # Skip the mod.rs file itself
        if [[ "$rel_path" == "mod.rs" ]]; then
            continue
        fi

        echo "pub mod ${rel_path%.rs};"
    done

} >"$OUTPUT_DIR/mod.rs"
echo "Generated mod.rs in $OUTPUT_DIR"

echo "Model generation complete!"
