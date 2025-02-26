// Define data structure to store transactions
let transactions = [
    { id: 1, title: "Samosa", amount: 150, type: "expense", category: "food", date: "2024-03-20" },
    { id: 2, title: "Movie", amount: 300, type: "expense", category: "entertainment", date: "2024-03-21" },
    { id: 3, title: "Auto", amount: 50, type: "expense", category: "travel", date: "2024-03-22" },
    { id: 4, title: "Salary", amount: 25000, type: "income", category: "salary", date: "2024-03-15" }
];

// Initialize wallet balance
let walletBalance = 4500;
let currentPage = 1;
const itemsPerPage = 4;

// DOM elements
const walletBalanceElement = document.querySelector('.wallet-card .amount');
const expensesElement = document.querySelector('.expense-card .amount');
const transactionList = document.querySelector('.transaction-list');
const pagination = document.querySelector('.pagination');
const expenseModal = document.getElementById('expenseModal');
const incomeModal = document.getElementById('incomeModal');
const expenseForm = document.getElementById('expenseForm');
const incomeForm = document.getElementById('incomeForm');

// Initialize the application
function init() {
    updateWalletBalance();
    updateExpenseTotal();
    renderTransactions();
    updatePagination();
    renderExpenseChart();
    renderPieChart();
    setupEventListeners();
}

// Calculate and update wallet balance
function updateWalletBalance() {
    walletBalanceElement.textContent = '₹' + walletBalance;
}

// Calculate and update total expenses
function updateExpenseTotal() {
    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0);
    
    expensesElement.textContent = '₹' + totalExpenses;
}

// Render transactions in the list
function renderTransactions() {
    // Clear existing transactions
    transactionList.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);
    
    // Render each transaction
    paginatedTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.dataset.id = transaction.id;
        
        // Icon based on category
        let iconSvg = '';
        if (transaction.category === 'food') {
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>';
        } else if (transaction.category === 'entertainment') {
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>';
        } else if (transaction.category === 'travel') {
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2l.64-2.54c.24-.959.24-1.97 0-2.92l-1.07-4.27A2 2 0 0 0 18.65 5H5.35a2 2 0 0 0-1.92 1.27L2.36 10.54c-.24.95-.24 1.97 0 2.92L3 16h2"></path><path d="M14 17V6"></path><path d="M10 17V6"></path><path d="M5 9v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"></path><path d="M12 14h.01"></path></svg>';
        } else {
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
        }
        
        // Format date
        const formattedDate = formatDate(transaction.date);
        
        li.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-icon">
                    ${iconSvg}
                </div>
                <div class="transaction-details">
                    <span class="transaction-name">${transaction.title}</span>
                    <span class="transaction-date">${formattedDate}</span>
                </div>
            </div>
            <div class="transaction-right">
                <span class="transaction-amount${transaction.type === 'income' ? ' income' : ''}">${transaction.type === 'income' ? '+' : ''}₹${transaction.amount}</span>
                <div class="action-buttons">
                    <button class="action-btn delete-btn" data-id="${transaction.id}">-</button>
                    <button class="action-btn edit-btn" data-id="${transaction.id}">✎</button>
                </div>
            </div>
        `;
        
        transactionList.appendChild(li);
    });
    
    // Add event listeners to new buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteTransaction);
    });
    
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEditTransaction);
    });
}

// Format date from YYYY-MM-DD to Month DD, YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    pagination.innerHTML = '';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'page-btn';
    prevButton.textContent = '←';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTransactions();
            updatePagination();
        }
    });
    pagination.appendChild(prevButton);
    
    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `page-btn${i === currentPage ? ' active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderTransactions();
            updatePagination();
        });
        pagination.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'page-btn';
    nextButton.textContent = '→';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTransactions();
            updatePagination();
        }
    });
    pagination.appendChild(nextButton);
}

