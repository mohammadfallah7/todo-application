// Handle Toggle Menu
const toggleMenu = document.getElementById("toggle-menu");
const menu = document.getElementById("menu");
const collapseMenu = document.getElementById("collapse-menu");
const overlayMenu = document.querySelector(".overlay-menu");

function handleToggleMenu() {
  return function () {
    menu.classList.toggle("show-menu");
    overlayMenu.classList.toggle("show-menu");
  };
}

toggleMenu.addEventListener("click", handleToggleMenu());
collapseMenu.addEventListener("click", handleToggleMenu());
overlayMenu.addEventListener("click", handleToggleMenu());

// Handle toggle theme
const lightTheme = document.getElementById("light-theme");
const darkTheme = document.getElementById("dark-theme");

function handleToggleTheme() {
  return function () {
    lightTheme.classList.toggle("active-toggle-theme");
    darkTheme.classList.toggle("active-toggle-theme");
  };
}

darkTheme.addEventListener("click", handleToggleTheme());
lightTheme.addEventListener("click", handleToggleTheme());

// Handle Date
const todayDate = document.getElementById("today-date");

function getTodayDate() {
  const now = new Date();

  return {
    getDay() {
      return new Intl.DateTimeFormat("fa-IR", {
        day: "numeric",
      }).format(now);
    },

    getMonth() {
      return new Intl.DateTimeFormat("fa-IR", {
        month: "short",
      }).format(now);
    },

    getYear() {
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
      }).format(now);
    },
  };
}

const date = getTodayDate();
todayDate.textContent = `امروز، ${date.getDay()} ${date.getMonth()} ${date.getYear()}`;

// Handle get task
const countTask = document.getElementById("count-task");

function fetchTask() {
  const baseUrl = "http://localhost:3000/tasks/";

  return fetch(baseUrl, { method: "GET" });
}

async function getTask() {
  try {
    const response = await fetchTask();
    const data = await response.json();

    const completedTask = data.filter((task) => task.isCompleted);
    const notCompletedTask = data.filter((task) => !task.isCompleted);

    const completedTaskLength = completedTask.length;
    const notCompletedTaskLength = notCompletedTask.length;

    countTask.textContent =
      notCompletedTask == 0
        ? "تسکی برای امروز نداری!"
        : `${notCompletedTaskLength} تسک را باید انجام دهید.`;
  } catch (error) {
    console.error(error);
  }
}

getTask();

// Handle Create New Task
function createNewTask(title, description, priority) {
  const baseUrl = "http://localhost:3000/tasks/";

  return fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify({
      id: new Date().getTime().toString(),
      title: title,
      description: description,
      priority: priority,
      isDone: false,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

// Handle Add Task
const todayTask = document.getElementById("today-task");
const addTask = todayTask.querySelector("#add-task");

const createTaskDiv = document.createElement("div");
createTaskDiv.id = "create-task-container";
createTaskDiv.className = "task__create shadow";
createTaskDiv.innerHTML = `<input
class="task__create__title"
type="text"
name="title"
id="task-title"
placeholder="نام تسک"
/>
<textarea
class="task__create__description"
name="description"
id="task-description"
placeholder="توضیحات"
></textarea>
<button id="select-tag" class="task__create__tags">
<i class="fa-solid fa-tag"></i>
<span>تگ ها</span>
</button>
<div
id="tag-container"
class="task__create__select shadow collapse-tag-container"
>
<button
  data-priority="low"
  id="priority-low"
  class="task__create__select__item task__create__select--low"
>
  پایین
</button>
<button
  data-priority="medium"
  id="priority-medium"
  class="task__create__select__item task__create__select--medium"
>
  متوسط
</button>
<button
  data-priority="high"
  id="priority-high"
  class="task__create__select__item task__create__select--high"
>
  بالا
</button>
</div>
<hr />
<div class="task__create__actions">
<button id="create-task" class="task__create__actions__add">
  اضافه کردن تسک
</button>
<button
  id="collapse-create"
  class="task__create__actions__collapse"
>
  <i class="fa-solid fa-xmark"></i>
</button>
</div>`;

addTask.addEventListener("click", () => {
  addTask.after(createTaskDiv);

  const createTaskContainer = todayTask.querySelector("#create-task-container");
  const taskTitle = createTaskContainer.querySelector("#task-title");
  const taskDescription =
    createTaskContainer.querySelector("#task-description");
  const selectTag = createTaskContainer.querySelector("#select-tag");
  const tagIcon = createTaskContainer.querySelector("#select-tag > i");
  const tagContainer = createTaskContainer.querySelector("#tag-container");
  const priorityLow = createTaskContainer.querySelector("#priority-low");
  const priorityMedium = createTaskContainer.querySelector("#priority-medium");
  const priorityHigh = createTaskContainer.querySelector("#priority-high");
  const createTask = createTaskContainer.querySelector("#create-task");
  const collapseCreate = createTaskContainer.querySelector("#collapse-create");

  let taskPriorityValue = null;

  priorityLow.addEventListener("click", () => {
    taskPriorityValue = priorityLow.dataset.priority;
    priorityLow.classList.add("select-priority");
    priorityMedium.classList.remove("select-priority");
    priorityHigh.classList.remove("select-priority");
  });

  priorityMedium.addEventListener("click", () => {
    taskPriorityValue = priorityMedium.dataset.priority;
    priorityMedium.classList.add("select-priority");
    priorityHigh.classList.remove("select-priority");
    priorityLow.classList.remove("select-priority");
  });

  priorityHigh.addEventListener("click", () => {
    taskPriorityValue = priorityHigh.dataset.priority;
    priorityHigh.classList.add("select-priority");
    priorityLow.classList.remove("select-priority");
    priorityMedium.classList.remove("select-priority");
  });

  selectTag.addEventListener("click", () => {
    tagContainer.classList.remove("collapse-tag-container");
    tagIcon.className = "fa-solid fa-tags";
  });

  createTask.addEventListener("click", async () => {
    if (
      taskPriorityValue !== null &&
      taskTitle.value !== "" &&
      taskDescription.value !== ""
    ) {
      await createNewTask(
        taskTitle.value,
        taskDescription.value,
        taskPriorityValue
      );

      todayTask.removeChild(createTaskDiv);
      tagContainer.classList.add("collapse-tag-container");
      tagIcon.className = "fa-solid fa-tag";
      priorityHigh.classList.remove("select-priority");
      priorityLow.classList.remove("select-priority");
      priorityMedium.classList.remove("select-priority");
      taskTitle.value = "";
      taskDescription.value = "";

      getTask();
    }
  });

  collapseCreate.addEventListener("click", () => {
    todayTask.removeChild(createTaskDiv);
    tagContainer.classList.add("collapse-tag-container");
    tagIcon.className = "fa-solid fa-tag";
    priorityHigh.classList.remove("select-priority");
    priorityLow.classList.remove("select-priority");
    priorityMedium.classList.remove("select-priority");
  });
});
