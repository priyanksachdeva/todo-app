const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Task = require('./task');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://priyank:priyank2005@cluster0.ly3wple.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Routes

// Get all tasks
app.get('/', async (req, res) => {
  const tasks = await Task.find({});
  res.render('index', { tasks, alert: null });
});

// Add new task
app.post('/tasks', async (req, res) => {
  const { title, priority } = req.body;
  if (!title || title.trim() === '') {
    const tasks = await Task.find({});
    return res.render('index', { tasks, alert: 'Task title cannot be empty!' });
  }

  await Task.create({ title: title.trim(), priority });
  res.redirect('/');
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  const { title, priority } = req.body;
  if (!title || title.trim() === '') {
    const tasks = await Task.find({});
    return res.render('index', { tasks, alert: 'Task title cannot be empty!' });
  }

  await Task.findByIdAndUpdate(req.params.id, { title: title.trim(), priority });
  const tasks = await Task.find({});
  res.render('index', { tasks, alert: 'Task updated successfully!' });
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  const tasks = await Task.find({});
  res.render('index', { tasks, alert: 'Task deleted successfully!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});