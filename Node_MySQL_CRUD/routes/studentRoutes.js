const express = require('express')
const {getStudents, getStudentsByID, createStudent, updateStudent, deleteStudent} = require('../controllers/studentController')

//router object
const router = express.Router()

//routes

// GET ALL ATUDENTS LIST || GET
router.get('/getall', getStudents )

// GET STUDENTS BY ID
router.get('/get/:id', getStudentsByID)

// CREATE STUDENT || POST
router.post('/create', createStudent)

// UPDATE STUDENT || PUT
router.put('/update/:id', updateStudent)

// DELETE STUDENT || DELETE
router.delete('/delete/:id', deleteStudent)

module.exports = router