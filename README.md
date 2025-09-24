
# Building a Backend API with Fastify – A Complete Beginner’s Guide

---

## 1. Introduction: What is a Backend and an API? ⚙️
---

In web development, the **backend** refers to the server-side of an application.  
This is where the app’s core logic, data storage, and processing occur.  

Unlike the frontend (what users see and interact with in their browser),  
the backend runs on a server and handles things like database operations,  
user authentication, and business rules.  

The backend ensures that when a user performs an action on the frontend  
(e.g. clicking a button), the right data is fetched or modified on the server  
and the result is sent back.  

An **API** (Application Programming Interface) in this context usually means  
a set of endpoints (URLs) that the frontend or other clients call to interact  
with the backend.  

When we talk about a **REST API**, we mean a collection of HTTP endpoints that  
follow conventions to represent operations on data. For example:  

- `GET /items` → retrieve a list of items  
- `POST /items` → create a new item  

Each endpoint maps to an HTTP method (`GET`, `POST`, `PUT`, `DELETE`, etc.),  
indicating whether we are retrieving, creating, updating, or deleting data.  

The API acts as a **contract**: it defines how clients request data or actions  
and what responses to expect from the server.  

👉 In summary, the backend API is the **brain** of your application:  
it listens for requests, processes them (e.g. with a database),  
and responds with data (usually JSON).  

Now, let’s see how we can build one using **Node.js** and **Fastify**. 🚀

---

## 2. Node.js Servers and Frameworks (Express vs Fastify) 📡
---

**Node.js** is a runtime environment that lets us run JavaScript server-side.  
One of its core features is the built-in `http` module, which can handle  
requests and responses.  

But using it directly is low-level and repetitive for complex APIs.  
This is where **web frameworks** come in.  

Two popular ones are **Express** and **Fastify**. Both simplify building  
servers and APIs with higher-level abstractions on top of Node’s HTTP module.  

---

### 1. What do Express and Fastify have in common? 🤝
---

* **Routing**:  
  Both let you define routes (endpoints) for URLs + HTTP methods.  
  - Express: `app.get('/items', handler)`  
  - Fastify: `fastify.get('/items', handler)`  

  In both cases, a `GET /items` request runs the handler.  

* **Middleware / Plugins**:  
  - Express: uses middleware functions.  
  - Fastify: uses encapsulated plugins.  

  Both allow you to modularize code (auth, logging, DB, etc.).  

* **Request / Response Handling**:  
  - Express: `req`, `res`  
  - Fastify: `request`, `reply`  

  Conceptually the same: inspect the request, run logic, send a response.  

* **Serving JSON**:  
  - Express: `res.json()` or `res.send()`  
  - Fastify: `reply.send()` (auto-serializes to JSON).  

* **Listening on a Port**:  
  Both run on Node’s HTTP server.  
  You call `.listen(3000)` (or another port), and the server starts handling  
  incoming HTTP requests. 🔑

---
### 2.Key differences (Express vs Fastify):
---

* **Performance**:  
  Fastify was designed with performance in mind – its creators 
  advertise it as one of the fastest Node.js web frameworks.  
  In fact, Fastify can handle roughly 2–4 times more requests 
  per second than Express under similar conditions.  
  It achieves this with an optimized router and low overhead 
  in processing requests.  

  Express is certainly fast enough for many use cases, but if 
  raw throughput or running at scale is a concern, Fastify 
  has an edge in speed.  

* **Developer Experience and Features**:  
  Express is minimalist and unopinionated – it gives you the 
  basics and you build your structure or use middleware as 
  needed. This simplicity makes the learning curve gentle for 
  beginners and has led to a huge ecosystem of middleware 
  and examples.  

  Fastify, on the other hand, is a bit more structured or 
  opinionated. It encourages schema-based validation, has 
  built-in support for async/await, and includes features like 
  encapsulated plugins and integrated logging (via Pino).  

  These features guide developers toward scalable, consistent 
  code. Fastify also has first-class TypeScript support and 
  supports HTTP/2 out of the box, reflecting its focus on 
  modern Node.js development.  

* **Plugin Architecture vs Middleware**:  
  Express middleware are typically simple functions with 
  access to `req`, `res`, and a `next` callback.  

  Fastify's equivalent is a *plugin*. A plugin can register 
  routes, add decorators, or wrap other plugins. Fastify 
  plugins are encapsulated – meaning you can scope things 
  like DB connections or auth strategies to specific routes.  

  This avoids global side-effects and makes it easier to 
  compose applications. In Express, middleware is global or 
  applied per route manually; Fastify provides a more 
  structured approach.  

* **Validation and Error Handling**:  
  Fastify’s emphasis on JSON schemas means you can validate 
  bodies, queries, and even responses automatically. If input 
  doesn’t match the schema, Fastify rejects it with a 400 Bad 
  Request. This saves you boilerplate validation logic.  

  Express doesn’t have built-in validation – you’d need a 
  library or manual checks. Both frameworks allow error 
  handlers, but Fastify’s structured approach (hooks + 
  schemas) reduces unhandled errors.  

* **Community and Ecosystem**:  
  Express has been around since 2010 and has a massive 
  ecosystem with middleware and community knowledge.  

  Fastify is newer (2017) but has grown quickly. Many plugins 
  (databases, auth, etc.) are officially maintained under the 
  Fastify org.  

  Express still dominates legacy projects, but Fastify is 
  increasingly chosen for new ones in 2025.  

---

👉 For our purposes, **Fastify will be our framework of choice**.  
That said, if you know one, you can often apply the same concepts 
to the other. Routes, HTTP methods, and general design are shared – 
the difference lies in the APIs and features around them.

## Setting Up a Fastify Project (Node.js + Fastify) ⚡

Let's walk through setting up a new Fastify project from scratch.  
(We assume you have Node.js installed on your system, and we'll focus on  
the project setup and npm commands rather than Node installation itself.)

---

### 1. Initialize a Node.js project 📦

