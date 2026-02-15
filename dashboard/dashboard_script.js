const categoryList = document.getElementById("categoryList");
const categoryDropdown = document.getElementById("categoryDropdown");
const currentCategory = document.getElementById("currentCategory");
const cardContainer = document.getElementById("cardContainer");

let categories = {
  "Social Media": [],
  "Banking": [],
  "Shopping": []
};
let activeCategory = "Social Media";

// Attach delete logic to category <li>
function attachCategoryDelete(li, cat) {
  const delBtn = li.querySelector(".delete-cat");
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    delete categories[cat]; // remove category object
    li.remove();            // remove from sidebar
    refreshDropdown();      // refresh dropdown
    updateCounts();
    if (activeCategory === cat) {
      activeCategory = Object.keys(categories)[0] || "";
      if (activeCategory) switchCategory(activeCategory);
      else {
        currentCategory.textContent = "No category selected";
        cardContainer.innerHTML = "";
      }
    }
  });
}

// Populate dropdown
function refreshDropdown() {
  categoryDropdown.innerHTML = "";
  Object.keys(categories).forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryDropdown.appendChild(option);
  });
}
refreshDropdown();

// Update sidebar counts
function updateCounts() {
  [...categoryList.children].forEach(li => {
    const cat = li.dataset.category;
    if (categories[cat]) {
      li.innerHTML = `${cat} (${categories[cat].length}) <button class="delete-cat">×</button>`;
      attachCategoryDelete(li, cat);
      li.addEventListener("click", () => switchCategory(cat));
    }
  });
}

// Switch category
function switchCategory(cat) {
  activeCategory = cat;
  currentCategory.textContent = "Filtered by: " + cat;
  renderCards();
}

// Render cards
function renderCards() {
  cardContainer.innerHTML = "";
  if (!categories[activeCategory]) return;
  categories[activeCategory].forEach((cred, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = cred.name;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "×";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      categories[activeCategory].splice(index, 1);
      renderCards();
      updateCounts();
    });

    card.appendChild(delBtn);
    card.addEventListener("click", () => {
      alert(`Account: ${cred.name}\nUsername: ${cred.user}\nPassword: ${cred.pass}\nURL: ${cred.url}\nNotes: ${cred.notes}`);
    });
    cardContainer.appendChild(card);
  });
}
renderCards();
updateCounts();

// Sidebar click for existing categories
[...categoryList.children].forEach(li => {
  const cat = li.dataset.category;
  li.addEventListener("click", () => switchCategory(cat));
  attachCategoryDelete(li, cat);
});

// Dropdown change
categoryDropdown.addEventListener("change", (e) => switchCategory(e.target.value));

// Add category modal
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
    const li = document.createElement("li");
    li.dataset.category = newCategory;
    li.innerHTML = `${newCategory} (0) <button class="delete-cat">×</button>`;
    li.addEventListener("click", () => switchCategory(newCategory));
    attachCategoryDelete(li, newCategory);
    categoryList.appendChild(li);

    refreshDropdown();
    updateCounts();
    document.getElementById("newCategory").value = "";
    categoryModal.style.display = "none";
  }
});

// Add credential modal
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

  if (name && user && pass) {
    categories[activeCategory].push({ name, user, pass, url, notes });
    renderCards();
    updateCounts();
    credentialModal.style.display = "none";

    // Reset form
    document.getElementById("credName").value = "";
    document.getElementById("credUser").value = "";
    document.getElementById("credPass").value = "";
    document.getElementById("credURL").value = "";
    document.getElementById("credNotes").value = "";
  }
});

// Settings modal
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const timeoutSlider = document.getElementById("timeout");
const timeoutValue = document.getElementById("timeoutValue");
const lightModeBtn = document.getElementById("lightModeBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");

settingsBtn.addEventListener("click", () => settingsModal.style.display = "flex");
closeSettingsBtn.addEventListener("click", () => settingsModal.style.display = "none");

// Auto-lock timeout slider
timeoutSlider.addEventListener("input", () => {
  timeoutValue.textContent = timeoutSlider.value;
});

// Theme toggle
lightModeBtn.addEventListener("click", () => {
  document.body.style.background = "linear-gradient(135deg, #ffffff, #dddddd)";
});
darkModeBtn.addEventListener("click", () => {
  document.body.style.background = "linear-gradient(135deg, #0f0c29, #302b63, #24243e)";
});

// Delete all data
deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all data?")) {
    categories = {};
    categoryList.innerHTML = "";
    cardContainer.innerHTML = "";
    refreshDropdown();
    currentCategory.textContent = "No category selected";
    alert("All data deleted.");
  }
});

// Close modals if clicking outside
window.addEventListener("click", (e) => {
  if (e.target === categoryModal) categoryModal.style.display = "none";
  if (e.target === credentialModal) credentialModal.style.display = "none";
  if (e.target === settingsModal) settingsModal.style.display = "none";
});