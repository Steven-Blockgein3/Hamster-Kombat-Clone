import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getTasks, setTasks, updateUser } from '../utils/localStorage';

function Tasks() {
  const { user, setUser } = useOutletContext();
  const [tasks, setTasksState] = useState([]);

  useEffect(() => {
    const storedTasks = getTasks();
    if (storedTasks.length === 0) {
      // Initialize some default tasks if none exist
      const defaultTasks = [
        { id: 1, title: 'Complete 10 mining sessions', description: 'Mine coins 10 times', level: 1, completed: false },
        { id: 2, title: 'Reach level 5', description: 'Level up to level 5', level: 3, completed: false },
        { id: 3, title: 'Accumulate 1000 coins', description: 'Earn a total of 1000 coins', level: 5, completed: false },
      ];
      setTasks(defaultTasks);
      setTasksState(defaultTasks);
    } else {
      setTasksState(storedTasks);
    }
  }, []);

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    setTasksState(updatedTasks);

    const updatedUser = updateUser({ coins: user.coins + 10 });
    setUser(updatedUser);

    console.log("Task completed successfully!");
  };

  return (
    <div className="tasks">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      {tasks.filter(task => task.level <= user.level).map(task => (
        <div key={task.id} className="mb-4 p-4 border rounded">
          <h3 className="font-semibold">{task.title}</h3>
          <p>{task.description}</p>
          <button
            className={`mt-2 px-4 py-2 rounded ${task.completed ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
            onClick={() => completeTask(task.id)}
            disabled={task.completed}
          >
            {task.completed ? 'Completed' : 'Complete Task'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
