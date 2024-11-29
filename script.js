//Elements
const principalContainer = document.querySelector(".principal-container");
const createForm = document.querySelector(".create-form");
const taskNameInput = document.querySelector("#taskNameInput");
const tasksContainer = document.querySelector(".tasks-container");
const createFormBtn = document.querySelector("#createFormBtn");
const secondaryContainer = document.querySelector(".secondary-container");
const defaultMsg = document.querySelector(".defaultMsg");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const deleteSearch = document.querySelector("#deleteSearch");
const selectInput = document.querySelector("#selectInput");
if (!localStorage.tasks) {
	let task = [];
	localStorage.setItem("tasks", JSON.stringify(task));
}

//Functions
function cleanTaskContainer() {
	const taskContainerTasks = tasksContainer.querySelectorAll(".task-card");
	taskContainerTasks.forEach((task) => {
		task.remove();
	});
}
function saveTask(taskTitle) {
	const task = {
		title: taskTitle,
		completed: false,
	};
	if (localStorage.tasks) {
		const tasks = JSON.parse(localStorage.getItem("tasks"));
		tasks.push(task);
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}
}
function createTask(taskTitle) {
	const tasks = JSON.parse(localStorage.getItem("tasks"));
	const taskCard = document.createElement("div");
	taskCard.innerHTML = `<p>${taskTitle}</p>
                        <div class="btn-control">
                    <button class="btn" id="completeTaskbtn"><i class="fa-solid fa-check"></i></button>
                    <button class="btn" id="editTaskbtn"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btn" id="deleteTaskbtn"><i class="fa-solid fa-xmark"></i></button>
                    </div>`;
	taskCard.classList.add("task-card");
	tasks.forEach((task) => {
		if (task.title === taskTitle && task.completed === true) {
			taskCard.classList.add("completed");
		}
	});
	tasksContainer.appendChild(taskCard);
	let target;
	const deleteTaskbtn = taskCard.querySelector("#deleteTaskbtn");
	const completeTaskbtn = taskCard.querySelector("#completeTaskbtn");
	const editTaskbtn = taskCard.querySelector("#editTaskbtn");
	const cancelBtn = secondaryContainer.querySelector("#cancelBtn");
	const changeTaskNameBtn =
		secondaryContainer.querySelector("#changeTaskNameBtn");
	deleteTaskbtn.addEventListener("click", (e) => {
		const tasks = JSON.parse(localStorage.getItem("tasks"));
		tasks.forEach((task) => {
			if (task.title === taskTitle) {
				const index = tasks.indexOf(task);
				tasks.splice(index, 1);
				localStorage.setItem("tasks", JSON.stringify(tasks));
				loadTasks();
			}
		});
	});
	editTaskbtn.addEventListener("click", (e) => {
		principalContainer.classList.toggle("hide");
		secondaryContainer.classList.toggle("hide");
		target = e.target.closest(".task-card")
	});
	changeTaskNameBtn.addEventListener("click", (e) => {
		const taskTitleSaved = target.querySelector("p").textContent
		const newTaskName =
			secondaryContainer.querySelector("#newTaskNameInput").value;
		const tasks = JSON.parse(localStorage.getItem("tasks"));
		tasks.forEach((task) => {
			if (task.title === taskTitleSaved) {
				task.title = newTaskName;
				localStorage.setItem("tasks", JSON.stringify(tasks));
			}
		});
	});
	completeTaskbtn.addEventListener("click", (e) => {
		const tasks = JSON.parse(localStorage.getItem("tasks"));
		tasks.forEach((task) => {
			if (task.title === taskTitle) {
				taskCard.classList.toggle("completed");
				task.completed = !task.completed;
				localStorage.setItem("tasks", JSON.stringify(tasks));
			}
		});
	});
	cancelBtn.addEventListener("click", (e) => {
		principalContainer.classList.toggle("hide");
		secondaryContainer.classList.toggle("hide");
	});
	defaultMsg.classList.add("hide");
}
function loadTasks() {
	cleanTaskContainer()
	const tasks = JSON.parse(localStorage.getItem("tasks"));
	tasks.forEach((task) => {
		createTask(task.title);
	});
	if (tasks.length === 0) {
		defaultMsg.classList.remove("hide");
	}
}

//Events
createFormBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const taskTitle = taskNameInput.value;
	if (!taskTitle) return;
	createTask(taskTitle);
	saveTask(taskTitle);
	taskNameInput.value = "";
});
searchInput.addEventListener("input", (e) => {
    e.preventDefault()
	cleanTaskContainer()
	const tasks = JSON.parse(localStorage.getItem("tasks"));
	let found = false
	if (!searchInput.value) {
		loadTasks();
		return;
	}
	tasks.forEach((task) => {
		if (task.title.includes(searchInput.value)) {
			createTask(task.title);
			found = true
		} 
		if (found === false) {
			defaultMsg.classList.remove("hide");
		}
	});
});
deleteSearch.addEventListener("click", (e) => {
	e.preventDefault();
	searchInput.value = "";
	loadTasks();
});
selectInput.addEventListener("change", (e) => {
	e.preventDefault();
	const valor = selectInput.value;
	const tasks = JSON.parse(localStorage.getItem("tasks"));
	if (valor === "feitas") {
		let completed = false;
		cleanTaskContainer()
		tasks.forEach((task) => {
			if (task.completed === true) {
				defaultMsg.classList.add("hide");
				createTask(task.title);
				completed = true;
			}
		});
		if (completed === false) {
			cleanTaskContainer()
			defaultMsg.classList.remove("hide");
		}
	}
	if (valor === "todas") {
		tasks.forEach((task) => {
			cleanTaskContainer()
			loadTasks();
		});
	}
	if (valor === "pendentes") {
		cleanTaskContainer()
		let hasPendingTasks = false;
		tasks.forEach((task) => {
			if (task.completed === false) {
				defaultMsg.classList.add("hide");
				createTask(task.title);
				hasPendingTasks = true;
			}
		});
		if (!hasPendingTasks) {
			defaultMsg.classList.remove("hide");
		}
	}
});

//Inicialization
loadTasks();
