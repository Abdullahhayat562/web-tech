# MVMT Landing Page - Express.js Application

This is an Express.js-based web application that converts the MVMT landing page from assignment-2 into a server-side rendered application using EJS templating engine.

## Project Structure

```
labtask-2/
├── public/
│   ├── css/
│   │   └── styles.css       # Responsive CSS styles
│   └── js/
│       └── script.js        # Hamburger menu functionality
├── views/
│   ├── homepage.ejs         # Main landing page template
│   └── contact-us.ejs       # Contact page template
├── package.json             # Project dependencies
├── server.js                # Express.js server setup
└── README.md                # This file
```

## Features

- **Express.js** - Fast, unopinionated web framework for Node.js
- **EJS Template Engine** - Simple templating engine for dynamic HTML rendering
- **Static Asset Serving** - CSS, JavaScript, and images served from the `public` directory
- **Responsive Design** - Mobile-first approach with media queries for all screen sizes
- **Hamburger Menu** - Interactive responsive navigation menu
- **Multiple Routes** - Homepage (`/`) and Contact Us (`/contact-us`) pages

## Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

## Installation

1. Navigate to the project directory:
   ```bash
   cd labtask-2
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Using Node.js directly:
```bash
npm start
```

Or:
```bash
node server.js
```

### Using Nodemon (for development with auto-reload):

First, install nodemon globally:
```bash
npm install -g nodemon
```

Then run:
```bash
npm run dev
```

Or:
```bash
nodemon server.js
```

## Accessing the Application

Once the server starts (you should see "Server Started at localhost:3000" in the console), open your browser and visit:

- **Homepage**: [http://localhost:3000/](http://localhost:3000/)
- **Contact Us**: [http://localhost:3000/contact-us](http://localhost:3000/contact-us)

## Understanding the Code

### Server Setup (server.js)

```javascript
// Set EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => res.render("homepage"));
app.get("/contact-us", (req, res) => res.render("contact-us"));
```

### Static Files

Files in the `public` directory are served directly. Reference them with a leading slash:
- CSS: `/css/styles.css`
- JavaScript: `/js/script.js`

### EJS Templates

EJS files in the `views` directory are dynamically rendered by Express. You can use:
- `<% %>` - Embedded JavaScript code
- `<%= %>` - Output variable values
- `<%- %>` - Output unescaped HTML

## Customization

You can extend the application by:
1. Adding more routes in `server.js`
2. Creating new EJS templates in the `views` folder
3. Adding more CSS or JavaScript files in the `public` folder
4. Using EJS templating features like includes and partials

## Dependencies

- **express** (v5.2.1) - Web framework
- **ejs** (v5.0.1) - Templating engine
- **nodemon** (v3.0.1) - Development tool for auto-reloading

## License

This project is created for educational purposes.

## Support

For questions or issues, refer to the official documentation:
- [Express.js Documentation](https://expressjs.com/)
- [EJS Documentation](https://ejs.co/)
