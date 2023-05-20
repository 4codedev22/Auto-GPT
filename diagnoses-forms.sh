#!/bin/bash
input=$(cat <<EOL
{
  "cnpj": {
    "question": "What is the CNPJ of the accounting firm?",
    "value": ""
  },
  "owners": {
    "question": "Who are the owners of the accounting firm?",
    "value": [
        {
            "name": "",
            "email": "",
            "phone": ""
        }
    ]
  }
}
EOL
)

# Create General Information Form
general_info=$(cat <<EOL
{
  "name": {
    "question": "What is the full name of the accounting firm?",
    "value": ""
  },
  "location": {
    "question": "What is the main location of the accounting firm?",
    "value": ""
  },
  "existence": {
    "question": "How long has the accounting firm been in operation?",
    "value": ""
  },
  "services_description": {
    "question": "What are the main services offered by the accounting firm?",
    "value": ""
  },
  "team_size": {
    "question": "How many employees work in the accounting department?",
    "value": ""
  },
  "main_clients": {
    "question": "Who are the main clients of the accounting firm?",
    "value": ""
  },
  "organizational_structure": {
    "question": "Describe the hierarchical structure and existing departments in the accounting firm.",
    "value": ""
  }
}
EOL
)

# Create Human Resources Form
human_resources=$(cat <<EOL
{
  "total_employees": {
    "question": "How many employees does the firm currently have?",
    "value": ""
  },
  "key_employees_qualifications": {
    "question": "What are the qualifications and experiences of key employees in the accounting team?",
    "value": []
  },
  "departments_functions": {
    "question": "What are the main departments and their functions within the accounting firm?",
    "value": {}
  },
  "training_programs": {
    "question": "Does the firm offer training and development programs for employees? If yes, please specify.",
    "value": false
  },
  "recruitment_selection_processes": {
    "question": "What processes does the firm follow to recruit and select new employees for the accounting team?",
    "value": ""
  }
}
EOL
)

# Create Operations and Internal Processes Form
operations_processes=$(cat <<EOL
{
  "internal_processes_description": {
    "question": "Describe the main internal processes carried out by the accounting team.",
    "value": ""
  },
  "tools_technologies_accounting_processes": {
    "question": "What are the main tools and technologies used in the accounting processes?",
    "value": []
  },
  "internal_controls_data_accuracy_safety": {
    "question": "What internal controls are in place to ensure data accuracy and safety in the accounting processes?",
    "value": {}
  },
  "workflow_data_entry_service_delivery": {
    "question": "Describe the workflow followed by the firm, from data entry to service delivery to clients.",
    "value": ""
  },
  "main_internal_challenges": {
    "question": "What are the main challenges or bottlenecks faced in the internal processes of the accounting firm?",
    "value": []
  }
}
EOL
)

# Create Financial Analysis Form
financial_analysis=$(cat <<EOL
{
  "annual_revenue": {
    "question": "What is the annual revenue of the accounting firm?",
    "value": ""
  },
  "cost_structure": {
    "question": "What are the main operating expenses and cost structure of the firm?",
    "value": {}
  },
  "profitability_margin": {
    "question": "What is the profitability and profit margin of the accounting firm?",
    "value": {}
  },
  "cash_flow_working_capital_management": {
    "question": "How is the cash flow of the firm, and how is working capital management performed?",
    "value": {}
  },
  "recent_investments": {
    "question": "Has the firm made any recent investments in technology or accounting infrastructure?",
    "value": ""
  }
}
EOL
)

# Create Market and Competition Analysis Form
market_analysis=$(cat <<EOL
{
  "target_market_description": {
    "question": "Who is the primary target market of the accounting firm?",
    "value": ""
  },
  "main_competitors_market_share": {
    "question": "Who are the main competitors of the accounting firm and what is their market share?",
    "value": []
  },
  "recent_trends_accounting_industry": {
    "question": "What are the recent trends in the accounting industry that may affect the firm?",
    "value": []
  },
  "relevant_regulatory_changes": {
    "question": "Have there been any relevant regulatory changes in the accounting sector? If yes, please specify.",
    "value": ""
  },
  "growth_diversification_opportunities": {
    "question": "Are there any opportunities for growth or diversification of accounting services that the firm can leverage?",
    "value": ""
  }
}
EOL
)

# Write forms to a single file forms.json
echo "Writing forms to file..."

cat <<EOF > autogpt_$1/forms.json
{
  "url":"$2",
  "input": $input,
  "general_info": $general_info,
  "human_resources": $human_resources,
  "operations_processes": $operations_processes,
  "financial_analysis": $financial_analysis,
  "market_analysis": $market_analysis
}
EOF
echo "Forms created successfully!"

# create a list of questions from the forms
echo "Creating list of questions..."
touch autogpt_$1/questions.txt
jq -r '.general_info | .[] | .question' autogpt_$1/forms.json >> autogpt_$1/questions.txt
jq -r '.human_resources | .[] | .question' autogpt_$1/forms.json >> autogpt_$1/questions.txt
jq -r '.operations_processes | .[] | .question' autogpt_$1/forms.json >> autogpt_$1/questions.txt
jq -r '.financial_analysis | .[] | .question' autogpt_$1/forms.json >> autogpt_$1/questions.txt
jq -r '.market_analysis | .[] | .question' autogpt_$1/forms.json >> autogpt_$1/questions.txt
echo "Questions created successfully!"