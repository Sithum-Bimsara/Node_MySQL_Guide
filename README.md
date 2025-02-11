# Node.js + Express + MySQL: Step-by-Step Guide

This guide will walk you through setting up a **Node.js + Express + MySQL** project from scratch.

---

## **1. Initialize the Project**

1. Open **VS Code** and navigate to the directory where you want to create the project.
2. Run the following command to initialize a **Node.js** project:

   ```sh
   npm init
   ```

3. Follow the prompts and provide the necessary details:
   - Package name: `node_mysql_crud`
   - Version: `1.0.0`
   - Description: `Node_MySQL_CRUD_app`
   - Entry point: `server.js`
   - Author: `Your Name`
   - License: `ISC`

4. Once done, your `package.json` file should look like this:

   ```json
   {
     "name": "node_mysql_crud",
     "version": "1.0.0",
     "description": "Node_MySQL_CRUD_app",
     "main": "server.js",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     "author": "Your Name",
     "license": "ISC"
   }
   ```

---

## **2. Install Dependencies**

Run the following command to install **Express.js**:

```sh
npm install express
```

This will generate a `node_modules` folder and `package-lock.json` file.

---

## **3. Create `server.js` and Setup Express**

Create a new file `server.js` and add the following code:

```js
const express = require("express");

// Initialize Express app
const app = express();

// Define a test route
app.get("/test", (req, res) => {
    res.status(200).send("<h1>Node.js MySQL App</h1>");
});

// Define the port
const port = 8080;

// Start server
app.listen(port, () => {
    console.log("Server Running");
});
```

---

## **4. Run the Server**

Start the server by running:

```sh
node server.js
```

- You should see `Server Running` in the terminal.
- Open a browser and go to: `http://localhost:8080/test`
- You should see **"Node.js MySQL App"** displayed.

---

## **5. Install Nodemon for Auto-Restart**

Stop the server (`CTRL+C`) and install `nodemon`:

```sh
npm install nodemon --save-dev
```

Modify `package.json` by adding a **server script**:

```json
"scripts": {
  "server": "nodemon server.js"
}
```

Now, run the server using:

```sh
npm run server
```

This will restart the server automatically when you make changes.

---

## **6. Setup Environment Variables**

1. Install **dotenv**:

   ```sh
   npm install dotenv
   ```

2. Create a `.env` file in the root directory and add:

   ```ini
   PORT = 8080
   ```

3. Modify `server.js` to use **dotenv**:

   ```js
   const express = require("express");
   const dotenv = require("dotenv");

   // Configure dotenv
   dotenv.config();

   // Initialize Express app
   const app = express();

   // Middleware
   app.use(express.json());

   // Define a test route
   app.get("/test", (req, res) => {
       res.status(200).send("<h1>Node.js MySQL App</h1>");
   });

   // Define port from .env
   const port = process.env.PORT || 8000;

   // Start server
   app.listen(port, () => {
       console.log(`Server Running on port ${process.env.PORT}`);
   });
   ```

---

## **7. Setup MySQL Database**

1. Open **MySQL Workbench** and run the following SQL script:

   ```sql
   CREATE DATABASE IF NOT EXISTS students_db;
   USE students_db;

   CREATE TABLE IF NOT EXISTS students (
       id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
       name VARCHAR(450),
       roll_no INT,
       fees INT,
       class INT,
       medium VARCHAR(45)
   );

   INSERT INTO students (name, roll_no, fees, class, medium) VALUES
   ('John Doe', 101, 5000, 10, 'English'),
   ('Jane Smith', 102, 5500, 10, 'English'),
   ('Ali Khan', 103, 6000, 11, 'Urdu');
   ```

2. Verify with:

   ```sql
   SELECT * FROM students;
   ```

---

## **8. Configure MySQL Connection**

1. Create a `config` folder inside the project root.
2. Inside `config`, create a `db.js` file and add:

   ```js
   const mysql = require("mysql2/promise");
   const dotenv = require("dotenv");

   // Load environment variables
   dotenv.config();

   // Create connection pool
   const mySqlPool = mysql.createPool({
       host: process.env.HOST,
       user: process.env.USER,
       password: process.env.PASSWORD,
       database: process.env.DATABASE
   });

   module.exports = mySqlPool;
   ```

3. Update `.env` file with database credentials:

   ```ini
   PORT = '8080'
   HOST = 'localhost'
   USER = 'root'
   PASSWORD = 'your_mysql_password'
   DATABASE = 'students_db'
   ```

