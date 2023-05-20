# Import necessary libraries
import json

# Read data.json
with open('data.json', 'r') as f:
    data = json.load(f)

# Initialize answers list
answers = []

# Loop through each item in data
for item in data:
    # Get the summary and answer
    summary = item['summary']
    answer = item['answer']
    
    # Use the answer to fill out the forms in forms.json
    with open('forms.json', 'r') as f:
        forms = json.load(f)
    
    for form in forms:
        for field in form['fields']:
            if field['question'] == item['question']:
                field['answer'] = answer
    
    # Append the answers to the answers list
    answers.append({'summary': summary, 'answer': answer, 'forms': forms})

# Write the answers to answers.json
with open('answers.json', 'w') as f:
    json.dump(answers, f, indent=4)