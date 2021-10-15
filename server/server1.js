const express = require('express');
const app = express();

app.use((req,res,next)=>{
  console.log('serve start');
  next();
})

app.get('/students', (req,res)=>{
  const students = [
    {id: 1, name:'tom',age: 18},
    {id: 2, name:'john',age: 28},
    {id: 3, name:'jin',age: 12},
  ]
  res.send(students);
})

app.listen(5000, err =>{
  console.log(err);
  if(!err){
    console.log('服务器1启动成功')
  }
})