Create a new folder for your project (let's call it `fastify-api`)  
and run `npm init -y` inside.  

This creates a `package.json` file with default settings.  
The `package.json` tracks your dependencies and scripts for the project.

---

### 2. Install the required dependencies 🔧

We will use the following npm packages in our project (with their versions  
as of this writing):

- **fastify** – The Fastify framework (e.g. version ^4.x or ^5.x depending  
  on latest, for instance `fastify@^4.16.0`).  
  Fastify provides the web server and routing functionality.  

- **@fastify/swagger** – The Swagger/OpenAPI documentation plugin for Fastify  
  (e.g. `@fastify/swagger@^8.0.0`).  
  This allows us to automatically generate API documentation (with a visual UI)  
  from our route schemas.  

- **dotenv** – A utility to load environment variables from a `.env` file  
  (e.g. `dotenv@^16.0.3`).  
  This helps manage configuration like port numbers, database URLs, etc.,  
  without hardcoding them.  

- **uuid** – A library to generate unique IDs (we’ll use this for creating  
  unique item IDs in our example, e.g. `uuid@^9.0.0`).  

Additionally, for development convenience, you can install **nodemon** as a  
dev dependency (e.g. `nodemon@^3.1.0`).  
Nodemon automatically restarts your server whenever you make file changes,  
which speeds up development. (This is optional but recommended.)  

👉 Use npm to install these. In your project directory, run:

```bash
npm install fastify @fastify/swagger dotenv uuid
npm install --save-dev nodemon
````

This will add the listed packages to your `package.json`.
After installation, your dependencies might look like:

```json
{
  "dependencies": {
    "fastify": "^4.16.0",
    "@fastify/swagger": "^8.0.0",
    "dotenv": "^16.0.3",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

(Note: Versions are examples; you might see different specific version numbers.
The caret (`^`) means npm can install the latest compatible minor/patch version.)

---

### 3. Configure npm scripts 📜

In the same `package.json`, it's good to set up scripts for common tasks.
For example, open `package.json` in a text editor and add:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

* The **"start"** script will run our server in production mode (without auto-reload).
* The **"dev"** script uses nodemon to automatically restart the server on file
  changes, useful during development.

With this setup, you can start your server by running:

* `npm run start` → one-time start
* `npm run dev` → auto-reloading during development

---

Now that our environment is prepared, let's create the actual files and code
for our Fastify server. 🚀

---

### Project Structure and Best Practices 🗂️

A well-structured project makes it easier to understand, maintain, and extend
your code. In our Fastify API project, we will follow a structure that separates
concerns and follows best practices:

```
fastify-api/
├── app.js
├── server.js
├── data/
│   └── items.db
├── routes/
│   ├── Handler.js
│   ├── Controller.js
│   ├── Schema.js
│   └── Services.js
├── test.http
├── package.json
├── package-lock.json
└── .env (optional, for configuration)
```

## Explaining the Project Structure 🗂️

Let's explain each part of this structure and why it's organized this way:

---

### `app.js` ⚙️  
This file is responsible for building or configuring the Fastify app  
(but not starting it). Here we create a Fastify instance, register plugins  
(like Swagger for documentation, or any other Fastify plugins), and register  
our application routes.  

Think of `app.js` as **setting up the application** – we keep it separate so  
that we could potentially reuse the setup in different contexts (for example,  
in tests or if we wanted to run multiple servers, etc.).  

This separation is also a common practice to keep concerns clear:  
- `app.js` configures the server  
- another file (`server.js`) actually starts it.  

---

### `server.js` 🚀  
This is the entry point that actually starts the server.  
It imports the configured Fastify app from `app.js`, then calls  
`fastify.listen()` to bind the server to a host and port.  

We separate `server.js` from `app.js` so that starting the server is distinct  
from creating the server.  

This is useful for testing (you might start the app in-memory for tests  
without calling `.listen`) and follows the **Single Responsibility Principle**:  
`server.js` just starts things up.  

---

### `data/items.db` 📊  
This file holds our data. In a real application, this would likely be replaced  
by a database or ORM model. In our simple project, we use it to store a list  
of items in memory (for example, it could export an array of item objects).  

Keeping data/model definitions in a separate module makes it easier to change  
the data source later (swap the in-memory array for an actual database).  

---

### `routes/` directory 🌐  
This folder contains everything related to our API routes, organized by  
feature/domain. In our example, we have one domain: **items**.  

We created multiple files for the items feature, each handling a specific  
layer of the application logic:  

- **`Handler.js`** 🛣️  
  This is the routes handler (or route definitions).  
  It’s a Fastify plugin that declares the actual routes/endpoints for the  
  items API. It maps URL paths + HTTP methods to controllers and schemas.  

- **`Controller.js`** 🎛️  
  Contains functions that handle incoming requests for items.  
  Controllers act as intermediaries between the HTTP layer and the business  
  logic. Each function typically corresponds to an endpoint  
  (e.g. `getItems`, `getItem`, `addItem`).  

  The controller parses request data, calls the appropriate service function,  
  and formats the response (or handles errors).  

- **`Services.js`** 🧩  
  Holds the business logic for items. Services know how to manipulate data,  
  independent of HTTP or Fastify.  
  Example: find item by ID, add a new item, delete an item.  

  This separation makes testing/maintenance easier – later you can replace  
  the in-memory service with DB calls without changing controllers.  

- **`Schema.js`** 📐  
  Defines the validation schemas for our routes (JSON Schema format).  
  Fastify uses them for:  
  - validating incoming data  
  - auto-generating documentation  

  Example:  
  - `POST /items` requires a body with a `name` (string)  
  - a successful response returns an object of type `Item`.  

  Fastify enforces these rules automatically → more robust, self-documented code.  

---

### `test.http` 🧪  
Not a code module, but a helper file with example HTTP requests for testing.  
Often used with the VSCode REST Client extension or curl.  

It can include sample `GET`, `POST`, `PUT`, `DELETE` requests to quickly test  
API endpoints during development.  

---

### Other files 📄  

- **`package.json` / `package-lock.json`**  
  Already discussed – they track dependencies and lock versions.  

- **`.env` (optional)**  
  Used with `dotenv` to load environment variables.  
  Example:  
```

PORT=5000
DATABASE\_URL=postgres\://...

```

This file should not be committed to version control if it contains secrets  
(add it to `.gitignore`). It’s very useful for managing configs per  
environment (development vs production).  

---

## Best Practices Reflected in This Structure ✅

- **Separation of Concerns**:  
Each file/module has a clear responsibility. Routes ≠ logic ≠ data.  
Easier to navigate and maintain.  

- **Encapsulation and Reusability**:  
Route plugins (like `Handler.js`) can be reused under different prefixes  
(e.g. for versioning). Services can be reused in other parts of the app.  

- **Clarity**:  
A new developer (or you later) can quickly see where routes, logic, and data  
live, without one giant file.  

- **Scalability**:  
Adding new features is easy. For example, a `users` resource would add:  
- `routes/usersHandler.js`  
- `routes/usersController.js`  
- `routes/usersService.js`  
- `routes/usersSchema.js`  

The structure grows modularly instead of turning into a monolith.  

- **Use of JSON Schema**:  
Validating all API inputs is best practice. Fastify does this automatically  
and even generates docs from schemas.  

- **Environment Configuration**:  
Using `.env` + `dotenv` is best practice for configs.  
You can change ports, DB credentials, etc. without touching code.  

---

By following these practices, you’ll build faster and have confidence that the  
project stays **organized and maintainable**.  

👉 Next, let's dive into the code to see how everything is implemented.  


## Fastify Basics in Code: Routes, Handlers, and Plugins ⚡

Before going through our project’s code step by step, it’s important to  
understand how Fastify lets us define routes and what the lifecycle looks like.  

Below is a simple example (not from our project, but to illustrate the basics):

```js
// Require or import Fastify
import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

// Declare a route
fastify.get('/hello', async (request, reply) => {
  // This is a route handler function
  // You can access request.params, request.query, request.body here
  reply.send({ greeting: 'Hello World' });  // Send a JSON response
});

// Run the server
fastify.listen({ port: 3000, host: '0.0.0.0' }, err => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log('Server listening on port 3000');
});
````

---

### Key Takeaways from This Snippet 🌐

* We created a Fastify instance.
* We used `fastify.get()` to register a route.
* The first argument is the URL path (`/hello`).
* The second argument is the handler function.
* Inside the handler, we used `reply.send()` to return JSON.
* Fastify automatically sets:

  * `Content-Type: application/json`
  * Status code `200 OK` (unless changed).

---

### Request & Response in Handlers 📩📤

* **Handler function**:
  Can be synchronous or `async`.

  * In an `async` handler, you can simply `return { ... }` an object.
    Fastify serializes it to JSON automatically.
  * In a non-async handler, use `reply.send()`.

* **Request object** (`request`) provides:

  * `request.params` → route parameters
  * `request.query` → query string values
  * `request.body` → JSON body payload
    Example: `request.params.id` gives the `:id` part of `/items/:id`.

* **Reply object** (`reply`) controls the response:

  * `reply.header('X-Custom', 'value')` → set headers
  * `reply.code(201)` → set status code
  * `reply.send(data)` → send payload
  * `reply.type('application/json')` → set content type

  In many cases, just `reply.send()` or `return {}` is enough.

---

### Efficiency and Validation ⚡

Fastify is very efficient in serialization and validation.
If you attach a **schema** to a route:

* Fastify validates `request.body` against it *before* handler runs.
* Fastify can also validate the **response**.

This ensures:

* Inputs are correct before business logic executes.
* Outputs match expectations.

---

### Two Ways to Define Routes 🛣️

1. **Inline route definitions**:
   Use methods like `fastify.get()`, `fastify.post()`, etc.

2. **Plugin-based routes**:
   Use `fastify.register()` to load a plugin that declares routes.

👉 In our project, we use **plugin-based routes** for better organization.

---

### Plugin Approach 🧩

A plugin is essentially an async function that takes:

* a Fastify instance
* options

Inside, you can declare routes.

Example:

* In `itemsHandler.js`, we define a plugin with all item-related routes.
* In `app.js`, we register it via `fastify.register(itemRoutes)`.

Benefits:

* Logical grouping of routes
* Can mount plugins under different prefixes
* Can enable/disable entire route sets easily

---

### Encapsulation in Plugins 🔒

Fastify plugins run in an **encapsulated context**.

* Code (hooks, decorators, routes) in a plugin affects only that plugin.
* By default, one plugin cannot interfere with another.

If needed, encapsulation can be broken using `fastify-plugin` to make things
global. But by default, this isolation prevents accidental side-effects.

Example:

* An auth plugin decorates `request` with a `user` object (after JWT check).
* Only routes inside that plugin are affected.

In our small project, this isn’t critical.
But in larger apps, encapsulation helps maintain modularity.

---

👉 With these basics in mind, let’s go through what we implemented in the
project and how it works.

## Walkthrough: Building the Items API Project 🗂️

Let's step through each part of the project code to understand how everything  
connects. This will also reinforce how Fastify is being used in practice,  
following the structure we outlined.  

---

### 1. The Data Layer (`data/items.js`) 📊

(We assume the content of `items.js` for explanation, as it wasn’t explicitly  
shown above.)  

In `data/items.js`, we likely have something like:  

```js
export const items = [
  { id: "1", name: "Item One" },
  { id: "2", name: "Item Two" },
  { id: "3", name: "Item Three" }
];
````

This is a simple array of item objects to get us started.

* Each item has an **id** (string) and a **name**.
* In a real app, this data might come from a database.
* Here, we hard-code a few items as initial data.

We export this array so it can be accessed and modified by our service functions.

---

### 2. The Service Layer (`routes/itemsServices.js`) 🔧

The services file implements functions to manipulate the data.
Here’s what it contains (simplified):

```js
import { items } from "../data/items.js";
import { v4 as uuidv4 } from "uuid";

// Get all items
export function getAll() {
  return items;
}

// Find an item by id
export function findId(id) {
  return items.find(item => item.id === id);
}

// Add a new item
export function add(name) {
  const item = { id: uuidv4(), name };
  items.push(item);
  return item;
}

// Remove an item by id
export function remove(id) {
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  // splice returns removed elements; [0] gives the removed item
  return items.splice(index, 1)[0];
}

// Update an item by id
export function update(id, name) {
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index].name = name;
  return items[index];
}
```

---

### What’s Happening Here? 🛠️

We import the `items` array and the `uuidv4` function from the `uuid` library.
The service provides five functions:

1. **`getAll()`** → returns the entire list of items.
2. **`findId(id)`** → searches `items` for a matching id.

   * Returns the item object if found.
   * Returns `undefined` if not found (controller handles "not found").
3. **`add(name)`** → creates a new item with a unique id (via `uuidv4()`)
   and the given name, pushes it into the array, and returns the new item.
4. **`remove(id)`** → finds an item by id, removes it if found, and returns it.

   * If no item is found, returns `null`.
   * Using `null` is intentional → easy for controller to check failure.
5. **`update(id, name)`** → finds an item by id, updates its name if found,
   and returns the updated item.

   * If not found, returns `null`.

---

### Why a Service Layer? 🔑

This service layer **abstracts the data handling**.

* If later we switch to a real database, we can rewrite these functions to
  query the DB.
* Controllers (and thus API behavior) stay the same.
* Keeps business logic separate from Fastify’s HTTP handling.
* Improves **testability** and **maintainability**.

---
## 3. The Schema Definitions (`routes/itemsSchema.js`) 📐

The `itemsSchema.js` file defines the JSON schemas for the items API.  

It looks like this:  

```js
const Item = {
  type: "object",
  properties: {
    id:   { type: "string" },
    name: { type: "string" }
  },
  required: ["id", "name"]  // ensure an Item has both id and name
};

export const getItemsSchema = {
  response: {
    200: {
      type: "array",
      items: Item
    }
  }
};

export const getItemSchema = {
  response: {
    200: Item
  }
};

export const addItemSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" }
    }
  },
  response: {
    201: Item
  }
};

export const deleteItemSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
};

export const updateItemSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" }
    }
  },
  response: {
    200: Item
  }
};
````

---

### Breaking This Down 🛠️

* **Reusable `Item` schema**:

  * Object with `id` (string) and `name` (string).
  * Both are required.

* **`getItemsSchema`**:

  * `GET /items` → 200 response is an array of `Item`s.

* **`getItemSchema`**:

  * `GET /items/:id` → 200 response is a single `Item`.

* **`addItemSchema`**:

  * Request body must include a required `name` (string).
  * Response `201` → returns an `Item`.
  * Invalid body → automatic `400 Bad Request`.

* **`deleteItemSchema`**:

  * No request body.
  * Response `200` → object with a `message` string.

* **`updateItemSchema`**:

  * Request body must include required `name` (string).
  * Response `200` → updated `Item`.

---

### Why Schemas? ✅

* **Validation**:
  Clients sending wrong input (missing or wrong type) get a `400` with
  an automatic validation error — no custom logic required.

* **Documentation**:
  Fastify + Swagger use schemas to auto-generate API docs.

* **Reliability**:
  Validates both requests *and* responses. Ensures service returns what
  we expect.

* **Developer Experience**:
  Errors are caught early with clear messages.

---

## 4. The Controller Layer (`routes/itemsController.js`) 🎛️

The controller imports service functions and defines what to do for each route:

```js
import * as services from "./itemsServices.js";

export async function getItems(req, reply) {
  const allItems = services.getAll();
  reply.send(allItems);
}

export async function getItem(req, reply) {
  const { id } = req.params;
  const item = services.findId(id);
  if (!item) {
    return reply.code(404).send({ message: `Item ${id} not found` });
  }
  reply.send(item);
}

export async function addItem(req, reply) {
  const { name } = req.body;
  const newItem = services.add(name);
  reply.code(201).send(newItem);
}

export async function deleteItem(req, reply) {
  const { id } = req.params;
  const deletedItem = services.remove(id);
  if (!deletedItem) {
    return reply.code(404).send({ message: `Item ${id} not found` });
  }
  reply.send({ message: `Item ${id} has been removed` });
}

export async function updateItem(req, reply) {
  const { id } = req.params;
  const { name } = req.body;
  const updatedItem = services.update(id, name);
  if (!updatedItem) {
    return reply.code(404).send({ message: `Item ${id} not found` });
  }
  reply.send(updatedItem);
}
```

---

### Examining the Controllers 🛠️

* **`getItems`**:
  Calls service → `getAll()`. Sends array of items.
  Marked `async` for consistency (even without `await`).

* **`getItem`**:

  * Extracts `id` from `req.params`.
  * If item not found → `404` with message.
  * If found → sends the item object.
  * Uses `return reply.code(...).send(...)` to exit immediately.

* **`addItem`**:

  * Extracts `name` from `req.body`.
  * Calls service → `add(name)`.
  * Sends back the new item with `201 Created`.

* **`deleteItem`**:

  * Takes `id` from params.
  * Calls service → `remove(id)`.
  * If not found → `404`.
  * If found → returns `{ message: "Item ... has been removed" }`.

* **`updateItem`**:

  * Takes `id` and new `name`.
  * Calls service → `update(id, name)`.
  * If not found → `404`.
  * If found → sends updated item with `200 OK`.

---

### Why Keep Controllers Simple? 🎯

* **Flow**: get input → call service → handle result → send output.
* **Minimal logic**: No heavy lifting in controllers.
* **Services handle business logic** → controllers just orchestrate.
* **Easier to test**: Simple, predictable, and less error-prone.

---

## 5. The Route Definitions (`routes/itemsHandler.js`) 🛣️

Now we tie the **schemas** and **controllers** together in the  
route definitions file:  

```js
import * as controller from "./itemsController.js";
import * as schema from "./itemsSchema.js";

export async function itemRoutes(fastify, options) {
  // Get all items
  fastify.route({
    method: "GET",
    url: "/items",
    schema: schema.getItemsSchema,
    handler: controller.getItems
  });

  // Get single item
  fastify.get("/items/:id", { schema: schema.getItemSchema }, controller.getItem);

  // Add item
  fastify.post("/items", { schema: schema.addItemSchema }, controller.addItem);

  // Delete item
  fastify.delete("/items/:id", { schema: schema.deleteItemSchema }, controller.deleteItem);

  // Update item
  fastify.put("/items/:id", { schema: schema.updateItemSchema }, controller.updateItem);
}
````

---

### How `itemRoutes` Works ⚙️

We export an async function `itemRoutes` which takes:

* `fastify` → the Fastify instance
* `options` → plugin options (unused here, but part of the signature)

This function registers several routes on the Fastify instance.

We demonstrate **two ways** to define routes:

1. `fastify.route({...})` → full config object
   (`method`, `url`, `schema`, `handler`)
2. Shorthand methods → `fastify.get()`, `fastify.post()`, etc.

---

### Each Route Includes 📑

* **HTTP method and URL**

  * All prefixed with `/items`.
  * Routes that act on a specific item use `:id`.
  * Fastify makes `:id` available as `req.params.id`.

* **Schema** (from `itemsSchema.js`)

  * Attaches validation + response schema.
  * Example: `getItemSchema` ensures the response is a valid `Item`.
  * Schemas also feed into Swagger docs.

* **Handler function** (from `itemsController.js`)

  * We pass a reference (not calling it directly).
  * Fastify calls it when the route is hit.

---

### Why a Plugin? 🚀

`itemRoutes` is a **Fastify plugin** that encapsulates all
item-related endpoints.

* Not active until registered in the main app.
* Keeps routes modular + reusable.
* Could be registered with a prefix:

```js
fastify.register(itemRoutes, { prefix: "/items" });
```

Inside the plugin, routes could then use `/` instead of `/items`.

👉 Using a prefix reduces repetition, but the explicit approach
is also easy to read.

---

## 6. Building the App (`app.js`) ⚙️

The `app.js` is where we create the Fastify instance and register
all plugins (internal + external):

```js
import Fastify from "fastify";
import swagger from "@fastify/swagger";
import { itemRoutes } from "./routes/itemsHandler.js";

export async function buildApp() {
  const fastify = Fastify({ logger: true });

  // Register Swagger (OpenAPI) plugin with UI enabled
  await fastify.register(swagger, {
    mode: "dynamic", // generate OpenAPI spec dynamically from schemas
    openapi: {
      info: {
        title: "Items API",
        description: "API documentation for items",
        version: "1.0.0"
      }
    },
    exposeRoute: true,
    routePrefix: "/docs",
    staticCSP: false
  });

  // Register our routes plugin
  await fastify.register(itemRoutes);

  return fastify;
}
```

---

### Breaking Down `buildApp()` 📑

1. **Create Fastify instance**

   * `Fastify({ logger: true })`
   * Enables built-in logging → colored logs, request info, errors.

2. **Register Swagger plugin**

   * Generates OpenAPI spec from route schemas.
   * `mode: "dynamic"` → builds spec on the fly.
   * `openapi.info` → metadata (title, description, version).
   * `exposeRoute: true` → exposes docs endpoints.
   * `routePrefix: "/docs"` → UI available at `/docs`.
   * `staticCSP: false` → avoid CSP issues with UI assets.

   👉 Result: `http://localhost:5000/docs` shows Swagger UI,
   with all routes, schemas, and live testing.

3. **Register our own plugin**

   * `await fastify.register(itemRoutes)`
   * Adds all item routes.

4. **Return the app**

   * Allows reuse in `server.js` (to start) or in tests.
   * Common best practice → separate app setup from startup.

---

### Why Use `buildApp`? 🚀

* **Separation of concerns**: config here, startup in `server.js`.
* **Flexibility**: can build app for testing without listening on a port.
* **Best practice**: easier to extend and maintain.

---

## 7. Starting the Server (`server.js`) 🚀

This is the simplest piece, but critical:  

```js
import { buildApp } from "./app.js";
import "dotenv/config";  // This loads environment variables from .env

const fastify = await buildApp();  // build the app (plugins, routes, etc.)

const fastifyOpts = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || "0.0.0.0"
};

const start = async () => {
  try {
    // Start listening on the configured host and port
    await fastify.listen(fastifyOpts);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
````

---

### What This Does ⚙️

* **Imports `buildApp`** from `app.js` → builds the Fastify instance
  (with plugins + routes).

* **Imports `"dotenv/config"`** → automatically loads `.env` into
  `process.env`.

  * Example: if `.env` has `PORT=8080`, then `process.env.PORT = "8080"`.
  * No need to manually call `dotenv.config()`.

* **Builds the app**: `await buildApp()` returns our configured Fastify app.

* **Defines `fastifyOpts`**:

  * `port`: from env var, default `5000`.
  * `host`: from env var, default `"0.0.0.0"`.

    * `0.0.0.0` makes the server accessible externally (needed for
      Docker/cloud).
    * `127.0.0.1` would limit it to localhost only.

* **Defines `start()` function**:

  * Calls `fastify.listen(fastifyOpts)`.
  * In Fastify v4+, `.listen()` returns a promise when given an object,
    so we `await` it.
  * Starts Node’s HTTP server under the hood.

* **Error handling**:

  * If the port is busy or permission is denied → error is caught.
  * Logs error with `fastify.log.error`.
  * Exits process with failure code.

* **Calls `start()`** to launch the server.

---

### Running the Server 📡

* `npm run dev` → auto-reload (via `nodemon`).
* `npm start` → production start.

Fastify logs will appear, e.g.:

```json
{"level":30,"time":...,"pid":...,"hostname":"...","msg":"Server listening at http://0.0.0.0:5000"}
```

At this point, the API is live! 🎉

---

## 8. Trying Out the API (Manual Testing) 🧪

With the server running (default port `5000` or from `.env`),
we can test endpoints using:

* Browser (for simple `GET`),
* `curl`,
* Postman/Insomnia,
* or the provided `test.http`.

---

### Get all items

```http
GET http://localhost:5000/items
```

Response (example):

```json
[
  { "id": "1", "name": "Item One" },
  { "id": "2", "name": "Item Two" },
  { "id": "3", "name": "Item Three" }
]
```

If no seed data, returns `[]`.

---

### Get a single item

```http
GET http://localhost:5000/items/3
```

If found:

```json
{ "id": "3", "name": "Item Three" }
```

If not found:

```json
{ "message": "Item 3 not found" }
```

---

### Add a new item

```http
POST http://localhost:5000/items
Content-Type: application/json

{ "name": "Jerome" }
```

Response (201 Created):

```json
{ "id": "f42bc39c-3264-4ce5-9c58-830c53dec0cc", "name": "Jerome" }
```

If missing or invalid `name` → `400 Bad Request` (schema validation).

---

### Delete an item

```http
DELETE http://localhost:5000/items/f42bc39c-3264-4ce5-9c58-830c53dec0cc
```

If found + deleted:

```json
{ "message": "Item f42bc39c-3264-4ce5-9c58-830c53dec0cc has been removed" }
```

If not found:

```json
{ "message": "Item <id> not found" }
```

---

### Update an item

```http
PUT http://localhost:5000/items/2
Content-Type: application/json

{ "name": "Updated Item Two" }
```

If found:

```json
{ "id": "2", "name": "Updated Item Two" }
```

If not found:

```json
{ "message": "Item 2 not found" }
```

If body missing `name` → `400 Bad Request`.

---

### Summary ✅

Our API now supports **full CRUD**:

* **Create** → `POST /items`
* **Read** → `GET /items`, `GET /items/:id`
* **Update** → `PUT /items/:id`
* **Delete** → `DELETE /items/:id`

Schemas ensure correctness with proper validation + status codes.

## 9. Swagger UI – Interactive API Docs 📖

Since we included the Swagger plugin, we have automatic API docs available.  
Visit:

👉 [http://localhost:5000/docs](http://localhost:5000/docs)  

You’ll see a **Swagger UI page** listing endpoints like:  
- `GET /items`  
- `GET /items/{id}`  
- `POST /items`  
- `DELETE /items/{id}`  
- `PUT /items/{id}`  

Each endpoint shows:  
- Parameters  
- Request body schema  
- Response schema  

For example:  
- `POST /items` → expects a body with `name` (string).  
- Returns an `Item` object with `id` and `name`.  

Swagger UI also supports **"Try it out"**:  
- Expand an endpoint  
- Fill in params/body  
- Execute directly in browser  
- See server response immediately  

---

### Why Swagger UI? ✅

- Docs generated **from code** (schemas).  
- Always **up-to-date**: change schemas → docs update on restart.  
- Great for **exploratory testing**.  
- Useful for **frontend devs / other services**.  

👉 Having interactive API docs is considered a **best practice** for  
public or team APIs.  

---

## 10. Fastify Plugin System in Our Project 🔌

We leveraged Fastify’s **plugin system** in multiple ways:  

### 1. Registering built-in / third-party plugins
Example:  

```js
await fastify.register(swagger, { ... })
````

* Plugins enhance the server by adding:

  * Routes
  * Decorators
  * Tools

Swagger plugin → added `/docs` routes + spec generation.

If we used a DB, we’d register a DB plugin similarly.

---

### 2. Creating our own plugin

* `itemRoutes` in `itemsHandler.js` is our **custom plugin**.
* Loaded with:

```js
await fastify.register(itemRoutes)
```

* Encapsulates all **item routes**.
* Keeps `app.js` clean (no need to list every single route inline).

---

### 3. Encapsulation

* `itemRoutes` was registered at the top level → routes live globally.
* We could have multiple route plugins with separate scopes (e.g.,
  authentication).
* `fastify.register` = the main way to modularize an app.

---

### Why Plugins? ✅

* Achieve **modular architecture**.
* Easier to enable/disable features.
* Test pieces in isolation.
* Organize code logically.

Fastify encourages building apps from **small, composable plugins**.

---

## 11. Integrating a Database (Fastify + SQLite Example) 🗄️

So far we used an in-memory array.
For persistence, we’d use a database (SQLite in this case).

Fastify can integrate with **any database** via clients or ORMs.

---

### Example: SQLite with `fastify-sqlite`

1. **Install dependencies**

```bash
npm install fastify-sqlite sqlite3
```

---

2. **Register plugin in `app.js`**

```js
import fastifySqlite from "fastify-sqlite";

await fastify.register(fastifySqlite, {
  dbFile: "mydb.sqlite",   // SQLite database file
  promiseApi: true         // use Promise-based API
});
```

* Opens/creates `mydb.sqlite`.
* Attaches client to `fastify.sqlite`.

---

3. **Using the database**

* Select all items:

```js
const rows = await fastify.sqlite.all("SELECT * FROM items");
```

* Insert a new item:

```js
const { lastID } = await fastify.sqlite.run(
  "INSERT INTO items(name) VALUES(?)",
  [name]
);
```

---

### Updating Our Service Layer

Instead of array operations:

* `services.add` → `INSERT` SQL
* `services.findId` → `SELECT ... WHERE id = ?`
* Functions become `async`.
* Adjust schemas if needed (e.g., `id` could be numeric).

Controllers + routes remain almost unchanged.

---

### General Notes 🔑

* Fastify has plugins for PostgreSQL, MySQL, MongoDB, etc.

* Pattern is similar:

  * Register plugin with connection options
  * Use decorated client (`fastify.pg`, `fastify.mongo`, etc.)

* Plugins separate concerns:

  * DB connection is managed by Fastify.
  * Routes/services just **use it**.

👉 In our project we stuck with in-memory, but switching to SQLite
would be only a few lines of code.

---
## 12. Other Best Practices and Considerations ⚙️

To wrap up the tutorial, here are extra **best practices** and tips for  
building backends with **Fastify** (and Node.js in general):  

---

### Error Handling ⚠️
- We handled simple 404s.  
- For other errors → Fastify sends `500` by default.  
- Add a global handler with `fastify.setErrorHandler`.  
- Ensure errors don’t leak stack traces or sensitive info → return only  
  safe messages/codes.  

---

### Validation Everywhere ✅
- We validated **JSON bodies**.  
- You can also validate **params** and **query strings** with schemas.  
- Example:  

```js
querystring: {
  limit: { type: "integer" }
}
````

* Wrong type → Fastify auto-rejects request.
* Consistent validation = stable + secure server.

---

### Authentication & Security 🔐

* Real APIs often need **auth**: JWT, sessions, etc.
* Plugins: `@fastify/jwt` for JWT.
* Use **hooks** (`onRequest`, `preHandler`) for auth checks.
* Example: verify JWT → `request.user = decoded`.
* Larger projects (like Transcendence) need login, sessions, 2FA.

---

### Logging 📝

* We enabled Fastify’s built-in logger (**Pino**).
* Good for debugging + production monitoring.
* Outputs JSON logs (machine-readable) or pretty logs in dev.
* Avoid logging sensitive data.
* Adjust log levels + serializers as needed.

---

### Environment & Config ⚙️

* Use `.env` for **PORT**, **HOST**, DB configs, API keys, etc.
* Use `process.env.NODE_ENV` to distinguish dev vs prod.

  * Dev: verbose logging, Swagger enabled.
  * Prod: stricter settings.

---

### Folder Structure 🗂️

Two main approaches:

1. **By layer (our example)**:

```
routes/
  itemsHandler.js
  itemsController.js
  itemsService.js
  itemsSchema.js
```

2. **By feature/domain**:

```
src/
  items/
    controller.js
    service.js
    schema.js
    routes.js
  users/
    controller.js
    service.js
    schema.js
    routes.js
  plugins/
    db.js
    auth.js
  app.js
  server.js
```

👉 Both are fine. Pick one and stay consistent.

---

### Reusable Components 🔄

* Abstract repeated logic into **decorators** or **utils**.
* Example: decorate `reply.notFound()` for consistent 404s.
* Create shared plugins (e.g., DB, auth) for reuse.

---

### Testing 🧪

* Use `fastify.inject()` to simulate HTTP requests without starting server.
* Works great for unit + integration tests.
* Combine with Jest/Mocha.
* Our `buildApp` function makes test setup easy.

---

### Performance Considerations ⚡

* Avoid blocking operations.
* Fastify already supports keep-alive/pipelining.
* For scaling: run multiple processes (Node cluster or PM2).
* For learning/dev → 1 instance is fine.

---

### Keep Dependencies Updated 📦

* Fastify is actively maintained.
* Watch for new releases + migration guides (e.g., v5 → v6).
* Regularly update dependencies for fixes + security.

---

### Swagger (OpenAPI) Use 📖

* Export OpenAPI spec JSON.
* Share with frontend teams.
* Use tools to auto-generate client code or TypeScript types.

---

### Static Files / Frontend Integration 🌐

* Fastify can serve static assets with `@fastify/static`.
* Useful if bundling API + SPA in same service.
* Often, frontend is deployed separately, but option exists.

---

### Graceful Shutdown 📴

* In production, handle **SIGINT/SIGTERM**.
* Call `fastify.close()` to stop accepting requests and finish ongoing ones.
* Our script exits immediately (Ctrl+C). Refine for production.

---

### Takeaway 🎯

* Use clean structure.
* Validate all inputs.
* Leverage plugins, schemas, and hooks.
* These practices become second nature as you build more.

---

## Designing API Endpoints for a Real Project (Example: Transcendence) 🎮

Let’s apply the lessons to a real project: **Transcendence**
(42’s online Pong game with chat + social features).

---

### User Authentication & Management

**POST /auth/register**

* Create new account.
* Body: `{ username, password, email }`.
* Controller: hash password, store in DB.
* Response: user profile (without password).
* Schema ensures username uniqueness + email format.

**POST /auth/login**

* Authenticate with username/email + password.
* Verify credentials in DB.
* On success: issue JWT or session cookie.
* Response: token or session info.
* On failure: `401 Unauthorized`.

**GET /users/me**

* Get current authenticated user.
* Requires token.
* Implemented with JWT verification hook.

**PUT /users/me**

* Update profile settings (avatar, display name, 2FA setup).
* Validate input via schema.
* Service updates DB.

**GET /users/\:id**

* View another user’s public profile.
* Could show stats like game score.
* Controller fetches from DB.
* May require auth if sensitive.

---

### Fastify Implementation 🔌

* Create `usersRoutes` plugin with these endpoints.
* Separate `usersController` and `usersService`.
* Use `@fastify/jwt` for token handling.
* Decorate Fastify with `authenticate` method for protected routes.
* Add `usersSchema.js` for request/response validation.
* Hash passwords (e.g., with `bcrypt`).
* 2FA support: additional endpoints like:

  * `POST /auth/2fa/enable`
  * `POST /auth/2fa/verify`

---

👉 The same principles from the items API scale up:
clear endpoints, validation, controllers/services separation,
and plugins for modular design.

---
## Friend Management and Social Features 🤝

### Endpoints

**POST /friends/:userId**  
- Send a **friend request** to user `:userId`.  
- Service creates a **pending request** entry in DB.  

**POST /friends/:userId/accept**  
- Accept a **friend request** from `:userId`.  
- Service updates relationship → friends.  

**GET /friends**  
- List your friends.  
- Could be part of `GET /users/me` or separate route.  

**Optional:**  
- `DELETE /friends/:userId` → remove friend.  
- `GET /friends/requests` → list pending requests.  

### Fastify Implementation

- Group into `friendsRoutes` or `usersRoutes`.  
- All routes require **auth** → `authenticate` pre-handler.  
- Controllers call services to enforce logic:  
  - e.g. cannot accept non-existent requests.  
- Schemas validate `:userId` (UUID format, etc.).  

---

## Game Matchmaking and Gameplay 🏓

### Endpoints

**POST /matches**  
- Start a match (with opponent or queue).  
- Server creates match record → returns details.  

**GET /matches/:id**  
- Fetch details of ongoing/finished match  
  (players, score, status).  

**POST /matches/:id/actions**  
- Send player actions (like paddle move).  
- ⚠️ Better over **WebSockets** for real-time.  
- REST fallback = repeated POSTs (inefficient).  

**GET /matches/history**  
- List past matches (per user or leaderboard).  

### Fastify Implementation

- Use REST for setup (`/matches`, `/history`).  
- Use **WebSockets** for live game:  

```js
fastify.register(import('@fastify/websocket'))

fastify.get('/play', { websocket: true }, (conn, req) => {
  // manage game state + broadcast to players
})
````

* Controllers + services manage match lifecycle:

  * create, join, update score, end.
* Store match state in **DB or memory**.
* Secure endpoints → only participants can update.

---

## Chat System (Channels & Direct Messages) 💬

### Endpoints

**GET /channels**

* List channels (global or user-specific).

**POST /channels**

* Create a new channel.

**GET /channels/\:id/messages**

* Fetch recent messages in a channel.

**POST /channels/\:id/messages**

* Send a message to a channel.

**GET /users/\:id/messages**

* Get DM thread with user.

**POST /users/\:id/messages**

* Send DM.

### Fastify Implementation

* Real-time chat → **WebSockets** recommended.
* REST endpoints handle history + message posting.
* Server broadcasts via WS to subscribed clients.
* Without WS → clients poll `GET messages`.
* Controllers enforce permissions (e.g., only members can post).
* Services handle DB storage/retrieval.
* Schemas validate messages (not empty, length limit).

---

## Two-Factor Authentication (2FA) 🔐

### Endpoints

**POST /auth/2fa/setup**

* Generate TOTP secret.
* Return secret or URI (frontend can generate QR).

**POST /auth/2fa/verify**

* Verify entered code.
* On success → activate 2FA.

### Integration

* During login:

  * If user has 2FA enabled → respond "need 2FA code".
  * Separate verify step finalizes login.

### Fastify Implementation

* Use **TOTP library** in service layer.
* Controller ensures user is authenticated before setup.
* JWT token may include 2FA status.
* Schemas validate codes (6-digit strings).

---

## General Patterns Across Features 🔄

* Separate **routes, controllers, services, schemas**.
* Use **plugins** for auth, DB, and WS.
* Secure routes with `authenticate` pre-handler.
* Real-time → prefer **WebSockets** over REST polling.
* Ensure concurrency + consistency (transactions, checks).

---

## Suggested Development Order 🛠️

1. ✅ Basic server (done).
2. 🔐 Authentication (JWT, 2FA).
3. 👤 User management.
4. 🤝 Friends system.
5. 💬 Chat system.
6. 🏓 Game matchmaking + gameplay.
7. 📊 Extras (leaderboard, stats).

---

## Key Practice 🎯

* Keep Swagger docs updated.
* Write tests (unit + integration).
* Build modularly → each feature isolated + pluggable.
* Think security + scalability from start.

## Conclusion 🎯

In this guide, we’ve covered how to build a complete Node.js backend  
using **Fastify** – from the basics of APIs, through server setup,  
to a full CRUD API with validation + Swagger docs.  
We also saw how to scale these ideas to a bigger project  
(like **Transcendence** with real-time features).  

---

### 🔑 Recap of Key Points

- **Fastify vs Express**  
  - Both let you build APIs in Node.js.  
  - Fastify is faster + has modern features (schemas, plugins).  
  - Express = classic ecosystem, Fastify = future-proof foundation.  

- **Project Setup**  
  - Used `npm` for deps + scripts.  
  - Clear folder structure:  
    - server setup, routes, controllers, services, schemas.  
  - → Easier maintenance + collaboration.  

- **Routing + Handlers**  
  - Defined routes via inline + plugin approach.  
  - Handlers process requests + send responses.  
  - Used **async/await** + `reply.send()`.  
  - Schemas → validation + auto-docs.  

- **Swagger Integration**  
  - Added with a few lines.  
  - `/docs` → live, interactive API docs.  
  - Fastify auto-generates docs from schemas.  

- **State Management**  
  - Example used in-memory array.  
  - Swappable with real DB (SQLite, Postgres, etc.).  
  - Services abstract data → minimal changes needed.  

- **Best Practices**  
  - Use correct HTTP codes (200, 201, 404…).  
  - Validate all inputs.  
  - Don’t expose stack traces to clients.  
  - Use `.env` for configs.  
  - Write modular, reusable code.  

- **Scaling to Real Projects**  
  - Same principles apply to complex apps.  
  - Break features into:  
    - routes → controllers → services → schemas.  
  - Example: auth, friends, chat, game, etc.  
  - Build step by step, plug into Fastify plugins.  

---

### 🚀 Next Steps

- Explore more **Fastify plugins**:  
  - CORS, rate-limit, file uploads, auth, etc.  
- Learn **testing** with `fastify.inject()` + Jest/Mocha.  
- Deploy: Docker, Heroku, AWS, or bare-metal.  
- Keep **dependencies updated** (Fastify evolves quickly).  

---

### 💡 Final Note

Building a backend isn’t just about code – it’s about designing  
**clean, usable APIs** for clients.  
With Fastify’s speed + developer experience,  
you can ship features fast, test them easily,  
and scale up to real-time, high-throughput apps.  

👉 Once you know the **pattern**, new routes + features  
become almost boilerplate. That’s the power of Fastify.  

               🌐 Client (Browser / App / API Client)
                               │
                               ▼
                       ┌────────────────┐
                       │   Request      │
                       │  (HTTP: GET/   │
                       │   POST/PUT/DEL)│
                       └────────────────┘
                               │
                               ▼
                   ┌──────────────────────┐
                   │   Route Definitions  │
                   │ (Handler.js)    │
                   │  - URL + Method      │
                   │  - Schema validation │
                   │  - Controller call   │
                   └──────────────────────┘
                               │
                               ▼
                   ┌──────────────────────┐
                   │     Controller       │
                   │ (Controller.js) │
                   │  - Parse params/body │
                   │  - Call service      │
                   │  - Handle 404/errors │
                   │  - Send reply        │
                   └──────────────────────┘
                               │
                               ▼
                   ┌──────────────────────┐
                   │      Service         │
                   │ (Services.js)   │
                   │  - Business logic    │
                   │  - CRUD operations   │
                   │  - Calls DB/Data     │
                   └──────────────────────┘
                               │
                               ▼
                   ┌──────────────────────┐
                   │        Data           │
                   │   (Items.js / DB)     │
                   │  - In-memory array    │
                   │  - Or SQLite/Postgres │
                   └──────────────────────┘
                               │
                               ▼
                       ┌────────────────┐
                       │    Response    │
                       │ (JSON + Code)  │
                       └────────────────┘
                               │
                               ▼
                🌐 Sent back to Client 
