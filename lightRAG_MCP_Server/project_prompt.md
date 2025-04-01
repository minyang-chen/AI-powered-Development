Reference: https://www.aivi.fyi/aiagents/using-WindSurf-to-Create-MCP-Server-for-LightRAG

# Requirements for LighRAG MCP Server

I want to develop a Build an MCP server for the LightRAG.

This server should allow me to input any query text and perform search operations using four distinct MCP Tools: naive search, local search, global search, and hybrid search.

Project requirements are as follows: 

## 1. Functional Overview 

Create a LightRAG MCP Server that allows users to perform Multiple Query Modes:

- Naive Search: Perform a straightforward search over the inserted content.
- Local Search: Focus on retrieving results within a limited, local context of the inserted documents.
- Global Search: Conduct a comprehensive search across the entire dataset.
- Hybrid Search: Combine aspects of local and global searches to enhance result relevance and consistency.

The WORKING_DIR path is /home/pop/hosting/vibe_coding/agentui/mcp_server

## 2. Prepare Virtual Environment 

- Create a python virtual environment on this directory: /home/pop/hosting/vibe_coding/agentui/mcp_server
- Run command "python -m venv .venv"
- Run command "source .venv/bin/activate"
- Run command "pip install lightrag-hku" 
- Run command "pip install "lightrag-hku[api]"
- Run command "pip install "mcp[cli]"
- Run command "pip install "pandas"
- Run command "pip install tiktoken"
- Run command "pip install pipmaster"
- Run command "pip install future"

## 3. Technology Stack 

- Programming Language: Python
- MCP SDK: Python
- MCP Transports: sse, stdio (default)
- MCP LLM Model: ollama
- LightRAG LLM Model: ollama

## 4. Solution References

1. LighRAG project sample code is on this directory `/home/pop/hosting/vibe_coding/agentui/mcp_server/LightRAG/examples`
2. The MCP Python SDK sample code directory is here `/home/pop/hosting/vibe_coding/agentui/mcp_server/python-sdk/examples`
3. The MCP document file is here `/home/pop/hosting/vibe_coding/agentui/mcp_server/llms-full.txt`
4. LighRAG test data file is here `/home/pop/hosting/vibe_coding/agentui/mcp_server/book.txt`


## RESULT
Got it. I will now update the MCP settings file `/home/pop/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`

