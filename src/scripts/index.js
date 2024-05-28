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

darkTheme.addEventListener("click", () => {
  lightTheme.classList.remove("active-toggle-theme");
  darkTheme.classList.add("active-toggle-theme");
});
lightTheme.addEventListener("click", () => {
  darkTheme.classList.remove("active-toggle-theme");
  lightTheme.classList.add("active-toggle-theme");
});

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

// const { v4: uuidv4 } = require("uuid");

function fetchTask() {
  const baseUrl = "http://localhost:3000/tasks/";

  return fetch(baseUrl, { method: "GET" });
}

async function getTask() {
  try {
    let response = await fetchTask();
    let data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}
