from autogpt import GPT
import read_file
data = read_file('data-content.txt')
question = read_file('question.txt')

agent = GPT()
answer = agent.summarize(data, question)

write_to_file('answers.txt', answer)