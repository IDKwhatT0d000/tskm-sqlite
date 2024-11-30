import { useState, useEffect } from 'react';
import Card from './components/Card';
import axios from 'axios';

function App() {
  const [data, setData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const getdata = async () => {
      try {
        const res = await axios.get('http://localhost:3000/all');
        setTasks(res.data.tasks.flat());
        console.log(tasks);
      } catch (err) {
        console.log(err);
      }
    };
    getdata();
  }, []);

  const handlechange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleclick = async () => {
    if (!data.title || !data.description || !data.date) {
      alert('All fields are required!');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/new', data);
      console.log(res.data);
      setTasks((prevTasks) => [...prevTasks, res.data]);
      setData({
        title: '',
        description: '',
        date: ''
      });
    } catch (error) {
      console.log(error);
    }
  };
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    }
    if (filter === 'pending') {
      return task.status === 'pending';
    }
    if (filter === 'completed') {
      return task.status === 'completed';
    }
    return true;
  });


  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    axios
      .put(`http://localhost:3000/updateStatus/${taskId}`, { status: newStatus })
      .then((res) => {
        console.log('Status updated:', res.data);
      })
      .catch((err) => {
        console.log('Error updating status:', err);
      });
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    axios
      .delete(`http://localhost:3000/delete/${taskId}`)
      .then(() => {
        console.log('Task deleted');
      })
      .catch((err) => {
        console.log('Error deleting task:', err);
      });
  };

  const handleEdit = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:3000/update/${updatedTask.id}`, updatedTask); 
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      console.log('Task updated successfully:', updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center space-y-5 p-4">
        <p className="font-bold text-3xl md:text-4xl lg:text-5xl text-center text-indigo-800">
          Task Management System
        </p>
        <div className="border-2 p-6 border-black w-full max-w-lg rounded-lg bg-white shadow-md">
          <p className="font-bold text-xl mb-5 text-center">Add New Task</p>
          <div className="flex flex-col space-y-5">
            <div className="flex justify-between items-center">
              <label htmlFor="title" className="text-lg">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={data.title}
                className="p-2 border-2 border-gray-300 rounded-md w-full md:w-64"
                onChange={handlechange}
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="description" className="text-lg">
                Description:
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={data.description}
                className="p-2 border-2 border-gray-300 rounded-md w-full md:w-64 h-[70px]"
                onChange={handlechange}
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="date" className="text-lg">
                Due Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={data.date}
                className="p-2 border-2 border-gray-300 rounded-md w-full md:w-64"
                onChange={handlechange}
              />
            </div>
            <button
              className="mt-4 p-2 bg-gradient-to-r from-cyan-500 via-blue-700 to-indigo-800 rounded-lg hover:from-indigo-800 hover:to-cyan-500 text-white font-semibold"
              onClick={handleclick}
            >
              Add Task
            </button>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex space-x-4 justify-center">
            <button
              className={`p-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button
              className={`p-2 rounded-md ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`p-2 rounded-md ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
        <div className="w-full max-w-screen-xl mx-auto p-4 mt-10">
          <h1 className="text-2xl font-bold text-center mb-4">Task List</h1>
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task, index) => {
                return <Card task={task} key={task.id || index} onStatusChange={handleStatusChange} onDelete={handleDelete} onEdit={handleEdit} />;
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No tasks available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
