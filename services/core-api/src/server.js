const express = require('express');
const app = express();
app.use(express.json());

let agents = [];
let tasks = [];

// Create agent
app.post('/agents', (req,res)=>{
  agents.push(req.body);
  res.json(req.body);
});

// Get agents
app.get('/agents', (req,res)=>{
  res.json(agents);
});

// Create task
app.post('/tasks', (req,res)=>{
  const task = {...req.body, state:'created'};
  tasks.push(task);
  res.json(task);
});

// Assign task (simple Tarkwa logic)
app.post('/routing/assign', (req,res)=>{
  const task = tasks.find(t=>t.id===req.body.taskId);
  if(!task) return res.status(404).send('Task not found');

  const agent = agents[0]; // simple first-fit
  task.assignedAgent = agent?.id;
  task.state = 'assigned';

  res.json(task);
});

// Tarkwa loop (very basic)
setInterval(()=>{
  tasks.forEach(t=>{
    if(t.state==='assigned'){
      t.state='active';
    }
    else if(t.state==='active'){
      t.state='completed';
    }
  });
},5000);

app.listen(3000, ()=>console.log('Core API running on port 3000'));
