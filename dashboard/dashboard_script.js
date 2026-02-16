const categoryList = document.getElementById("categoryList");
const categoryDropdown = document.getElementById("categoryDropdown");
const currentCategory = document.getElementById("currentCategory");
const cardContainer = document.getElementById("cardContainer");

let categories = JSON.parse(localStorage.getItem("vaultData")) || {
  "Social Media": [], "Banking": [], "Shopping": []
};

let activeCategory = Object.keys(categories)[0] || "";

// ================= SAVE =================
function saveToStorage() {
  localStorage.setItem("vaultData", JSON.stringify(categories));
}

// ================= UNDO LAST CATEGORY DELETE =================
let lastDeletedCategory = null;

function deleteCategory(cat) {
  lastDeletedCategory = { name: cat, data: categories[cat] };
  delete categories[cat];
  saveToStorage();
  rebuildSidebar();
  refreshDropdown();

  activeCategory = Object.keys(categories)[0] || "";
  if (activeCategory) switchCategory(activeCategory);
  else {
    currentCategory.textContent = "No category selected";
    cardContainer.innerHTML = "";
  }
}

// ================= BUILD SIDEBAR =================
function rebuildSidebar() {
  categoryList.innerHTML = "";

  Object.keys(categories).forEach(cat => {
    const li = document.createElement("li");
    li.dataset.category = cat;

    // make li a flex container
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";

    // text span
    const textSpan = document.createElement("span");
    textSpan.textContent = `${cat} (${categories[cat].length})`;

    // delete button
    const delBtn = document.createElement("button");
    delBtn.className = "delete-cat";
    delBtn.textContent = "×";
    delBtn.style.flex = "0"; // prevent button from stretching
    delBtn.style.padding = "0 6px"; // only horizontal padding
    delBtn.style.margin = "0";
    delBtn.style.cursor = "pointer";

    // delete event
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent li click
      deleteCategory(cat);
    });

    li.appendChild(textSpan);
    li.appendChild(delBtn);

    // click on li (outside button) switches category
    li.addEventListener("click", () => switchCategory(cat));

    categoryList.appendChild(li);
  });
}


// ================= DROPDOWN =================
function refreshDropdown() {
  categoryDropdown.innerHTML = "";
  Object.keys(categories).forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryDropdown.appendChild(option);
  });
}

// ================= SWITCH CATEGORY =================
function switchCategory(cat) {
  activeCategory = cat;
  currentCategory.textContent = "Filtered by: " + cat;
  renderCards();

  document.querySelectorAll(".sidebar li").forEach(li => {
    li.classList.remove("active");
    if (li.dataset.category === cat) li.classList.add("active");
  });
}

// ================= RENDER CARDS =================
function renderCards() {
  cardContainer.innerHTML = "";
  if (!categories[activeCategory]) return;

  categories[activeCategory].forEach((cred, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("div");
    title.textContent = cred.name;
    card.appendChild(title);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "×";

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      categories[activeCategory].splice(index, 1);
      saveToStorage();
      renderCards();
      rebuildSidebar();
    });

    card.appendChild(delBtn);

    card.addEventListener("click", () => {
      document.getElementById("viewTitle").textContent = cred.name;
      document.getElementById("viewUser").textContent = cred.user;
      document.getElementById("viewPass").textContent = cred.pass;
      document.getElementById("viewURL").textContent = cred.url;
      document.getElementById("viewNotes").textContent = cred.notes;
      document.getElementById("viewModal").style.display = "flex";
    });

    cardContainer.appendChild(card);
  });
}

// ================= INITIAL LOAD =================
refreshDropdown();
rebuildSidebar();
if (activeCategory) switchCategory(activeCategory);

// ================= ADD CATEGORY =================
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoryModal = document.getElementById("categoryModal");
const saveCategoryBtn = document.getElementById("saveCategoryBtn");
const cancelCategoryBtn = document.getElementById("cancelCategoryBtn");

addCategoryBtn.addEventListener("click", () => categoryModal.style.display = "flex");
cancelCategoryBtn.addEventListener("click", () => categoryModal.style.display = "none");

saveCategoryBtn.addEventListener("click", () => {
  const newCategory = document.getElementById("newCategory").value.trim();
  if (newCategory && !categories[newCategory]) {
    categories[newCategory] = [];
    saveToStorage();
    rebuildSidebar();
    refreshDropdown();
    document.getElementById("newCategory").value = "";
    categoryModal.style.display = "none";
  }
});

// ================= ADD CREDENTIAL =================
const addCredentialBtn = document.getElementById("addCredentialBtn");
const credentialModal = document.getElementById("credentialModal");
const saveCredentialBtn = document.getElementById("saveCredentialBtn");
const cancelCredentialBtn = document.getElementById("cancelCredentialBtn");

addCredentialBtn.addEventListener("click", () => credentialModal.style.display = "flex");
cancelCredentialBtn.addEventListener("click", () => credentialModal.style.display = "none");

