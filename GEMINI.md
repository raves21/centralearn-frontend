# Centralearn Frontend

## Project Overview
`centralearn-frontend` is a Learning Management System (LMS) frontend built with **React 19**, **TypeScript**, and **Vite**. It features a domain-driven architecture for better scalability and maintenance.

### Main Technologies
- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query) (React Query)
- **API Client:** Axios
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** Tailwind CSS, Radix UI (Shadcn/UI components)
- **Forms:** React Hook Form + Zod for validation
- **Rich Text Editor:** Tiptap

## Directory Structure
- `src/domains/`: Business logic and domain-specific components. Each domain typically includes:
  - `api/`: TanStack Query hooks (mutations and queries).
  - `components/`: Components specific to the domain.
  - `types.ts`: TypeScript definitions for domain data.
  - `stores/`: (Optional) Zustand stores for domain-specific state.
- `src/routes/`: Routing configuration using TanStack Router.
- `src/components/`:
  - `layout/`: Global layout components (SidePanel, TopPanel, Providers).
  - `shared/`: Generic, reusable components used across domains (GlobalDialog, LoadingComponent, etc.).
  - `ui/`: Base UI components (Shadcn/UI).
- `src/utils/`: Global hooks, shared types, and utility functions.
- `src/lib/`: Library-specific configurations (e.g., utility functions for styling).

## Building and Running
The project uses `bun` as a package manager (inferred from `bun.lock`).

### Key Commands
- `bun run dev`: Start the development server.
- `bun run build`: Build the project for production.
- `bun run lint`: Run ESLint to check for code issues.
- `bun run preview`: Preview the production build locally.

## Development Conventions
- **Domain-Driven Logic:** Keep domain-specific logic, types, and API calls within their respective `src/domains/` folder.
- **TanStack Router:** Use file-based routing and ensure type-safety by following TanStack Router's conventions.
- **TanStack Query:** Use custom hooks for all API interactions (found in `src/domains/*/api/`).
- **Styling:** Prefer Tailwind CSS utility classes and Shadcn/UI components.
- **State Management:** Use Zustand for global or complex local state that doesn't belong in the URL or TanStack Query cache.
- **Component Organization:**
  - Put reusable, low-level UI components in `src/components/ui/`.
  - Put shared, high-level components in `src/components/shared/`.
  - Domain-specific UI belongs in `src/domains/<domain>/components/`.
