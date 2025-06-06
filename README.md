#  Insurance - Smart Dynamic Insurance Portal 📋


A modern, dynamic, and feature-rich web application for a smart insurance portal. This project allows users to apply for different types of insurance through fully dynamic forms, manage their submissions in a customizable table, and enjoy a premium user experience with features like dark mode, autosave, and drag-and-drop reordering.

**🔗 Live Demo: [https://insurance-one.netlify.app/](https://insurance-one.netlify.app/)**

---

## ✨ Features

This project successfully implements all the core requirements of the assignment, along with several bonus features to showcase modern frontend development practices.

### Core Features
-   **📱 Fully Responsive Design**: A seamless experience across all devices, from mobile phones to desktops.
-   **📋 Smart Dynamic Forms**: Forms are rendered dynamically based on API responses. No hardcoded form structures.
-   **👁️ Conditional Logic**: Form fields intelligently appear or disappear based on user input (e.g., "smoking frequency" field shows only if the user is a smoker).
-   **🔄 Nested Fields & Groups**: Handles complex form structures with nested sections like "Personal Information" or "Address".
-   **🌐 Dynamic Dependent Options**: Select fields (like "State") dynamically fetch jejich options based on the value of another field (like "Country").
-   **📊 Customizable Submissions Table**: A powerful table to view submitted applications with features like:
    -   Client-side full-text search.
    -   Column sorting.
    -   Dynamic column visibility selector.
    -   Responsive pagination.

### 🌟 Bonus Features Implemented
-   **💾 Autosave Drafts**: Automatically saves the user's form progress to `localStorage` and restores it on page load, preventing data loss.
-   **↔️ Drag-and-Drop Field Reordering**: Users can reorder form groups to match their preferred workflow, powered by `dnd-kit`.
-   **🌙 Dark Mode Toggle**: A smooth, persistent dark/light mode toggle that respects user's choice across sessions and prevents the "flash of unstyled content" (FOUC).
-   **✅ Robust Unit & Integration Tests**: High-quality tests written with **Vitest** and **React Testing Library** to ensure code reliability and correct behavior. API calls are mocked using **Mock Service Worker (MSW)**.
-   **🚀 Automated CI/CD Pipeline**: A professional CI/CD pipeline set up with **GitHub Actions** to automatically lint, test, build, and deploy the application to **Netlify** on every push to the `main` branch.

---

## 🛠️ Tech Stack & Architecture

This project is built with a modern, scalable, and type-safe tech stack, focusing on best practices and an excellent developer experience.

-   **Framework**: [React] (`v19`) with [TypeScript]
-   **Build Tool**: [Vite]
-   **UI Library**: [Ant Design (AntD)]
-   **State Management**:
    -   **Server State**: [TanStack Query (React Query)] for efficient API data fetching, caching, and synchronization.
    -   **UI State**: React Context API for global state like theme management.
    -   **Form State**: [React Hook Form] for high-performance and flexible form state management.
-   **Routing**: [React Router DOM]
-   **Validation**: [Zod] for schema-based, type-safe validation.
-   **Drag & Drop**: [dnd-kit]
-   **Animation**: [Framer Motion]
-   **API Client**: [Axios]
-   **Testing**: [Vitest] + [React Testing Library] + [MSW]
-   **Code Quality**: [ESLint] + [Prettier]

---

## ⚙️ Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/davariijs/insurance-app.git
    cd insurance-app
    ```

2.  **Install dependencies:**
    This project uses `npm`.
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This will start the application on `http://localhost:5173`.
    ```bash
    npm run dev
    ```

### Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
-   `npm run build`: Bundles the application for production.
-   `npm run lint`: Lints the code using ESLint.
-   `npm run test`: Runs tests in watch mode.
-   `npm run test:run`: Runs all tests once.
-   `npm run coverage`: Runs tests and generates a coverage report.
-   `npm run format`: Formats all files with Prettier.

---

## API Usage & Assumptions

This application interacts with the API endpoints provided in the assignment specification.

-   `GET /api/insurance/forms`: Fetches the structure for all available insurance forms.
-   `POST /api/insurance/forms/submit`: Submits the filled form data.
-   `GET /api/insurance/forms/submissions`: Fetches a static list of submitted applications.
-   `GET /api/getStates?country=...`: Fetches a list of states for a given country.

### Assumptions & Limitations

-   **Mock API Behavior**: The provided API endpoints at `assignment.devotel.io` are treated as mock services. The `POST /api/insurance/forms/submit` endpoint accepts data but does not persist it. Consequently, the `GET /api/insurance/forms/submissions` endpoint always returns the same initial static list.
-   **Data Invalidation Strategy**: To handle this limitation while demonstrating best practices, the application implements the following flow upon a successful submission:
    1.  It uses TanStack Query's `queryClient.invalidateQueries` to mark the submissions data as "stale".
    2.  In a real-world application with a persistent backend, this would automatically trigger a background refetch of the updated list when the user navigates to the submissions page.
    3.  The user receives a success notification and is then automatically redirected to the submissions page to view the (static) list.
    
    This approach correctly implements the data invalidation pattern expected in modern web applications, avoiding the display of fabricated or incomplete data in the table.

-   **Dynamic Options**: The `dynamicOptions` feature for fields like "State" is fully implemented. An API call is made to the specified endpoint. For forms where a dependency field (e.g., "Country") is absent, the application logically assumes a default value to ensure functionality and fetch the relevant options.

---