saveCredentialBtn.addEventListener("click", () => {
  const name = document.getElementById("credName").value.trim();
  const user = document.getElementById("credUser").value.trim();
  const pass = document.getElementById("credPass").value.trim();
  const url = document.getElementById("credURL").value.trim();
  const notes = document.getElementById("credNotes").value.trim();
  const error = document.getElementById("formError");

  error.style.display = "none";

  if (!name || !user || !pass) {
    error.textContent = "Please fill all required fields";
    error.style.display = "block";
    return;
  }

  if (!user.includes("@") || !user.includes(".com")) {
    error.textContent = "Email must include '@' and '.com'";
    error.style.display = "block";
    return;
  }

  categories[activeCategory].push({ name, user, pass, url, notes });
  saveToStorage();
  renderCards();
  rebuildSidebar();

  credentialModal.style.display = "none";

  document.getElementById("credName").value = "";
  document.getElementById("credUser").value = "";
  document.getElementById("credPass").value = "";
  document.getElementById("credURL").value = "";
  document.getElementById("credNotes").value = "";
});

// ================= DELETE ALL =================
const deleteAllBtn = document.getElementById("deleteAllBtn");

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all data?")) {
    categories = {};
    saveToStorage();
    rebuildSidebar();
    refreshDropdown();
    cardContainer.innerHTML = "";
    currentCategory.textContent = "No category selected";
  }
});

// ================= VIEW MODAL CLOSE FIX =================
const viewModal = document.getElementById("viewModal");
const closeViewBtn = document.getElementById("closeViewBtn");

closeViewBtn.addEventListener("click", () => { viewModal.style.display = "none"; });

// ================= CLOSE MODALS =================
window.addEventListener("click", (e) => {
  if (e.target === categoryModal) categoryModal.style.display = "none";
  if (e.target === credentialModal) credentialModal.style.display = "none";
  if (e.target === viewModal) viewModal.style.display = "none";
});

// ================= RESTRICT NUMBERS =================
function restrictNumbers(inputElement) {
  inputElement.addEventListener("input", function () {
    this.value = this.value.replace(/[0-9]/g, "");
  });
}

restrictNumbers(document.getElementById("credName"));
restrictNumbers(document.getElementById("credURL"));

// ================= REMOVE LOADING CLASS =================
window.addEventListener("load", () => { document.body.classList.remove("loading"); });

// ================= SETTINGS MODAL =================
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");

settingsBtn.addEventListener("click", () => { settingsModal.style.display = "flex"; });
closeSettingsBtn.addEventListener("click", () => { settingsModal.style.display = "none"; });

window.addEventListener("click", (e) => { if (e.target === settingsModal) settingsModal.style.display = "none"; });

// ================= THEME SWITCH =================
const lightModeBtn = document.getElementById("lightModeBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

function setTheme(theme) {
  if (theme === "light") {
    document.body.style.background = "#f5f5f5";
    document.body.style.color = "#333";
  } else if (theme === "dark") {
    document.body.style.background = "linear-gradient(135deg, #0f0c29, #302b63, #24243e)";
    document.body.style.color = "white";
  }
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

lightModeBtn.addEventListener("click", () => setTheme("light"));
darkModeBtn.addEventListener("click", () => setTheme("dark"));

// ================= DROPDOWN CHANGE =================
categoryDropdown.addEventListener("change", (e) => {
  const selectedCategory = e.target.value;
  switchCategory(selectedCategory);
});

// ================= UNDO BUTTON =================
const undoCategoryBtn = document.getElementById("undoCategoryBtn");
undoCategoryBtn.addEventListener("click", () => {
  if (lastDeletedCategory && !categories[lastDeletedCategory.name]) {
    categories[lastDeletedCategory.name] = lastDeletedCategory.data;
    saveToStorage();
    rebuildSidebar();
    refreshDropdown();
    switchCategory(lastDeletedCategory.name); // auto select restored category
    lastDeletedCategory = null;
  }
});


// ================= SEARCH FUNCTIONALITY =================
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    // if search is empty, just render current category
    switchCategory(activeCategory);
    return;
  }

  let foundCategory = null;

  // Find the category that contains a matching credential
  for (let cat of Object.keys(categories)) {
    if (categories[cat].some(cred => cred.name.toLowerCase().includes(query))) {
      foundCategory = cat;
      break;
    }
  }

  if (foundCategory) {
    activeCategory = foundCategory;
    currentCategory.textContent = "Filtered by: " + foundCategory;
  } else {
    activeCategory = null;
    currentCategory.textContent = "No results found";
  }

  // Render cards
  cardContainer.innerHTML = "";
  if (foundCategory) {
    categories[foundCategory].forEach((cred) => {
      const card = document.createElement("div");
      card.className = "card";

      const title = document.createElement("div");
      title.textContent = cred.name;

      // Highlight if matches search query
      if (cred.name.toLowerCase().includes(query)) {
        title.style.backgroundColor = "#1abc9c"; // neon green highlight
        title.style.borderRadius = "4px";
        title.style.padding = "2px 4px";
      }

      card.appendChild(title);

      // Delete button
      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.textContent = "×";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = categories[foundCategory].indexOf(cred);
        categories[foundCategory].splice(index, 1);
        saveToStorage();
        renderCards();
        rebuildSidebar();
      });
      card.appendChild(delBtn);

      // Click to view modal
      card.addEventListener("click", () => {
        document.getElementById("viewTitle").textContent = cred.name;
        document.getElementById("viewUser").textContent = cred.user;
        document.getElementById("viewPass").textContent = cred.pass;
        document.getElementById("viewURL").textContent = cred.url;
        document.getElementById("viewNotes").textContent = cred.notes;
        document.getElementById("viewModal").style.display = "flex";
      });

      cardContainer.appendChild(card);
    });
  }
});
