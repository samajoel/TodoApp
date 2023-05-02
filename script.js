"use strict";

const ITEMS_CONTAINER = document.getElementById("items");
const ITEMS_TEMPLATE = document.getElementById("itemTemplate");
const ADD_BUTTON = document.getElementById("add");
const SORT_SELECT = document.getElementById("sort");
const FILTER_SELECT = document.getElementById("filter");

let items = getItems();

function getItems() {
  const value = localStorage.getItem("todo-test") || "[]";

  return JSON.parse(value);
}

function setItems(items) {
  const itemsJson = JSON.stringify(items);
  localStorage.setItem("todo-test", itemsJson);
}

function addItem() {
  items.unshift({
    description: "",
    status: "not completed",
    deadline: "",
    priority: "",
  });

  setItems(items);
  refreshList();
}

function updateItem(item, key, value) {
  item[key] = value;
  setItems(items);
  refreshList();
}

function refreshList() {
  let sortedItems = items.slice();
  const sortOption = SORT_SELECT.value;
  if (sortOption === "description") {
    sortedItems.sort((a, b) => a.description.localeCompare(b.description));
  } else if (sortOption === "deadline") {
    sortedItems.sort((a, b) => a.deadline.localeCompare(b.deadline));
  } else if (sortOption === "priority") {
    sortedItems.sort((a, b) => a.priority.localeCompare(b.priority));
  }

  const filterOption = FILTER_SELECT.value;
  if (filterOption === "completed") {
    sortedItems = sortedItems.filter((item) => item.status === "completed");
  } else if (filterOption === "not completed") {
    sortedItems = sortedItems.filter((item) => item.status === "not completed");
  } else if (filterOption !== "all") {
    sortedItems = sortedItems.filter((item) => item.priority === filterOption);
  }

  ITEMS_CONTAINER.innerHTML = "";
  for (const item of sortedItems) {
    const itemElement = ITEMS_TEMPLATE.content.cloneNode(true);
    const descriptionInput = itemElement.querySelector(".item-description");
    const statusSelect = itemElement.querySelector(".item-status");
    const deadlineInput = itemElement.querySelector(".item-deadline");
    const priorityInput = itemElement.querySelector(".item-priority");

    descriptionInput.value = item.description;
    statusSelect.value = item.status;
    deadlineInput.value = item.deadline;
    priorityInput.value = item.priority;

    descriptionInput.addEventListener("change", function () {
      updateItem(item, "description", descriptionInput.value);
    });

    statusSelect.addEventListener("change", function () {
      updateItem(item, "status", statusSelect.value);
    });

    deadlineInput.addEventListener("change", function () {
      const date = new Date(deadlineInput.value);
      if (!isNaN(date.getTime()) && date >= new Date()) {
        updateItem(item, "deadline", deadlineInput.value);
      } else {
        alert("Invalid deadline date");
        deadlineInput.value = item.deadline;
      }
    });

    priorityInput.addEventListener("change", function () {
      updateItem(item, "priority", priorityInput.value);
    });

    ITEMS_CONTAINER.append(itemElement);
  }
}

ADD_BUTTON.addEventListener("click", function () {
  addItem();
});

SORT_SELECT.addEventListener("change", function () {
  refreshList();
});

FILTER_SELECT.addEventListener("change", function () {
  refreshList();
});

refreshList();
