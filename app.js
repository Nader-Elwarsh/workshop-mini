const CUSTOMER_KEY = "workshop_mini_customers";

function getCustomers() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCustomers(customers) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function renderCustomers() {
  const list = document.getElementById("customerList");
  if (!list) return;

  const customers = getCustomers();

  if (!customers.length) {
    list.innerHTML = '<div class="item">لا يوجد عملاء حتى الآن.</div>';
    return;
  }

  list.innerHTML = customers.map(customer => `
    <div class="item">
      <strong>${escapeHtml(customer.name)}</strong>
      <div>📞 ${escapeHtml(customer.phone)}</div>
      <div>📍 ${escapeHtml(customer.area)}${customer.village ? " - " + escapeHtml(customer.village) : ""} - ${escapeHtml(customer.address)}</div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const area = document.getElementById("area");
  const villageWrap = document.getElementById("villageWrap");
  const village = document.getElementById("village");
  const form = document.getElementById("customerForm");

  if (area) {
    area.addEventListener("change", () => {
      const isMatay = area.value === "مطاي";
      villageWrap.classList.toggle("hidden", !isMatay);
      village.required = isMatay;

      if (!isMatay) {
        village.value = "";
      }
    });
  }

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const customer = {
        id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
        name: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("customerPhone").value.trim(),
        area: area.value,
        village: area.value === "مطاي" ? village.value : "",
        address: document.getElementById("address").value.trim()
      };

      const customers = getCustomers();
      customers.push(customer);
      saveCustomers(customers);

      form.reset();
      villageWrap.classList.add("hidden");
      village.required = false;
      renderCustomers();
    });
  }

  renderCustomers();
});