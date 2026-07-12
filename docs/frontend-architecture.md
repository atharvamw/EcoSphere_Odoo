# EcoSphere AI Frontend Architecture

## Project Structure

The project follows a **Feature-Sliced Design** to maintain scalability and organization.

*   `src/app`: Controls the routing structure (Next.js App Router). Keeps UI and routing separate from business logic.
*   `src/components/ui`: The Design System components (dumb, reusable).
*   `src/features/*`: Feature-based modules encapsulating their own UI, API, store, and types (Environmental, Social, Governance, Gamification, Core).
*   `src/lib`: Core utility functions, Axios API instance, etc.
*   `src/hooks`: Global custom hooks.
*   `src/providers`: React Context providers (QueryProvider, etc.).
*   `src/store`: Global state management (Zustand).

## State Management

*   **Server State**: React Query (`@tanstack/react-query`). Fetches, caches, and synchronizes data with the backend.
*   **Client State**: Zustand (`zustand`). Manages lightweight global UI state (sidebar, theme, modals).
*   **Form State**: React Hook Form (`react-hook-form`) with Zod (`zod`) for schema validation.

## Styling

*   **Tailwind CSS v4**: Utility-first CSS framework for rapid and consistent styling.
*   **Component Merging**: `clsx` and `tailwind-merge` (`cn` utility) for dynamic class combinations without conflicts.

## API Integration

*   **Axios**: Configured in `src/lib/api.ts` with request/response interceptors to handle JWT token attachment and automatic 401 redirection.

## Development Workflow

1.  **Add a Feature**: Create a new folder under `src/features/[featureName]`.
2.  **Add API Calls**: Define Axios fetchers in `src/features/[featureName]/api` and wrap them in custom React Query hooks.
3.  **UI Components**: Keep reusable presentational components in `src/components/ui`. Put domain-specific UI in `src/features/[featureName]/components`.
4.  **Testing**: Ensure components are independently testable. Use Storybook for UI components if needed (future step).
