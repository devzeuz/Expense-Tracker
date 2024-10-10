const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
});

const transactionListElement = document.getElementById("transactionList");
const transactionFormElement = document.getElementById("transactionForm");
const statusElement = document.getElementById("statusMessage");
const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

transactionFormElement.addEventListener("submit", handleFormSubmit);

function updateDisplayTotals() {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach(({ amount, type }) => {
    if (type === "income") {
      totalIncome += amount;
    } else if (type === "expense") {
      totalExpenses += amount;
    }
  });

  const netBalance = totalIncome - totalExpenses;

  balanceElement.textContent = currencyFormat.format(netBalance);
  incomeElement.textContent = currencyFormat.format(totalIncome);
  expenseElement.textContent = currencyFormat.format(totalExpenses * -1);
}

function renderTransactions() {
  transactionListElement.innerHTML = "";

  if (transactions.length === 0) {
    statusElement.textContent = "No transactions available.";
    return;
  }

  statusElement.textContent = "";

  transactions.forEach(({ id, name, amount, date, type }) => {
    const transactionItem = document.createElement("li");

    transactionItem.innerHTML = `
      <div class="transaction-details">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>
      <div class="transaction-amount ${type}">
        <span>${currencyFormat.format(
          type === "income" ? amount : -amount
        )}</span>
      </div>
      <div class="transaction-actions">
        <button onclick="removeTransaction(${id})">Delete</button>
      </div>
    `;

    transactionListElement.appendChild(transactionItem);
  });
}

renderTransactions();
updateDisplayTotals();

function removeTransaction(id) {
  const index = transactions.findIndex((transaction) => transaction.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
    saveTransactions();
    updateDisplayTotals();
    renderTransactions();
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(transactionFormElement);
  const newTransaction = {
    id: Date.now(),
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: formData.get("date"),
    type: formData.get("type") === "on" ? "income" : "expense",
  };

  transactions.push(newTransaction);
  saveTransactions();
  updateDisplayTotals();
  renderTransactions();
  transactionFormElement.reset();
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
