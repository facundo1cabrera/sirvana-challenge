## Getting Started

This is a simplified clone of Perplexity. You can visit a live demo at ###url demo###.

The challenges of this project were:
1) Streaming the response of the OpenAPI call to the frontend.
2) Providing the user prompt with specific context, if possible, from the MongoDB database.

### Architecture Diagram
![image](https://github.com/facundo1cabrera/sirvana-challenge/assets/83284235/7a167c88-e7f1-4dd5-b958-9892e3927b5b)

### Installation

1. Clone the repository

2. Run the command:
    ```bash
    npm install
    ```

3. Rename the `.env.example` file to `.env` and add your OpenAI API key. (You can rename the `mongoUri` if you want to use a specific Mongo instance; otherwise, the current URI points to a Dockerized Mongo instance.)

4. Run the command:
    ```bash
    docker compose up -d
    ```

Now you can make a POST request to `$BASE_URL/api/products` to add custom context for the OpenAI calls. The body of the request should look like this:
```json
{
    "productId": "red-apple",
    "content": "This product is the biggest red apple in America!"
}
```

Interact with the UI to get enriched OpenAI responses based on the context previously set.


