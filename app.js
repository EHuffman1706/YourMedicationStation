document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('medForm');
  const medList = document.querySelector('#medList tbody');
  const historyList = document.querySelector('#historyList tbody');
  const submitButton = form.querySelector('button[type="submit"]');
  let editingRow = null;
  let lastDeleted = null;

  function saveToLocalStorage() {
    const data = [];
    medList.querySelectorAll('tr').forEach(row => {
      data.push({
        medName: row.children[0].textContent,
        dosage: row.children[1].textContent,
        person: row.children[2].textContent,
        frequency: row.children[3].textContent,
        time: row.children[4].textContent,
      });
    });
    localStorage.setItem('medications', JSON.stringify(data));
  }

  function saveHistory(entry) {
    const stored = JSON.parse(localStorage.getItem('medHistory')) || [];
    stored.push(entry);
    localStorage.setItem('medHistory', JSON.stringify(stored));
  }

  function loadFromLocalStorage() {
    const stored = localStorage.getItem('medications');
    if (stored) {
      JSON.parse(stored).forEach(data => addRow(data));
    }

    const history = localStorage.getItem('medHistory');
    if (history) {
      JSON.parse(history).forEach(entry => appendToHistory(entry));
    }
  }

  function appendToHistory({ medName, dosage, person, date, status }) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${medName}</td>
      <td>${dosage}</td>
      <td>${person}</td>
      <td>${date}</td>
      <td>${status}</td>
    `;
    historyList.appendChild(row);
  }

  function addRow({ medName, dosage, person, frequency, time }) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${medName}</td>
      <td>${dosage}</td>
      <td>${person}</td>
      <td>${frequency}</td>
      <td>${time}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="taken-btn">Taken</button>
        <button class="skipped-btn">Skipped</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
    medList.appendChild(row);

    row.querySelector('.edit-btn').addEventListener('click', () => {
      document.getElementById('medName').value = medName;
      document.getElementById('dosage').value = dosage;
      document.getElementById('person').value = person;
      document.getElementById('frequency').value = frequency;
      document.getElementById('time').value = time;
      editingRow = row;
      submitButton.textContent = "Update Reminder";
    });

    row.querySelector('.taken-btn').addEventListener('click', () => {
      const date = new Date().toLocaleString();
      const entry = { medName, dosage, person, date, status: "Taken" };
      appendToHistory(entry);
      saveHistory(entry);
    });

    row.querySelector('.skipped-btn').addEventListener('click', () => {
      const date = new Date().toLocaleString();
      const entry = { medName, dosage, person, date, status: "Skipped" };
      appendToHistory(entry);
      saveHistory(entry);
    });

    
    const createPickupBtn = document.createElement('button');
    createPickupBtn.textContent = "Create Pickup Reminder";
    createPickupBtn.addEventListener('click', () => {
      document.getElementById('pickupMedName').value = medName;
      document.getElementById('pickupPerson').value = person;
      document.getElementById('pickupQuantity').focus();
    });
    row.children[5].appendChild(createPickupBtn);

    row.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm("Are you sure you want to delete this reminder?")) {
        row.remove();
        saveToLocalStorage();
      }
    });

    saveToLocalStorage();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const medName = document.getElementById('medName').value;
    const dosage = document.getElementById('dosage').value;
    const person = document.getElementById('person').value;
    const frequency = document.getElementById('frequency').value;
    const time = document.getElementById('time').value;

    const customFreq = document.getElementById('customFreq').value;
    const newData = { medName, dosage, person, frequency, customFreq, time };

    if (editingRow) {
      editingRow.remove();
      editingRow = null;
      submitButton.textContent = "Add Reminder";
    }

    addRow(newData);
    form.reset();
  });

  loadFromLocalStorage();
});

  // Pickup Reminder Logic
  const pickupForm = document.getElementById('pickupForm');
  const upcomingTable = document.querySelector('#upcomingPickups tbody');
  const pastTable = document.querySelector('#pastPickups tbody');

  function savePickupData() {
    const pickups = [];
    document.querySelectorAll('#upcomingPickups tbody tr, #pastPickups tbody tr').forEach(row => {
      pickups.push({
        medName: row.children[0].textContent,
        quantity: row.children[1].textContent,
        person: row.children[2].textContent,
        date: row.children[3].textContent
      });
    });
    localStorage.setItem('pickupReminders', JSON.stringify(pickups));
  }

  function loadPickupData() {
    const stored = JSON.parse(localStorage.getItem('pickupReminders')) || [];
    stored.forEach(entry => addPickupRow(entry));
  }

  function addPickupRow({ medName, quantity, person, date }) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${medName}</td>
      <td>${quantity}</td>
      <td>${person}</td>
      <td>${date}</td>
      <td><button class="delete-pickup">Delete</button></td>
    `;
    const today = new Date().toISOString().split("T")[0];
    const targetTable = date >= today ? upcomingTable : pastTable;
    targetTable.appendChild(row);

    row.querySelector('.delete-pickup').addEventListener('click', () => {
      if (confirm("Delete this pickup reminder?")) {
        row.remove();
        savePickupData();
      }
    });
  }

  pickupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const medName = document.getElementById('pickupMedName').value;
    const quantity = document.getElementById('pickupQuantity').value;
    const person = document.getElementById('pickupPerson').value;
    const date = document.getElementById('pickupDate').value;

    const newEntry = { medName, quantity, person, date };
    addPickupRow(newEntry);
    savePickupData();
    pickupForm.reset();
  });

  loadPickupData();

  // Running Low Alerts
  const runningLowTable = document.querySelector('#runningLowTable tbody');

  function loadRunningLowAlerts() {
    runningLowTable.innerHTML = "";
    const now = new Date();
    const oneWeekFromNow = new Date(now);
    oneWeekFromNow.setDate(now.getDate() + 7);

    const stored = JSON.parse(localStorage.getItem('pickupReminders')) || [];
    stored.forEach(entry => {
      const { medName, quantity, person, date } = entry;
      const quantityNum = parseInt(quantity, 10);
      if (isNaN(quantityNum)) return;

      const pickupDate = new Date(date);
      const expectedEnd = new Date(pickupDate);
      expectedEnd.setDate(pickupDate.getDate() + quantityNum);

      if (expectedEnd > now && expectedEnd <= oneWeekFromNow) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${medName}</td>
          <td>${quantity}</td>
          <td>${person}</td>
          <td>${pickupDate.toLocaleDateString()}</td>
          <td>${quantity}</td>
          <td>${expectedEnd.toLocaleDateString()}</td>
        `;
        runningLowTable.appendChild(row);
      }
    });
  }

  loadRunningLowAlerts();

  // Chart filter toggle
  document.getElementById('chartFilter').addEventListener('change', (e) => {
    const selected = e.target.value;
    document.getElementById('chart-weekly').style.display = selected === 'weekly' ? 'block' : 'none';
    document.getElementById('chart-monthly').style.display = selected === 'monthly' ? 'block' : 'none';
    document.getElementById('chart-3months').style.display = selected === '3months' ? 'block' : 'none';
  });

  document.getElementById('pickupChartFilter').addEventListener('change', (e) => {
    const selected = e.target.value;
    document.getElementById('pickup-chart-weekly').style.display = selected === 'weekly' ? 'block' : 'none';
    document.getElementById('pickup-chart-monthly').style.display = selected === 'monthly' ? 'block' : 'none';
    document.getElementById('pickup-chart-3months').style.display = selected === '3months' ? 'block' : 'none';
  });

  document.getElementById('lowChartFilter').addEventListener('change', (e) => {
    const selected = e.target.value;
    document.getElementById('low-chart-weekly').style.display = selected === 'weekly' ? 'block' : 'none';
    document.getElementById('low-chart-monthly').style.display = selected === 'monthly' ? 'block' : 'none';
    document.getElementById('low-chart-3months').style.display = selected === '3months' ? 'block' : 'none';
  });

  // Email Reminder Front-End Logic
  const reminderForm = document.getElementById('reminderSettingsForm');
  const testButton = document.getElementById('sendTestReminder');

  reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const settings = {
      email: document.getElementById('userEmail').value,
      frequency: document.getElementById('reminderFrequency').value,
      includeMeds: document.getElementById('includeMeds').checked,
      includePickups: document.getElementById('includePickups').checked,
      includeLow: document.getElementById('includeLow').checked,
      time: document.getElementById('reminderTimes').value
    };
    localStorage.setItem('reminderSettings', JSON.stringify(settings));
    alert('Reminder settings saved!');
  });

  testButton.addEventListener('click', () => {
    const settings = JSON.parse(localStorage.getItem('reminderSettings'));
    if (settings) {
      alert('Sending test reminder to: ' + settings.email + 
            '\nFrequency: ' + settings.frequency +
            '\nInclude: ' +
            (settings.includeMeds ? ' Meds' : '') +
            (settings.includePickups ? ' Pickups' : '') +
            (settings.includeLow ? ' Running Low') +
            '\nTime: ' + settings.time);
    } else {
      alert('Please save your reminder settings first.');
    }
  });
