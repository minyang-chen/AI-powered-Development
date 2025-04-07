graph TD
    subgraph Browser UI
        direction LR
        Sidebar -->|onDragStart| App(App Component)
        App -->|selectedNode| ConfigPanel(ConfigPanel Component)
        ConfigPanel -->|"onUpdateNodeData(nodeId, data)"| App
        Sidebar -->|onGenerateCode| App
        App -->|nodes, edges| RF(ReactFlow Canvas)
        RF -->|"onNodeClick(node)"| App
        RF -->|onPaneClick| App
        RF -->|onDrop| App
        RF -->|Render| CustomNodes(AgentNode, RunnerNode, FunctionToolNode)
        App -->|Render| Modal(CodeModal Component)
    end

    subgraph State & Logic
        App -- Manages State --> AppState(nodes, edges, selectedNode, generatedCode, isModalOpen)
        App -- Uses --> CodeGen(utils/codeGenerator.js)
        CodeGen -- Reads --> AppState
    end

    style App fill:#f9f,stroke:#333,stroke-width:2px
    style RF fill:#def,stroke:#333,stroke-width:1px
    style Sidebar fill:#eee,stroke:#333,stroke-width:1px
    style ConfigPanel fill:#eee,stroke:#333,stroke-width:1px
    style Modal fill:#eee,stroke:#333,stroke-width:1px
    style CustomNodes fill:#fff,stroke:#333,stroke-width:1px
    style AppState fill:#lightgrey,stroke:#333,stroke-width:1px
    style CodeGen fill:#lightyellow,stroke:#333,stroke-width:1px

    %% Interactions Description (Simplified for diagram clarity):
    %% 1. Sidebar drag -> App state update via onDrop
    %% 2. ReactFlow renders based on App state
    %% 3. Node click -> App state update -> ConfigPanel update
    %% 4. ConfigPanel edit -> App state update
    %% 5. Generate Code click -> App calls CodeGen -> Modal update