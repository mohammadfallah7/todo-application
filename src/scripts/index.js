// Elements
const toggleMenu = document.getElementById("toggle-menu");
const menu = document.getElementById("menu");
const collapseMenu = document.getElementById("collapse-menu");
const overlayMenu = document.querySelector(".overlay-menu");
const lightTheme = document.getElementById("light-theme");
const darkTheme = document.getElementById("dark-theme");
const todayDate = document.getElementById("today-date");
const countTask = document.getElementById("count-task");
const todayTask = document.getElementById("today-task");
const addTask = todayTask.querySelector("#add-task");
const emptyView = todayTask.querySelector("#empty-view");
const notCompletedTaskList = todayTask.querySelector(
  "#not-completed-task-list"
);
const completeTaskSection = document.getElementById("complete-task-section");
const completeTaskList = completeTaskSection.querySelector(
  "#complete-task-list"
);

// Handle Toggle Menu
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
function handleToggleTheme() {
  return function () {
    lightTheme.classList.toggle("active-toggle-theme");
    darkTheme.classList.toggle("active-toggle-theme");
  };
}

darkTheme.addEventListener("click", handleToggleTheme());
lightTheme.addEventListener("click", handleToggleTheme());

// Handle Date
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

// Handle Update Task
function updateTask(id, title, description, priority, isDone = false) {
  const baseUrl = "http://localhost:3000/tasks/";

  return fetch(`${baseUrl}${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: title,
      description: description,
      priority: priority,
      isDone: isDone,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

// Handle Delete Task
function deleteTask(id) {
  const baseUrl = "http://localhost:3000/tasks/";

  return fetch(`${baseUrl}${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

// Handle get task
function fetchTask() {
  const baseUrl = "http://localhost:3000/tasks/";

  return fetch(baseUrl, { method: "GET" });
}

async function getTask() {
  try {
    const response = await fetchTask();
    const data = await response.json();

    const completedTask = data.filter((task) => task.isDone);
    const notCompletedTask = data.filter((task) => !task.isDone);

    const completedTaskLength = completedTask.length;
    const notCompletedTaskLength = notCompletedTask.length;

    countTask.textContent =
      notCompletedTaskLength == 0
        ? "تسکی برای امروز نداری!"
        : `${notCompletedTaskLength} تسک را باید انجام دهید.`;

    emptyView.innerHTML =
      notCompletedTaskLength == 0
        ? `<div class="task__empty__picture">
        <img src="../assets/images/empty-view.png" alt="Empty View" />
      </div>
      <h4 class="task__empty__title">
        چه کارهایی امروز برای انجام داری؟
      </h4>
      <p class="task__empty__description">
        میتونی الان تسک‌هاتو اینجا بنویسی و برنامه ریزی رو شروع کنی!
      </p>`
        : "";

    let completeTaskTitle = document.createElement("div");
    completeTaskTitle.className = "complete-task__title";

    completeTaskTitle.innerHTML =
      completedTaskLength == 0
        ? ""
        : `
        <h3 class="complete-task__title--large">تسک های انجام شده</h3>
        <span class="complete-task__title--small">${completedTaskLength} تسک انجام شده است.</span>
        `;

    if (completedTaskLength !== 0) {
      completeTaskSection.insertAdjacentElement(
        "afterbegin",
        completeTaskTitle
      );

      const completeTaskFragment = new DocumentFragment();

      completedTask.forEach((task) => {
        let CompletedPriorityBg = "";

        switch (task.priority) {
          case "low":
            CompletedPriorityBg = "#11a483";
            break;
          case "medium":
            CompletedPriorityBg = "#ffaf37";
            break;
          default:
            CompletedPriorityBg = "#ff5f37";
            break;
        }

        let completeTaskItem = document.createElement("li");
        completeTaskItem.className = "complete-task__list__item";
        completeTaskItem.innerHTML = `
          <div class="complete-task__list__item__content">
            <div id="complete-pri-bg"
              class="complete-task__list__item__content__priority"
            ></div>
            <button class="complete-task__list__item__content__select">
              <i class="fa-solid fa-check"></i>
            </button>
            <h2 class="complete-task__list__item__content__title">
              ${task.title}
            </h2>
          </div>
          <button onclick="deleteTask(${task.id})" class="complete-task__list__item__delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        `;

        let completePriBg = completeTaskItem.querySelector("#complete-pri-bg");
        completePriBg.style.backgroundColor = CompletedPriorityBg;

        completeTaskFragment.appendChild(completeTaskItem);
      });

      completeTaskList.appendChild(completeTaskFragment);
    }

    if (notCompletedTaskLength !== 0) {
      const taskFragment = new DocumentFragment();

      notCompletedTask.forEach((task) => {
        let priorityText = "";
        let priorityColor = "";
        let priorityBg = "";

        switch (task.priority) {
          case "low":
            priorityText = "پایین";
            priorityColor = "#11a483";
            priorityBg = "#c3fff1";
            break;
          case "medium":
            priorityText = "متوسط";
            priorityColor = "#ffaf37";
            priorityBg = "#ffefd6";
            break;
          default:
            priorityText = "بالا";
            priorityColor = "#ff5f37";
            priorityBg = "#ffe2db";
            break;
        }

        let notCompletedTaskItem = document.createElement("li");
        notCompletedTaskItem.classList.add("task__list__item");
        notCompletedTaskItem.innerHTML = `
        <div class="task__list__item__content">
          <div id="pri-bg" class="task__list__item__content__priority"></div>
          <button id="task-done" class="task__list__item__content__select"></button>
          <div class="task__list__item__content__information">
            <h2 class="task__list__item__content__information__title">
              ${task.title}
            </h2>
            <span id="pri-label" class="task__list__item__content__information__label">
              ${priorityText}
            </span>
            <p
              class="task__list__item__content__information__description"
            >
              ${task.description}
            </p>
          </div>
        </div>
        <button id="task-action" class="task__list__item__action">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
        `;

        let priBg = notCompletedTaskItem.querySelector("#pri-bg");
        priBg.style.backgroundColor = priorityColor;

        let priLabel = notCompletedTaskItem.querySelector("#pri-label");
        priLabel.style.backgroundColor = priorityBg;
        priLabel.style.color = priorityColor;

        let taskDone = notCompletedTaskItem.querySelector("#task-done");
        taskDone.addEventListener("click", async () => {
          await updateTask(
            task.id,
            task.title,
            task.description,
            task.priority,
            true
          );

          await getTask();
        });

        let taskAction = notCompletedTaskItem.querySelector("#task-action");
        let taskModify = document.createElement("div");
        taskModify.id = "task-modify";
        taskModify.className = "task__list__item__modify shadow";
        taskModify.innerHTML = `
          <button id="delete-task" class="task__list__item__modify__action">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button id="edit-task" class="task__list__item__modify__action">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        `;

        taskAction.addEventListener("click", () => {
          taskModify.classList.toggle("show");

          if (taskModify.classList.contains("show")) {
            notCompletedTaskItem.appendChild(taskModify);
          } else {
            notCompletedTaskItem.removeChild(taskModify);
          }
        });

        let deleteTaskItem = taskModify.querySelector("#delete-task");
        deleteTaskItem.addEventListener("click", async () => {
          await deleteTask(task.id);

          await getTask();
        });

        taskFragment.appendChild(notCompletedTaskItem);
      });

      notCompletedTaskList.appendChild(taskFragment);
    }
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
  todayTask.removeChild(emptyView);

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

  let priorityLowClone = priorityLow.cloneNode(true);
  priorityLowClone.style.width = "3rem";
  priorityLowClone.style.marginRight = "1rem";

  priorityLow.addEventListener("click", () => {
    taskPriorityValue = priorityLow.dataset.priority;
    priorityLow.classList.add("select-priority");
    priorityMedium.classList.remove("select-priority");
    priorityHigh.classList.remove("select-priority");
    tagContainer.classList.add("collapse-tag-container");
    createTaskContainer.replaceChild(priorityLowClone, selectTag);
  });

  let priorityMediumClone = priorityMedium.cloneNode(true);
  priorityMediumClone.style.width = "3rem";
  priorityMediumClone.style.marginRight = "1rem";

  priorityMedium.addEventListener("click", () => {
    taskPriorityValue = priorityMedium.dataset.priority;
    priorityMedium.classList.add("select-priority");
    priorityHigh.classList.remove("select-priority");
    priorityLow.classList.remove("select-priority");
    tagContainer.classList.add("collapse-tag-container");
    createTaskContainer.replaceChild(priorityMediumClone, selectTag);
  });

  let priorityHighClone = priorityHigh.cloneNode(true);
  priorityHighClone.style.width = "3rem";
  priorityHighClone.style.marginRight = "1rem";

  priorityHigh.addEventListener("click", () => {
    taskPriorityValue = priorityHigh.dataset.priority;
    priorityHigh.classList.add("select-priority");
    priorityLow.classList.remove("select-priority");
    priorityMedium.classList.remove("select-priority");
    tagContainer.classList.add("collapse-tag-container");
    createTaskContainer.replaceChild(priorityHighClone, selectTag);
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
      switch (taskPriorityValue) {
        case "low":
          createTaskContainer.replaceChild(selectTag, priorityLowClone);
          break;
        case "medium":
          createTaskContainer.replaceChild(selectTag, priorityMediumClone);
          break;
        default:
          createTaskContainer.replaceChild(selectTag, priorityHighClone);
          break;
      }
      taskTitle.value = "";
      taskDescription.value = "";

      await getTask();
    }
  });

  collapseCreate.addEventListener("click", () => {
    todayTask.removeChild(createTaskDiv);
    todayTask.appendChild(emptyView);
    tagContainer.classList.add("collapse-tag-container");
    tagIcon.className = "fa-solid fa-tag";
    priorityHigh.classList.remove("select-priority");
    priorityLow.classList.remove("select-priority");
    priorityMedium.classList.remove("select-priority");
    switch (taskPriorityValue) {
      case "low":
        createTaskContainer.replaceChild(selectTag, priorityLowClone);
        break;
      case "medium":
        createTaskContainer.replaceChild(selectTag, priorityMediumClone);
        break;
      default:
        createTaskContainer.replaceChild(selectTag, priorityHighClone);
        break;
    }
  });
});
