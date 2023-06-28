# Air Sentry Server

This repository contains a TypeScript Express server that provides a starting point for building web applications or APIs. It includes features such as TypeScript support, build scripts, linting, and a development server with hot-reloading.

## Prerequisites

Before getting started, ensure that you have the following installed on your machine:

- Node.js (version >= 16)
- npm (Node Package Manager) or yarn

## Installation

1. Clone this repository to your local machine:

   ```shell
   git clone <repository_url>
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

3. copy env.examople to env:

## Usage

The following npm scripts are available:

- **build**: Builds the server by transpiling TypeScript files to JavaScript and outputs the result to the dist directory.
- **lint**: Lints the TypeScript source files in the src directory using ESLint.
- **start**: Starts the server in production mode. This script runs the compiled server.js file located in the dist directory.
- **dev**: Starts the development server using nodemon. It automatically restarts the server when changes are made to the source code.
