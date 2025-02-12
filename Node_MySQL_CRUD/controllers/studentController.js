const db = require("../config/db");

// GET ALL STUDENTS LIST
const getStudents = async (req, res) => {
    try {
        const data = await db.query(' SELECT * FROM students')
        if(!data){
            return res.status(404).send({
                success: false,
                message: 'No Records found'
            })
        }
        res.status(200).send({
            success:true,
            message: 'All Students Records',
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Get All Student API',
            error
        })
    }
};


// GET STUDENTS BY ID
const getStudentsByID = async (req, res) => {
    try {
        const studentId = req.params.id;
        if (!studentId) {
            return res.status(400).send({
                success: false,
                message: 'Invalid or Provide Student id'
            });
        }

        const [data] = await db.query(`SELECT * FROM students WHERE id=?`, [studentId]);

        if (data.length === 0) {  // Check if data is empty
            return res.status(404).send({
                success: false,
                message: 'No record found'
            });
        }

        res.status(200).send({
            success: true,
            studentDetails: data[0]  // Send the first result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Student by id API',
            error
        });
    }
};


// CREATE STUDENT
const createStudent = async (req, res) => {
    try {
        const { name, roll_no, fees, grade, medium } = req.body;
        
        if (!name || !roll_no || !grade || !medium || !fees) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all fields'
            });
        }

        const data = await db.query(
            `INSERT INTO students (name, roll_no, fees, grade, medium) VALUES (?, ?, ?, ?, ?)`,
            [name, roll_no, fees, grade, medium]
        );

        if (!data) {
            return res.status(500).send({
                success: false,
                message: 'Error in Insert Query'
            });
        }

        res.status(201).send({
            success: true,
            message: 'Student created successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in create student API',
            error
        });
    }
};

// UPDATE STUDENT
const updateStudent = async (req,res) => {
    try{
        const studentId = req.params.id
        if(!studentId){
            return res.status(404).send({
                success: false,
                message: 'invalid ID or provide ID'
            })
        }
        const {name, roll_no, grade, fees, medium} = req.body
        const data = await db.query(
            `UPDATE students SET name = ?, roll_no = ?, fees = ?, grade = ?, medium = ? WHERE id = ?`,
            [name,roll_no,fees,grade,medium,studentId])
        if(!data){
            return res.status(500).send({
                success:false,
                message:'Error in Update data',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Student Details Updated'
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: 'Error In Update Student API',
            error
        })
    }
    

};

const deleteStudent = async (req,res) => {
    try{
        const  studentId = req.params.id
        if(!studentId){
            return res.status(404).send({
                success:false,
                message:'Please provide student Id or valid student Id'
            })
        }
        await db.query(`DELETE FROM students WHERE id = ?`, [studentId]);
        res.status(200).send({
            success: true,
            message: "Student Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Delete Student API',
            error
        })
    }
}




module.exports = { 
    getStudents , 
    getStudentsByID, 
    createStudent,
    updateStudent,
    deleteStudent
}