// Render expense chart
function renderExpenseChart() {
    // Group expenses by category
    const expensesByCategory = {};
    transactions
        .filter(transaction => transaction.type === 'expense')
        .forEach(transaction => {
            if (!expensesByCategory[transaction.category]) {
                expensesByCategory[transaction.category] = 0;
            }
            expensesByCategory[transaction.category] += transaction.amount;
        });
    
    // Sort categories by amount
    const sortedCategories = Object.keys(expensesByCategory).sort(
        (a, b) => expensesByCategory[b] - expensesByCategory[a]
    );
    
    // Get total expenses
    const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
    
    // Clear current chart
    const topExpensesSection = document.querySelector('.section:nth-child(2)');
    const chartTitle = topExpensesSection.querySelector('h2');
    topExpensesSection.innerHTML = '';
    topExpensesSection.appendChild(chartTitle);
    
    // Render bars for each category
    sortedCategories.forEach(category => {
        const amount = expensesByCategory[category];
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-name">${category.charAt(0).toUpperCase() + category.slice(1)} - ₹${amount}</div>
            <div class="expense-bar" style="width: ${percentage}%;"></div>
        `;
        
        topExpensesSection.appendChild(categoryItem);
    });
}

// Render pie chart
function renderPieChart() {
    // Group expenses by category
    const expensesByCategory = {};
    transactions
        .filter(transaction => transaction.type === 'expense')
        .forEach(transaction => {
            if (!expensesByCategory[transaction.category]) {
                expensesByCategory[transaction.category] = 0;
            }
            expensesByCategory[transaction.category] += transaction.amount;
        });
    
    // Calculate total expenses
    const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
    
    // Generate conic gradient for pie chart
    let conicGradient = '';
    let startPercentage = 0;
    
    // Colors for categories
    const categoryColors = {
        food: '#8b5cf6',
        entertainment: '#f59e0b',
        travel: '#fbbf24',
        other: '#10b981'
    };
    
    Object.keys(expensesByCategory).forEach(category => {
        const amount = expensesByCategory[category];
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        const color = categoryColors[category] || '#999';
        
        if (percentage > 0) {
            const endPercentage = startPercentage + percentage;
            conicGradient += `${color} ${startPercentage}% ${endPercentage}%, `;
            startPercentage = endPercentage;
        }
    });
    
    // Remove trailing comma and space
    conicGradient = conicGradient.slice(0, -2);
    
    // Apply conic gradient to pie chart
    const pieChart = document.querySelector('.pie-chart');
    pieChart.style.background = `conic-gradient(${conicGradient})`;
    
    // Update legend
    const legend = document.querySelector('.legend');
    legend.innerHTML = '';
    
    Object.keys(expensesByCategory).forEach(category => {
        if (expensesByCategory[category] > 0) {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${categoryColors[category] || '#999'}"></div>
                <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
            `;
            legend.appendChild(legendItem);
        }
    });
}

// Handle form submission for adding expense
function handleAddExpense(event) {
    event.preventDefault();
    
    const form = event.target;
    const title = form.querySelector('input[placeholder="Title"]').value;
    const amount = parseFloat(form.querySelector('input[placeholder="Amount"]').value);
    const category = form.querySelector('select').value;
    const date = form.querySelector('input[type="date"]').value;
    
    if (title && amount && category && date) {
        const newTransaction = {
            id: Date.now(),
            title,
            amount,
            type: 'expense',
            category,
            date
        };
        
        transactions.unshift(newTransaction);
        walletBalance -= amount;
        
        updateWalletBalance();
        updateExpenseTotal();
        renderTransactions();
        updatePagination();
        renderExpenseChart();
        renderPieChart();
        
        // Close modal and reset form
        expenseModal.style.display = 'none';
        form.reset();
    }
}

// Handle form submission for adding income
function handleAddIncome(event) {
    event.preventDefault();
    
    const form = event.target;
    const title = form.querySelector('input[placeholder="Source"]').value;
    const amount = parseFloat(form.querySelector('input[placeholder="Amount"]').value);
    const category = form.querySelector('select').value;
    const date = form.querySelector('input[type="date"]').value;
    
    if (title && amount && category && date) {
        const newTransaction = {
            id: Date.now(),
            title,
            amount,
            type: 'income',
            category,
            date
        };
        
        transactions.unshift(newTransaction);
        walletBalance += amount;
        
        updateWalletBalance();
        updateExpenseTotal();
        renderTransactions();
        updatePagination();
        renderExpenseChart();
        renderPieChart();
        
        // Close modal and reset form
        incomeModal.style.display = 'none';
        form.reset();
    }
}

