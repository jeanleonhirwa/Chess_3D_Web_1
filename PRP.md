# **Product Requirement Prompt (PRP): LLM Chess 3D**

## **1\. Project Overview**

**Project Name:** LLM Chess 3D

**Objective:** To create a beautiful, clean, and responsive web-based 3D chess game. The game will allow a human player to play against an LLM, or to spectate a game between two LLMs. The application will be built using React, Three.js (via react-three-fiber), and vanilla CSS.

**Core User Stories:**

* **As a player,** I want to play a game of chess in a 3D environment against an AI (LLM) so I can practice and be challenged.  
* **As a user,** I want to watch two LLMs play chess against each other so I can observe different AI strategies.  
* **As a user,** I want a clean, minimalist interface that is easy to understand and use on both desktop and mobile.  
* **As a user,** I want to be able to configure which LLM models to use and provide my own API key.

## **2\. Technical Stack**

* **Language:** JavaScript (ES6+)  
* **Frontend Library:** React.js (v18+, functional components and hooks)  
* **3D Rendering:** Three.js, implemented via react-three-fiber and react-three-drei. This is crucial for integrating 3D graphics declaratively within React.  
* **Chess Logic:** chess.js (a mandatory library for move generation, validation, and FEN/PGN management).  
* **State Management:** React Context API for global state (game state, FEN, settings) and useState/useReducer for component-level state.  
* **Animation:** react-spring (for smooth piece animations within the 3D scene).  
* **Styling:** Vanilla CSS. We will use a single global stylesheet (src/styles/App.css) with BEM-style conventions (e.g., .card, .card\_\_header, .button--primary) for clarity and to avoid conflicts.

## **3\. Core Features & Functionality**

### **F1: Game Mode Selection**

* On load, the user should be presented with a clean modal or initial view to select the game mode:  
  1. **Player (White) vs. LLM (Black)**  
  2. **Player (Black) vs. LLM (White)**  
  3. **LLM (White) vs. LLM (Black)** (Spectator Mode)  
* This modal will also be accessible via a "New Game" or "Settings" button during gameplay.

### **F2: 3D Chessboard & Environment**

* **Scene:** A react-three-fiber \<Canvas\> component will host the 3D scene.  
* **Camera:** Use @react-three/drei's \<OrbitControls /\> to allow the user to rotate (pan, orbit) and zoom the camera around the board.  
* **Lighting:** Use simple, clean lighting: one \<ambientLight /\> for general illumination and one \<directionalLight /\> to create soft shadows.  
* **Board:** An 8x8 grid of 3D planes (meshes).  
  * Light squares: \#f0d9b5  
  * Dark squares: \#b58863  
* **Pieces:**  
  * **CRITICAL:** Do not use external .glb or .obj files. Pieces must be created *procedurally* using standard Three.js geometries from @react-three/drei (e.g., \<Cylinder /\>, \<Sphere /\>, \<Cone /\>, \<Box /\>) combined into groups. This ensures zero external dependencies.  
  * **Example (Pawn):** A \<Cylinder /\> base with a \<Sphere /\> on top.  
  * **Example (Rook):** A wider \<Cylinder /\> with a smaller, crenelated top (e.g., using boolean operations or just a second cylinder).  
  * White pieces color: \#ffffff  
  * Black pieces color: \#333333  
  * Pieces should have a slightly reflective meshStandardMaterial.

### **F3: Game Play & 3D Interaction**

* **Game State:** The core game state (FEN, move list, turn) will be managed by a chess.js instance, likely wrapped in a custom useGameLogic hook or React Context.  
* **Click-to-Move Logic:**  
  1. User clicks their own piece. The piece is "selected" (e.g., highlighted with an emissive color).  
  2. The app uses chess.moves({ square: 'e2', verbose: true }) to get all valid moves for that piece.  
  3. Transparent highlighting markers (e.g., thin, flat \<Cylinder /\> meshes) appear on all valid destination squares.  
  4. User clicks one of the valid move squares.  
  5. The app calls chess.move({ from: 'e2', to: 'e4' }).  
  6. The chess.js state updates, triggering a re-render of the React component.  
