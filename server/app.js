const express=require('express');
const sqlite3=require('sqlite3');
const cors=require('cors');
const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));


//connect to db
const db=new sqlite3.Database('./test.db',sqlite3.OPEN_READWRITE,(err)=>{
    if(err){
        return console.log(err);
    }
    console.log('connected to sqlite db successfully');
})

// Create the tasks table
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Tasks table created or already exists.');
    }
});

//get all tasks route
app.get("/all",(req,res)=>{
    let sql=`select * from tasks`;
    db.all(sql,[],(err,rows)=>{
        if(err){
            console.log(err);
            res.status(500).json({error:"error getting task list"});
        }
        else{
            res.status(201).json({tasks:rows});
        }

    })
})

//add new task route
app.post('/new',(req,res)=>{
    const {title,description,date}=req.body;
    let sql=`insert into tasks (title,description,date,status) values(?,?,?,?)`;
    db.run(sql,[title,description,date,"pending"],(err)=>{
        if(err){
            console.log(err);
            return res.status(500).json({ error: 'Failed to add task' });
        }
        else{
            console.log("task added to database");
            res.status(201).json({ id: this.lastID, title, description, date, status: "pending" });
        }
    })
})

//delete a task
app.delete("/delete/:id", (req, res) => {
    try {
      const { id } = req.params; // Destructure to get 'id' directly from req.params
      let sql = `DELETE FROM tasks WHERE id = ?`;
      
      db.run(sql, [id], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error deleting task");
        }
        res.status(200).send(`Task with ID ${id} deleted successfully`);
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  });

//  update task status
app.put('/updateStatus/:id', (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).send('Status is required');
    }
    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
  
    db.run(sql, [status, taskId], function (err) {
      if (err) {
        console.error('Error updating task status:', err);
        return res.status(500).send('Error updating task status');
      }
      if (this.changes === 0) {
        return res.status(404).send('Task not found');
      }
      res.status(200).send({ message: 'Status updated successfully', taskId, newStatus: status });
    });
  });
//update task
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, date, status } = req.body;
  const query = `UPDATE tasks SET title = ?, description = ?, date = ?, status = ? WHERE id = ?`;

  db.run(query, [title, description, date, status, id], function (err) {
    if (err) {
      res.status(500).send({ error: 'Failed to update task' });
    } else if (this.changes === 0) {
      res.status(404).send({ error: 'Task not found' });
    } else {
      res.send({ message: 'Task updated successfully' });
    }
  });
});

app.listen(3000,()=>{
    console.log("server at port 3000");
})