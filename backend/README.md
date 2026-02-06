# Med-Cotton Backend

Med-Cotton is a backend service designed to manage operations related to the medical cotton supply chain, such as inventory management, suppliers, purchase orders, and related workflows.  
This project is built using **Node.js** and follows clean, scalable, and industry-standard backend practices.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB / SQL** (update based on your DB)
- **JWT Authentication**
- **dotenv** for environment variables
- **ESLint & Prettier** for code quality
- **Nodemon** for development

---

## 📁 Project Structure

```text
src/
 ├─ config/         # Database & app configuration
 ├─ controllers/    # Request handlers
 ├─ routes/         # API routes
 ├─ services/       # Business logic
 ├─ models/         # Database models
 ├─ middlewares/    # Auth & error handling
 ├─ utils/          # Helper utilities
 ├─ app.js          # Express app config
 └─ index.js        # Server entry point

tests/              # Unit & integration tests
.env.example        # Environment variable template
.gitignore
README.md
package.json
