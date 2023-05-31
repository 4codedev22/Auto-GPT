import torch
from transformers import GPT2Model, GPT2Tokenizer

model = GPT2Model.from_pretrained('gpt2')
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')

def generate_text_embedding(text):
    encoded_text = tokenizer.encode(text)
    input_ids = torch.tensor(encoded_text).unsqueeze(0)
    outputs = model(input_ids)
    text_embedding = outputs[0][0]
    torch.save(text_embedding, 'text_embedding.pt')