// Handle transaction deletion
function handleDeleteTransaction(event) {
    const id = parseInt(event.target.dataset.id);
    const transaction = transactions.find(t => t.id === id);
    
    if (confirm(`Are you sure you want to delete ${transaction.title}?`)) {
        if (transaction.type === 'expense') {
            walletBalance += transaction.amount;
        } else {
            walletBalance -= transaction.amount;
        }
        
        transactions = transactions.filter(t => t.id !== id);
        
        updateWalletBalance();
        updateExpenseTotal();
        renderTransactions();
        updatePagination();
        renderExpenseChart();
        renderPieChart();
    }
}

// Handle transaction editing
function handleEditTransaction(event) {
    const id = parseInt(event.target.dataset.id);
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction.type === 'expense') {
        // Populate expense form
        const form = document.getElementById('expenseForm');
        form.querySelector('input[placeholder="Title"]').value = transaction.title;
        form.querySelector('input[placeholder="Amount"]').value = transaction.amount;
        form.querySelector('select').value = transaction.category;
        form.querySelector('input[type="date"]').value = transaction.date;
        
        // Add hidden input for transaction ID
        let idInput = form.querySelector('input[name="transaction-id"]');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.name = 'transaction-id';
            form.appendChild(idInput);
        }
        idInput.value = id;
        
        // Change button text
        form.querySelector('.btn-add').textContent = 'Update Expense';
        
        // Show modal
        expenseModal.style.display = 'flex';
    } else {
        // Populate income form
        const form = document.getElementById('incomeForm');
        form.querySelector('input[placeholder="Source"]').value = transaction.title;
        form.querySelector('input[placeholder="Amount"]').value = transaction.amount;
        form.querySelector('select').value = transaction.category;
        form.querySelector('input[type="date"]').value = transaction.date;
        
        // Add hidden input for transaction ID
        let idInput = form.querySelector('input[name="transaction-id"]');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.name = 'transaction-id';
            form.appendChild(idInput);
        }
        idInput.value = id;
        
        // Change button text
        form.querySelector('.btn-add').textContent = 'Update Income';
        
        // Show modal
        incomeModal.style.display = 'flex';
    }
}

// Handle expense form submission (add or update)
function handleExpenseFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const title = form.querySelector('input[placeholder="Title"]').value;
    const amount = parseFloat(form.querySelector('input[placeholder="Amount"]').value);
    const category = form.querySelector('select').value;
    const date = form.querySelector('input[type="date"]').value;
    const idInput = form.querySelector('input[name="transaction-id"]');
    
    if (title && amount && category && date) {
        if (idInput && idInput.value) {
            // Update existing transaction
            const id = parseInt(idInput.value);
            const transaction = transactions.find(t => t.id === id);
            
            if (transaction) {
                // Adjust wallet balance
                walletBalance += transaction.amount; // Revert old amount
                walletBalance -= amount; // Apply new amount
                
                // Update transaction
                transaction.title = title;
                transaction.amount = amount;
                transaction.category = category;
                transaction.date = date;
            }
            
            // Reset form and button text
            form.querySelector('.btn-add').textContent = 'Add Expense';
            idInput.value = '';
        } else {
            // Add new transaction
            const newTransaction = {
                id: Date.now(),
                title,
                amount,
                type: 'expense',
                category,
                date
            };
            
            transactions.unshift(newTransaction);
            walletBalance -= amount;
        }
        
        updateWalletBalance();
        updateExpenseTotal();
        renderTransactions();
        updatePagination();
        renderExpenseChart();
        renderPieChart();
        
        // Close modal and reset form
        expenseModal.style.display = 'none';
        form.reset();
    }
}