* **Piece Animation:** When a piece's position changes in the game state, its 3D model should animate smoothly from its old square to its new square. Use react-spring's useSpring hook to animate the piece's position property.  
* **Raycasting:** react-three-fiber handles this automatically via onClick props on the 3D meshes (pieces and squares).

### **F4: UI Panel**

* A 2D HTML panel, separate from the 3D canvas, will display all game information.  
* **Layout:**  
  * **Desktop:** The UI panel should be on the right, taking \~30% of the viewport width. The 3D Canvas takes the remaining \~70%.  
  * **Mobile:** The UI panel should be on top, and the 3D Canvas below it.  
* **Components of the UI Panel:**  
  1. **Game Status:** A "card" showing:  
     * Current Turn: "White's Turn" / "Black's Turn"  
     * Game State: "In Progress", "Check", "Checkmate\!", "Stalemate"  
     * LLM Status: "Thinking..." (with a spinner) when the LLM is generating a move.  
  2. **Move History:** A scrollable list displaying moves in Standard Algebraic Notation (e.g., "1. e4 e5", "2. Nf3 Nc6"). chess.js's .pgn() can provide this.  
  3. **Controls:** Buttons for:  
     * "New Game" (opens Game Mode Selection)  
     * "Settings" (opens Settings Modal)  
     * "Undo Move" (optional, but good)

### **F5: Settings Modal**

* A 2D HTML modal that overlays the entire app.  
* **Fields:**  
  1. **LLM 1 (White) Model:** Dropdown (e.g., "Gemini 2.5 Flash", "GPT-4o Mini", "Claude 3 Haiku").  
  2. **LLM 2 (Black) Model:** Same dropdown.  
  3. **API Key:** A text input (type="password") for the user's API key.  
* **Storage:** The API key and model preference **MUST** be saved to localStorage so the user doesn't have to re-enter it. Read from localStorage on app load.

### **F6: LLM Integration**

* This will be handled in a dedicated service file: src/services/llmService.js.  
* **Function:** getLLMMove(fen, apiKey, model)  
* **Prompt Engineering:** This is the most critical part. The prompt sent to the LLM must be precise.  
  * **System Prompt:** "You are a world-class chess grandmaster. You will be given a FEN string representing the current board state. Your task is to return *only* the single best move in coordinate notation (e.g., 'e2e4', 'g1f3', 'e7e8q' for promotion). Do not include any other text, explanation, markdown, or chat."  
  * **User Prompt:** FEN: ${fen}  
* **API Call:** The function will use fetch to call the appropriate LLM API endpoint (e.g., Gemini generateContent). It must include the apiKey in the headers.  
* **Response Parsing:** The app must aggressively parse the LLM's text response to find the move (e.g., "e2e4"). It should be robust against variations (e.g., "e2e4", Move: e2e4).  
* **Validation:** After parsing the move, it **must** be validated against chess.js before being executed. If the LLM returns an invalid move, it should show an error and (ideally) retry the API call.

## **4\. Proposed File Structure**

llm-chess-3d/  
├── public/  
│   └── index.html  
├── src/  
│   ├── components/  
│   │   ├── Board.js           \# Main 3D scene: board, pieces, lights  
│   │   ├── Piece.js           \# Renders a single 3D piece (procedural geometry)  
│   │   ├── UIPanel.js         \# The main 2D UI container  
│   │   ├── GameStatus.js      \# Card for "White's Turn", "Checkmate"  
│   │   ├── MoveHistory.js     \# Scrollable list of moves  
│   │   ├── SettingsModal.js   \# Modal for API key and model selection  
│   │   └── Highlight.js       \# Renders a valid-move marker on the board  
│   ├── context/  
│   │   └── GameContext.js     \# React Context for global game state  
│   ├── hooks/  
│   │   └── useGameLogic.js    \# Custom hook managing the chess.js instance  
│   ├── services/  
│   │   └── llmService.js      \# Handles all API calls to LLMs  
│   ├── styles/  
│   │   └── App.css            \# Global vanilla CSS file (BEM)  
│   ├── App.js                 \# Main layout, combines 3D Canvas and UI Panel  
│   └── index.js               \# React root  
├── package.json