4. Modify `server.js` to integrate MySQL:

   ```js
   const express = require("express");
   const dotenv = require("dotenv");
   const mySqlPool = require("./config/db");

   // Configure dotenv
   dotenv.config();

   // Initialize Express app
   const app = express();

   // Middleware
   app.use(express.json());

   // Define a test route
   app.get("/test", (req, res) => {
       res.status(200).send("<h1>Node.js MySQL App</h1>");
   });

   // Define port from .env
   const port = process.env.PORT || 8000;

   // Check database connection and start server
   mySqlPool.query('SELECT 1')
       .then(() => {
           console.log('MySQL DB Connected');
           app.listen(port, () => {
               console.log(`Server Running on port ${process.env.PORT}`);
           });
       })
       .catch((error) => {
           console.log(error);
       });
   ```

---

## **9. Run the Server**

Start the backend using:

```sh
npm run server
```

If everything is set up correctly, you should see:

```sh
MySQL DB Connected
Server Running on port 8080
```

# Node.js + MySQL CRUD Operations

## Project Structure

```
NODE+MYSQL+CRUD/
│-- config/
│   ├── db.js
│-- controllers/
│   ├── studentController.js
│-- routes/
│   ├── studentRoutes.js
│-- node_modules/
│-- .env
│-- package.json
│-- package-lock.json
│-- server.js
```



## 10 : Create Controller (`controllers/studentController.js`)
```javascript
const db = require("../config/db");

// GET ALL STUDENTS LIST
const getStudents = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM students');
        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Records found'
            });
        }
        res.status(200).send({
            success: true,
            message: 'All Students Records',
            data
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Student API',
            error
        });
    }
};

// GET STUDENT BY ID
const getStudentsByID = async (req, res) => {
    try {
        const studentId = req.params.id;
        const [data] = await db.query('SELECT * FROM students WHERE id=?', [studentId]);
        if (data.length === 0) {
            return res.status(404).send({ success: false, message: 'No record found' });
        }
        res.status(200).send({ success: true, studentDetails: data[0] });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in Get Student by ID API', error });
    }
};

// CREATE STUDENT
const createStudent = async (req, res) => {
    try {
        const { name, roll_no, fees, grade, medium } = req.body;
        if (!name || !roll_no || !fees || !grade || !medium) {
            return res.status(400).send({ success: false, message: 'Please provide all fields' });
        }
        await db.query('INSERT INTO students (name, roll_no, fees, grade, medium) VALUES (?, ?, ?, ?, ?)', [name, roll_no, fees, grade, medium]);
        res.status(201).send({ success: true, message: 'Student created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in create student API', error });
    }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { name, roll_no, grade, fees, medium } = req.body;
        await db.query('UPDATE students SET name = ?, roll_no = ?, fees = ?, grade = ?, medium = ? WHERE id = ?', [name, roll_no, fees, grade, medium, studentId]);
        res.status(200).send({ success: true, message: 'Student Details Updated' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in Update Student API', error });
    }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        await db.query('DELETE FROM students WHERE id = ?', [studentId]);
        res.status(200).send({ success: true, message: 'Student Deleted Successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Error in Delete Student API', error });
    }
};

module.exports = { getStudents, getStudentsByID, createStudent, updateStudent, deleteStudent };
```

## 11 : Define Routes (`routes/studentRoutes.js`)
```javascript
const express = require('express');
const { getStudents, getStudentsByID, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');

const router = express.Router();

// Routes
router.get('/getall', getStudents);
router.get('/get/:id', getStudentsByID);
router.post('/create', createStudent);
router.put('/update/:id', updateStudent);
router.delete('/delete/:id', deleteStudent);

module.exports = router;
```

## 12 : Configure Server (`server.js`)
```javascript
const express = require("express");
const dotenv = require("dotenv");
const mySqlPool = require("./config/db");

// Configure dotenv
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/student", require("./routes/studentRoutes"));

app.get("/test", (req, res) => {
    res.status(200).send("<h1>Node.js MySQL App</h1>");
});

const port = process.env.PORT || 8000;

// Connect to MySQL and start server
mySqlPool.query('SELECT 1').then(() => {
    console.log('MySQL DB Connected');
    app.listen(port, () => {
        console.log(`Server Running on port ${port}`);
    });
}).catch((error) => {
    console.log(error);
});
```





## Step 13: Start the Server
Run the following command to start your server with **nodemon**:
```sh
npm run server
```

### API Endpoints:
| Method | Endpoint            | Description |
|--------|---------------------|-------------|
| GET    | `/api/v1/student/getall`  | Get all students |
| GET    | `/api/v1/student/get/:id` | Get a student by ID |
| POST   | `/api/v1/student/create`  | Create a new student |
| PUT    | `/api/v1/student/update/:id` | Update a student |
| DELETE | `/api/v1/student/delete/:id` | Delete a student |




