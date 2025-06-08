document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('medForm');
  const medList = document.querySelector('#medList tbody');
  const submitButton = form.querySelector('button[type="submit"]');
  let editingRow = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const medName = document.getElementById('medName').value;
    const dosage = document.getElementById('dosage').value;
    const person = document.getElementById('person').value;
    const frequency = document.getElementById('frequency').value;
    const time = document.getElementById('time').value;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${medName}</td>
      <td>${dosage}</td>
      <td>${person}</td>
      <td>${frequency}</td>
      <td>${time}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    if (editingRow) {
      editingRow.replaceWith(row);
      editingRow = null;
      submitButton.textContent = "Add Reminder";
    } else {
      medList.appendChild(row);
    }

    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    editBtn.addEventListener('click', () => {
      document.getElementById('medName').value = row.children[0].textContent;
      document.getElementById('dosage').value = row.children[1].textContent;
      document.getElementById('person').value = row.children[2].textContent;
      document.getElementById('frequency').value = row.children[3].textContent;
      document.getElementById('time').value = row.children[4].textContent;
      editingRow = row;
      submitButton.textContent = "Update Reminder";
    });

    deleteBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to delete this reminder?")) {
        row.remove();
      }
    });

    form.reset();
  });
});