## **5\. Implementation Plan (Step-by-Step)**

**Phase 1: Project Setup & Core Chess Logic**

1. Initialize a new React app.  
2. Install dependencies: react-three-fiber, react-three-drei, chess.js, react-spring.  
3. Create the useGameLogic.js hook. It should initialize a new Chess() instance and expose methods:  
   * makeMove(from, to)  
   * getValidMoves(square)  
   * resetGame()  
   * And expose state: fen, pgn, isGameOver, turn, inCheck.  
4. Create GameContext.js to provide this logic to the whole app.  
5. Build a *temporary 2D HTML board* first to test the useGameLogic hook and move logic. Ensure state updates correctly.

**Phase 2: 3D Scene & Board Rendering**

1. Replace the 2D test board with App.js containing a full-screen \<Canvas\>.  
2. Inside \<Canvas\>, create Board.js.  
3. In Board.js, render the 8x8 grid of light and dark \<planeGeometry\> meshes.  
4. Add \<OrbitControls /\> and basic lighting (\<ambientLight /\>, \<directionalLight /\>).  
5. Create Piece.js. This component should accept a type ("p", "r", "n", "b", "q", "k") and color ("w", "b") prop.  
6. Inside Piece.js, use react-three-drei geometries to build the 6 unique piece shapes.  
7. In Board.js, read the game state from GameContext and map over the chess.board() array to render a \<Piece /\> component in the correct 3D position for each piece.

**Phase 3: 3D Interactivity & Animation**

1. Add onClick handlers to the \<Piece /\> components.  
2. When a piece is clicked:  
   * Set it as the "selected piece" in a local state.  
   * Call useGameLogic.getValidMoves() for its square.  
   * Render \<Highlight /\> components on the valid move squares.  
3. Add onClick handlers to the board squares (or the \<Highlight /\> meshes).  
4. When a valid square is clicked:  
   * Call useGameLogic.makeMove(selectedPiece.from, toSquare).  
   * Clear the "selected piece" and highlights.  
5. Wrap the \<Piece /\> component's group in animated from react-spring and use the useSpring hook to animate its position prop. The position should be derived from the FEN state in GameContext.

**Phase 4: Build 2D UI Panel**

1. Modify App.js layout to have the \<Canvas\> and the UIPanel.js component side-by-side (or top/bottom on mobile). Use vanilla CSS (Flexbox/Grid) for this.  
2. Create src/styles/App.css and add basic styles for a clean, minimalist look (fonts, colors, spacing).  
3. Build GameStatus.js and MoveHistory.js, feeding them data from GameContext.  
4. Style the UI panel, buttons, and cards using BEM conventions in App.css.

**Phase 5: LLM Integration**

1. Build SettingsModal.js. It should be a simple HTML modal (a div with position: fixed) that is shown/hidden by a state variable.  
2. Add localStorage.setItem and localStorage.getItem for the API key.  
3. Build llmService.js with the getLLMMove function as specified in F6. Hard-code the Gemini API endpoint for now.  
4. Modify the logic in useGameLogic.js or GameContext.js:  
   * After a player move, if the new turn belongs to an LLM, set a "thinking" state.  
   * Call getLLMMove(fen, apiKey, model).  
   * When the response is received, parse it, validate it, and call makeMove() with the LLM's move.  
   * Unset the "thinking" state.

**Phase 6: Spectator Mode & Polish**

1. Implement the LLM vs. LLM game loop. This will be a useEffect that triggers when:  
   * gameMode \=== 'llm-vs-llm'  
   * \!isGameOver  
   * \!isThinking  
2. This effect will call getLLMMove for the current player (White or Black), make the move, and then the useEffect will re-trigger for the *other* LLM, creating a loop.  
3. Add a slight delay (e.g., 1-2 seconds) between moves so the user can follow the game.  
4. Finalize all CSS, test responsiveness thoroughly, and ensure all game-end states (Checkmate, Stalemate) are handled gracefully.