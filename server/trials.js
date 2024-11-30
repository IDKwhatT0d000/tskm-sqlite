const sqlite3=require('sqlite3');

const db=new sqlite3.Database('./test.db',sqlite3.OPEN_READWRITE,(err)=>{
    if(err){
        return console.log(err);
    }
    console.log('connected to sqlite db successfully');
})


sql=`select * from tasks`
db.all(sql,[],(err,rows)=>{
    if(err){
        return console.log(err.message)
    }
    console.log(rows);
})