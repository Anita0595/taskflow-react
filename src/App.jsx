import NewTaskForm from "./components/NewTaskForm";
import TaskList from "./components/TaskList";
import TaskCounter from "./components/TaskCounter";
import TodoistPanel from "./components/TodoistPanel";
import { useTasks } from "./hooks/useTasks";
import { useTodoist } from "./hooks/useTodoist";

export default function App() {
  const { tasks, addTask, toggleTask } = useTasks();
  const todoist = useTodoist();

  function handleAdd(title) {
    addTask(title);
    todoist.sendTask(title);
  }

  return (
    <>
      <header>
        <h1>Mis Tareas</h1>
        <p className="subtitle">Prioritarias</p>
      </header>

      <main>
        <NewTaskForm onAdd={handleAdd} />

        {/* controles de la lista */}

        <TaskList tasks={tasks} onToggle={toggleTask} />
        <TaskCounter tasks={tasks} />

        <TodoistPanel
          isConnected={todoist.isConnected}
          isChecking={todoist.isChecking}
          notice={todoist.notice}
          onConnect={todoist.connect}
          onDisconnect={todoist.disconnect}
        />
      </main>

      <footer>
        <p id="credits">Hecho por Ana Rico</p>
      </footer>
    </>
  );
}