```json
{
  "mcpServers": {
    "lightrag-server": {
      "command": "/home/pop/hosting/vibe_coding/agentui/mcp_server/.venv/bin/python",
      "args": [
        "/home/pop/hosting/vibe_coding/agentui/mcp_server/lightrag_mcp_server.py"
      ],
      "cwd": "/home/pop/hosting/vibe_coding/agentui/mcp_server",
      "env": {
        "LIGHTRAG_LLM_PROVIDER": "ollama",
        "LIGHTRAG_MODEL_NAME": "llama3.2",
        "LIGHTRAG_EMBEDDING_PROVIDER": "ollama",
        "LIGHTRAG_EMBEDDING_MODEL_NAME": "nomic-embed-text",
        "LIGHTRAG_DATA_PATH": "/home/pop/hosting/vibe_coding/agentui/mcp_server/book_small.txt",
        "LIGHTRAG_WORKING_DIR": "./lightrag_mcp_data",
        "LIGHTRAG_OLLAMA_BASE_URL": "http://localhost:11434"
      },
      "timeout": 120,
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

## Usage
```
uv run lightrag_mcp_server --transport sse --port 8000
```

The system should now connect to the running MCP server based on the configuration in mcp_settings.json. Once connected, the lightrag-server will appear under "Connected MCP Servers" in the environment details, and its tools (naive_search, local_search, global_search, hybrid_search) will become available.

The LightRAG MCP server script has been created and configured. After resolving several dependency and initialization issues, the server appears to be running successfully. 

tools available for use with the data loaded 
- naive_search, 
- local_search, 
- global_search, 
- hybrid_search  

Here's the Code and Response for the LightRAG:

### Code (app.py):

import os
import asyncio
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
from lightrag.kg.shared_storage import initialize_pipeline_status

WORKING_DIR = "./mybook"

if not os.path.exists(WORKING_DIR):
    os.mkdir(WORKING_DIR)

async def initialize_rag():
    rag = LightRAG(
        working_dir=WORKING_DIR,
        embedding_func=openai_embed,
        llm_model_func=gpt_4o_mini_complete,
        # llm_model_func=gpt_4o_complete
    )

    await rag.initialize_storages()
    await initialize_pipeline_status()

    return rag

def main():
    # Initialize RAG instance
    rag = asyncio.run(initialize_rag())

    with open("./book.txt", "r", encoding="utf-8") as f:
        rag.insert(f.read())

    # Perform naive search
    print(
        rag.query(
            "What is the Self-Consistency Prompt?", param=QueryParam(mode="naive")
        )
    )

    # Perform local search
    print(
        rag.query(
            "What is the Self-Consistency Prompt?", param=QueryParam(mode="local")
        )
    )

    # Perform global search
    print(
        rag.query(
            "What is the Self-Consistency Prompt?", param=QueryParam(mode="global")
        )
    )

    # Perform hybrid search
    print(
        rag.query(
            "What are the top themes in this story?", param=QueryParam(mode="hybrid")
        )
    )

if __name__ == "__main__":
    main()
    
    

### Response:

[Full response logs showing the initialization and search results]

(.venv) charlesqin@charless-MacBook-Pro ligtrag-test % python app.py  
INFO: Process 31212 Shared-Data created for Single Process
INFO:nano-vectordb:Load (89, 1536) data
INFO:nano-vectordb:Init {'embedding_dim': 1536, 'metric': 'cosine', 'storage_file': './mybook/vdb_entities.json'} 89 data
INFO:nano-vectordb:Load (85, 1536) data
INFO:nano-vectordb:Init {'embedding_dim': 1536, 'metric': 'cosine', 'storage_file': './mybook/vdb_relationships.json'} 85 data
INFO:nano-vectordb:Load (9, 1536) data
INFO:nano-vectordb:Init {'embedding_dim': 1536, 'metric': 'cosine', 'storage_file': './mybook/vdb_chunks.json'} 9 data
INFO: Process 31212 initialized updated flags for namespace: [full_docs]
INFO: Process 31212 ready to initialize storage namespace: [full_docs]
INFO: Process 31212 initialized updated flags for namespace: [text_chunks]
INFO: Process 31212 ready to initialize storage namespace: [text_chunks]
INFO: Process 31212 initialized updated flags for namespace: [entities]
INFO: Process 31212 initialized updated flags for namespace: [relationships]
INFO: Process 31212 initialized updated flags for namespace: [chunks]
INFO: Process 31212 initialized updated flags for namespace: [chunk_entity_relation]
INFO: Process 31212 initialized updated flags for namespace: [llm_response_cache]
INFO: Process 31212 ready to initialize storage namespace: [llm_response_cache]
INFO: Process 31212 initialized updated flags for namespace: [doc_status]
INFO: Process 31212 ready to initialize storage namespace: [doc_status]
INFO: Process 31212 storage namespace already initialized: [full_docs]
INFO: Process 31212 storage namespace already initialized: [text_chunks]
INFO: Process 31212 storage namespace already initialized: [llm_response_cache]
INFO: Process 31212 storage namespace already initialized: [doc_status]
INFO: Process 31212 Pipeline namespace initialized

## Self-Consistency Prompt

The Self-Consistency prompt is a technique utilized to ensure that the output generated by ChatGPT maintains consistency with the provided input. This approach is particularly useful for tasks such as fact-checking, data validation, or ensuring consistency in text generation.

### Prompt Formula
The prompt formula for the Self-Consistency prompt involves embedding the input text alongside an instruction. The instruction typically states, "Please ensure the following text is self-consistent."

### Examples of Application

1. **Text Generation**
   - **Task**: Generate a product review.
   - **Instructions**: The review should be consistent with the product information provided in the input.
   - **Prompt formula**: "Generate a product review that is consistent with the following product information [insert product information]."

2. **Text Summarization**
   - **Task**: Summarize a news article.
   - **Instructions**: The summary should be consistent with the information provided in the article.
   - **Prompt formula**: "Summarize the following news article in a way that is consistent with the information provided [insert news article]."

3. **Fact-checking**
   - **Task**: Check for consistency in a given news article.
   - **Input text**: "The article states that the population of the city is 5 million, but later on, it says that the population is 7 million."
   - **Prompt formula**: "Please ensure the following text is self-consistent: The article states that the population of the city is 5 million, but later on, it says that the population is 7 million."

4. **Data Validation**
   - **Task**: Check for consistency in a given data set.
   - **Input text**: "The data shows that the average temperature in July is 30 degrees, but the minimum temperature is recorded as 20 degrees."
   - **Prompt formula**: "Please ensure the following text is self-consistent: The data shows that the average temperature in July is 30 degrees, but the minimum temperature is recorded as 20 degrees."

By employing the Self-Consistency prompt, users can enhance the reliability of the text generated by ensuring that it aligns with the provided inputs.

### References
- [KG] Self-Consistency Prompt Description (File: Document Chunks)
- [KG] Application Examples for Self-Consistency Prompts (File: Document Chunks)
The Knowledge Base does not provide specific information on the "Self-Consistency Prompt." It typically discusses various prompt engineering techniques and their applications with language models like ChatGPT, but mentions self-consistency without elaborating on its definition or use cases.

If you have more detailed questions about other prompt techniques or topics related to prompt engineering, please feel free to ask!

### References
- [KG] Prompt Engineering Techniques encompass a variety of methods and practices for effectively engaging with language models like ChatGPT. (File: unknown_source)
- [KG] The Art of Asking ChatGPT for High-Quality Answers: A Complete Guide to Prompt Engineering Techniques covers various techniques related to prompt engineering and the effective use of ChatGPT. (File: unknown_source)
- [KG] ChatGPT is a state-of-the-art language model capable of generating human-like text based on the prompts given. (File: unknown_source)
The Knowledge Base provided does not contain specific information about the "Self-Consistency Prompt." This term may refer to a prompting technique meant to encourage models, like ChatGPT, to generate consistent outputs across different prompts or contexts, but further details are not available in the provided content. Therefore, I cannot provide a detailed explanation or context for the Self-Consistency Prompt.

If you have any other questions or need information on a different topic, feel free to ask! 

### References
- [KG] Ibrahim John discusses various prompting techniques in his book (File: unknown_source)
- [KG] Knowledge generation techniques are outlined in the book's content (File: unknown_source)
I don’t have specific details about the story you’re referring to, as the Knowledge Base does not provide information on any particular narrative beyond discussing techniques for text generation and prompt engineering. 

However, common themes in literature often include:

1. **Love** - exploring emotional connections and relationships.
2. **Personal Growth** - focusing on the journey of self-discovery and development.
3. **Conflict** - presenting struggles between characters or within oneself.
4. **Change** - highlighting transformations in characters or settings (e.g., changing seasons).
5. **Morality** - examining the concepts of right and wrong.

If you could provide more details or specify the story, I could help further! 

### References
- [KG] Love is a complex emotion that forms the basis of many poems and literary works. (File: unknown_source)
- [KG] Personal growth refers to the process of self-improvement and development, focusing on various aspects of life such as emotional, intellectual and relational growth. (File: unknown_source)
- [KG] The changing seasons refer to the transition periods throughout the year characterized by different weather patterns, environmental changes, and their impact on nature and human life. (File: unknown_source)

### The MCP document is:
please provide the link to the MCP document so I can copy and paste its content here for you.
https://modelcontextprotocol.io/llms-full.txt
