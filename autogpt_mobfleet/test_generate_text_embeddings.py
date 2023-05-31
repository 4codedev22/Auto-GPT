import torch
from generate_text_embeddings import generate_text_embedding

def test_generate_text_embedding():
    test_text = 'Hello, how are you?'
    expected_embedding = torch.load('test_text_embedding.pt')
    generated_embedding = generate_text_embedding(test_text)
    assert torch.allclose(generated_embedding, expected_embedding), 'Test failed.'
    print('Test passed.')
