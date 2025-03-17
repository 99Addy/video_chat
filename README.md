# SideNotes

A simple notes widget application.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd SideNotes
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

## Running the Application

1. Start the development server:

   ```sh
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Testing the Application

To run tests, use:

```sh
npm test
```

## Run the electron directly:

`npm run electron`

## Building the Application

To create a production build, run:

```sh
npm run build
```

## Error fix after giving build

```
In build > index.html :
put a dot before /static in
src="./static/js/main.XXXXX.js" and also in
href="./static/css/main.XXXXX.css"
```

## Build the .dmg file

`npm run package-mac`

> > > > > > > 95e77e1 (Hidden during screen share functionality added)
