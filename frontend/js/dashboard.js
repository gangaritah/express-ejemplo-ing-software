const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'index.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

async function fetchEmployees() {
    const response = await fetch(`${API_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const employees = await response.json();
    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = '';
    employees.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'card';
        const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000'
            : '';
        const photoSrc = emp.photoUrl ? `${API_BASE}${emp.photoUrl}` : 'https://via.placeholder.com/100';

        card.innerHTML = `
            <img src="${photoSrc}" alt="${emp.name}">
            <h3>${emp.name}</h3>
            <p>Salary: $${emp.salary}</p>
        `;
        employeeList.appendChild(card);
    });
}

const addEmployeeForm = document.getElementById('addEmployeeForm');
addEmployeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('empName').value;
    const salary = document.getElementById('empSalary').value;
    const photo = document.getElementById('empPhoto').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('salary', salary);
    if (photo) {
        formData.append('photo', photo);
    }

    const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    if (response.ok) {
        document.getElementById('addEmployeeModal').style.display = 'none';
        fetchEmployees();
    } else {
        const errorData = await response.json();
        console.error('Error adding employee:', errorData);
        alert(`Failed to add employee: ${errorData.message || 'Unknown error'}`);
    }
});

document.getElementById('generatePayrollBtn').addEventListener('click', async () => {
    // For simplicity, we'll just get all IDs from the current list (in a real app, you might select them)
    const response = await fetch(`${API_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const employees = await response.json();
    const employeeIds = employees.map(e => e.id);

    const payrollResponse = await fetch(`${API_URL}/payrolls/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ employeeIds })
    });

    if (payrollResponse.ok) {
        alert('Payroll generated successfully!');
        fetchPayrolls(); // Refresh payroll list
    } else {
        alert('Failed to generate payroll');
    }
});

async function fetchPayrolls() {
    const response = await fetch(`${API_URL}/payrolls`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        console.error('Failed to fetch payrolls');
        return;
    }

    const payrolls = await response.json();
    const payrollList = document.getElementById('payrollList');
    payrollList.innerHTML = '';

    if (payrolls.length === 0) {
        payrollList.innerHTML = '<p class="empty-message">No payrolls generated yet.</p>';
        return;
    }

    // Create a table for payrolls
    const table = document.createElement('table');
    table.className = 'payroll-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${payrolls.map(p => `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.employeeId}</td>
                    <td>$${p.amount.toFixed(2)}</td>
                    <td>${new Date(p.date).toLocaleDateString()}</td>
                    <td><span class="status ${p.status}">${p.status}</span></td>
                </tr>
            `).join('')}
        </tbody>
    `;
    payrollList.appendChild(table);
}

fetchEmployees();
fetchPayrolls();
