import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

function Card({ task, onStatusChange, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState({ ...task });

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(task.id, newStatus);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit(editableTask);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 border-2 rounded-lg shadow-md">
      {isEditing ? (
        <>
          <input
            type="text"
            name="title"
            value={editableTask.title}
            onChange={handleInputChange}
            className="border rounded w-full mb-2 p-1"
            placeholder="Title"
          />
          <textarea
            name="description"
            value={editableTask.description}
            onChange={handleInputChange}
            className="border rounded w-full mb-2 p-1"
            placeholder="Description"
          />
          <input
            type="date"
            name="date"
            value={editableTask.date}
            onChange={handleInputChange}
            className="border rounded w-full mb-2 p-1"
          />
        </>
      ) : (
        <>
          <h3 className="font-bold text-xl mb-2">{task.title}</h3>
          <p className="text-gray-700 mb-2">{task.description}</p>
          <p className="text-gray-500">Due Date: {task.date}</p>
        </>
      )}

      <div className="flex justify-between items-center mt-4">
        <span
          className={`text-sm font-semibold ${
            task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
          }`}
        >
          Status: {task.status}
        </span>

        <div className="flex space-x-3">
          <button
            onClick={handleStatusToggle}
            className={`p-2 rounded-md ${
              task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
            } text-white`}
          >
            {task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
          </button>
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 bg-green-500 rounded-md text-white"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-blue-500 rounded-md text-white"
            >
              <FaEdit />
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 bg-red-500 rounded-md text-white"
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
}
export default Card;