// Handle income form submission (add or update)
function handleIncomeFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const title = form.querySelector('input[placeholder="Source"]').value;
    const amount = parseFloat(form.querySelector('input[placeholder="Amount"]').value);
    const category = form.querySelector('select').value;
    const date = form.querySelector('input[type="date"]').value;
    const idInput = form.querySelector('input[name="transaction-id"]');
    
    if (title && amount && category && date) {
        if (idInput && idInput.value) {
            // Update existing transaction
            const id = parseInt(idInput.value);
            const transaction = transactions.find(t => t.id === id);
            
            if (transaction) {
                // Adjust wallet balance
                walletBalance -= transaction.amount; // Revert old amount
                walletBalance += amount; // Apply new amount
                
                // Update transaction
                transaction.title = title;
                transaction.amount = amount;
                transaction.category = category;
                transaction.date = date;
            }
            
            // Reset form and button text
            form.querySelector('.btn-add').textContent = 'Add Income';
            idInput.value = '';
        } else {
            // Add new transaction
            const newTransaction = {
                id: Date.now(),
                title,
                amount,
                type: 'income',
                category,
                date
            };
            
            transactions.unshift(newTransaction);
            walletBalance += amount;
        }
        
        updateWalletBalance();
        updateExpenseTotal();
        renderTransactions();
        updatePagination();
        renderExpenseChart();
        renderPieChart();
        
        // Close modal and reset form
        incomeModal.style.display = 'none';
        form.reset();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Show expense modal
    document.getElementById('addExpenseBtn').addEventListener('click', function() {
        document.getElementById('expenseModal').style.display = 'flex';
    });
    
    // Hide expense modal
    document.getElementById('cancelExpenseBtn').addEventListener('click', function() {
        document.getElementById('expenseModal').style.display = 'none';
        document.getElementById('expenseForm').reset();
        document.querySelector('#expenseForm .btn-add').textContent = 'Add Expense';
    });
    
    // Show income modal
    document.getElementById('addIncomeBtn').addEventListener('click', function() {
        document.getElementById('incomeModal').style.display = 'flex';
    });
    
    // Hide income modal
    document.getElementById('cancelIncomeBtn').addEventListener('click', function() {
        document.getElementById('incomeModal').style.display = 'none';
        document.getElementById('incomeForm').reset();
        document.querySelector('#incomeForm .btn-add').textContent = 'Add Income';
    });
    
    // Close modals when clicking outside
    document.getElementById('expenseModal').addEventListener('click', function(event) {
        if (event.target === this) {
            this.style.display = 'none';
            document.getElementById('expenseForm').reset();
            document.querySelector('#expenseForm .btn-add').textContent = 'Add Expense';
        }
    });
    
    document.getElementById('incomeModal').addEventListener('click', function(event) {
        if (event.target === this) {
            this.style.display = 'none';
            document.getElementById('incomeForm').reset();
            document.querySelector('#incomeForm .btn-add').textContent = 'Add Income';
        }
    });
    
    // Form submissions
    document.getElementById('expenseForm').addEventListener('submit', handleExpenseFormSubmit);
    document.getElementById('incomeForm').addEventListener('submit', handleIncomeFormSubmit);
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Local storage functions
function saveToLocalStorage() {
    localStorage.setItem('expenseTrackerTransactions', JSON.stringify(transactions));
    localStorage.setItem('expenseTrackerBalance', walletBalance);
}

function loadFromLocalStorage() {
    const savedTransactions = localStorage.getItem('expenseTrackerTransactions');
    const savedBalance = localStorage.getItem('expenseTrackerBalance');
    
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
    
    if (savedBalance) {
        walletBalance = parseFloat(savedBalance);
    }
}

// Add local storage persistence
function addLocalStoragePersistence() {
    // Save data after every update
    ['updateWalletBalance', 'updateExpenseTotal', 'renderTransactions', 
     'handleAddExpense', 'handleAddIncome', 'handleDeleteTransaction',
     'handleExpenseFormSubmit', 'handleIncomeFormSubmit'].forEach(functionName => {
        const originalFunction = window[functionName];
        window[functionName] = function() {
            originalFunction.apply(this, arguments);
            saveToLocalStorage();
        };
    });
    
    // Load data on initialization
    const originalInit = init;
    init = function() {
        loadFromLocalStorage();
        originalInit();
    };
}

// Add local storage persistence
addLocalStoragePersistence();