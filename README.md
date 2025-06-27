## User Management System

### Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Live Demo](#live-demo)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Running the App](#running-the-app)
* [API Documentation](#api-documentation)
* [Component Documentation](#component-documentation)
* [Architecture Guide](#architecture-guide)
* [Folder Structure](#folder-structure)
* [Demo video](#demo-video)



---

## Project Overview

The **User Management System** is a full-stack application built with React, TypeScript, Vite, and Tailwind CSS. It allows administrators to create, read, update, and delete user profiles. Key features include form validation with Zod, server-state management via React Query, routing with React Router DOM, and a mock API backend.

## Features

* List and paginate users
* Create and edit user profiles
* View user details
* Delete users with confirmation
* Responsive design with Tailwind CSS
* Accessible components powered by Radix UI
* Client-side validation with Zod + React Hook Form
* Optimistic updates and caching via React Query

## Live Demo


View the live demo: [Click on the Link](https://user-management-system-eight-zeta.vercel.app/)

## Tech Stack

* **Framework**: React 18, Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS, Shadcn UI
* **State Management**: React Query
* **Forms & Validation**: React Hook Form, Zod
* **Routing**: React Router DOM
* **Charts & UI**: Recharts, Lucide Icons

## Getting Started

### Prerequisites

* Node.js >= 18.x
* npm >= 9.x or yarn

### Installation

1. Clone the repo

   ```bash
   git clone https://github.com/Soumyaditya25/User-Management-System.git
   cd User-Management-System
   ```
2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

* **Development**

  ```bash
  npm run dev
  # or
  yarn dev
  ```
* **Production Build**

  ```bash
  npm run build
  # or
  yarn build
  ```
* **Preview Production Build**

  ```bash
  npm run preview
  # or
  yarn preview
  ```

---

## API Documentation

| Method | Endpoint     | Description                | Request Body                    | Response              |
| ------ | ------------ | -------------------------- | ------------------------------- | --------------------- |
| GET    | `/users`     | Get list of users          | —                               | `User[]`              |
| GET    | `/users/:id` | Get single user by ID      | —                               | `User`                |
| POST   | `/users`     | Create a new user          | `{ name, email, role, ... }`    | `User`                |
| PUT    | `/users/:id` | Update existing user by ID | `{ name?, email?, role?, ... }` | `User`                |
| DELETE | `/users/:id` | Delete a user by ID        | —                               | `{ message: string }` |


---

## Component Documentation

Below are key components and their props.

### `UserList`

Displays a paginated table of users.

```ts
interface UserListProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

*Usage:*

```tsx
<UserList
  users={users}
  isLoading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  currentPage={page}
  totalPages={pages}
  onPageChange={setPage}
/>
```

### `UserForm`

Form for creating or editing a user, built with React Hook Form and Zod.

```ts
interface UserFormProps {
  defaultValues?: Partial<User>;
  onSubmit: (values: UserInput) => void;
}
```

*Usage:*

```tsx
<UserForm
  defaultValues={selectedUser}
  onSubmit={saveUser}
/>
```

### `UserDetail`

Shows detailed user information.

```ts
interface UserDetailProps {
  user: User;
}
```

*Usage:*

```tsx
<UserDetail user={user} />
```

---

## Architecture Guide

The project follows a modular, feature-based structure:

```
public/            Static assets and index.html
src/
  components/     Reusable UI components (e.g., buttons, tables)
  contexts/       React Context providers
  hooks/          Custom React hooks (e.g., useUsers)
  lib/            Shared utilities and helper functions
  pages/          Route-specific pages (Dashboard, UserPage, etc.)
  services/       API layer (axios instances, endpoints definitions)
  types/          TypeScript interfaces and Zod schemas
  App.tsx         Application root with routing setup
  main.tsx        Entry point mounting React app to DOM
index.html        HTML template
vite.config.ts    Vite build configuration
tailwind.config.ts Tailwind CSS configuration
tsconfig.json     TypeScript compiler options

```

**Design Decisions:**

* **Vite** for fast HMR and minimal configuration
* **React Query** for server-state caching & synchronization
* **Zod** for schema validation, integrated with React Hook Form
* **Radix UI** primitives for accessible, unstyled components
* **Tailwind CSS** for utility-first styling
* **Feature-based folders** to group related code

---

## Folder Structure

Describe the high-level folder layout:

```
public/           Static assets and index.html
src/
  components/    Shared UI components
  contexts/      React Context providers
  hooks/         Custom hooks
  lib/           Utility functions and helpers
  pages/         Route-specific page components
  services/      API interaction layer
  types/         TypeScript types and Zod schemas
  App.tsx        Root component with Router
  main.tsx       Entry point mounting the app
index.html       Static HTML template
README.md        Project documentation (this file)
vite.config.ts   Vite configuration
tailwind.config.ts Tailwind setup
tsconfig.json    TypeScript configuration

```


## Demo Video



---
Made with ❤️ by Soumyaditya
