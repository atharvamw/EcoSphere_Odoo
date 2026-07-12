# Frontend Directory — EcoSphere ESG Platform
**Owner:** Rohit (Frontend)

## Technical Stack
*   React 19 + Vite 8 + TypeScript
*   Tailwind CSS (used internally by shadcn/ui components)
*   Radix UI (accessible primitives via shadcn/ui)
*   Zustand (lightweight client state management)
*   TanStack Query (server state management & 30s polling)
*   D3.js (custom concentric Contour Score Rings SVG drawings)
*   Recharts (dashboard metrics charts)
*   React Router 7 (auth guards and navigation)

## Visual Theme Config
*   Add google font link tags (Fraunces, Inter, IBM Plex Mono) to index.html if needed.
*   Theme color properties are pre-defined in `index.css`:
    *   Sage Paper: `#EDEEE3`
    *   Ledger Ink: `#152019`
    *   Canopy Green: `#2F5D3A`
    *   Ochre Clay: `#C97B3D`
    *   Slate Blue: `#3E5266`
    *   Signal Gold: `#E4B343`

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

3.  **Run Tests:**
    ```bash
    npm run test
    ```
