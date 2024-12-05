![CS Agent](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ffch3ghnwz7julo5ui856.png)
*This is a submission for the [Open Source AI Challenge with pgai and Ollama ](https://dev.to/challenges/pgai)*

## What I Built
I created a customer support RAG assistant.
1. User request for is submitted (e.g. 'having trouble with XYZ')
2. Semantic search is performed to look for similar tickets in DB
3. Prompt to LLM includes user query and similar tickets retrieved
4. Server returns suggested response to user

## Demo
https://bit.ly/4flG7xI

![MS Office issue](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p0lcqb2aipqyybuasn9x.png)

## Tools Used
### pgvector
Signed up for TimescaleDB service to create a PostgreSQL instance with vector capabilities using pgvector.
### Timescale CSV import
Used [this](https://www.kaggle.com/datasets/tobiasbueck/multilingual-customer-support-tickets) dataset from Kaggle with ~600 customer support tickets.
### pgai Vectorizer / Open AI API
Created a vectorizer to create vector embeddings of users requests (email body column).
### gpt-3.5-turbo
Server calls gpt-3.5-turbo completions API to compose suggested response to user based on their query and similar tickets found.

## Source Code
- [Server App](https://github.com/kobtze/cs-rag-server-web-app)
- [Client Web App](https://github.com/kobtze/cs-rag-client-web-app)

## Final Thoughts
### Prize categories
Vectorizer Vibe😃
