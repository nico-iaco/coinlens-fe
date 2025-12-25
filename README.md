# CoinLens Frontend

CoinLens Frontend is the web interface for the CoinLens application, designed to help users catalog, manage, and identify coins. Built with React and TypeScript, it provides a modern and responsive user experience for coin collectors.

## Features

- **Coin Cataloging**: View and manage your personal collection of coins.
- **Coin Identification**: Upload images of coins (front and back) to identify and retrieve details.
- **Detailed View**: Inspect specific details of each coin in your collection.
- **Responsive Design**: optimized for various screen sizes.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Styling**: Native CSS (Custom styles)
- **Containerization**: [Docker](https://www.docker.com/) with Nginx

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v24 or higher recommended)
- **npm** (comes with Node.js)

## Getting Started

### Local Development

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd coinlens-fe
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the development server**:

    ```bash
    npm run dev
    ```

    The application will be available at using the URL shown in your terminal (usually `http://localhost:5173`).

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be generated in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Docker Support

The application is fully containerized using a multi-stage Docker build.

### Running with Docker

1. **Build the Docker image**:

    ```bash
    docker build -t coinlens-fe .
    ```

2. **Run the container**:

    ```bash
    docker run -p 80:80 coinlens-fe
    ```

    The application will be accessible at `http://localhost`.

### Docker Architecture

- **Stage 1 (Build)**: Uses `node:24-alpine` to install dependencies and build the application.
- **Stage 2 (Serve)**: Uses `nginx:alpine` to serve the static assets. It includes a custom Nginx configuration (`nginx.conf.template`) to handle SPA routing correctly.

## Project Structure

```
coinlens-fe/
├── src/
│   ├── components/     # Reusable UI components (Layout, etc.)
│   ├── context/        # React Context providers (CollectionContext)
│   ├── pages/          # Application pages (Home, Upload, CoinDetails)
│   ├── services/       # API services and business logic
│   ├── styles/         # Global styles
│   ├── App.tsx         # Main application component with routing
│   └── main.tsx        # Entry point
├── Dockerfile          # Docker configuration
├── nginx.conf.template # Nginx configuration template
├── package.json        # Dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the built application.
