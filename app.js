
document.getElementById('med-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('med-name').value;
  const time = document.getElementById('med-time').value;
  const dosage = document.getElementById('med-dosage').value;

  if (!name || !time || !dosage) return;

  addEntry(name, time, dosage);
  document.getElementById('med-form').reset();
});

function addEntry(name, time, dosage) {
  const entry = document.createElement('li');
  const textSpan = document.createElement('span');
  textSpan.textContent = `${name} at ${time} — ${dosage}`;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => {
    const newName = prompt('Edit medication name:', name);
    const newTime = prompt('Edit time:', time);
    const newDosage = prompt('Edit dosage:', dosage);
    if (newName && newTime && newDosage) {
      name = newName;
      time = newTime;
      dosage = newDosage;
      textSpan.textContent = `${name} at ${time} — ${dosage}`;
    }
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => entry.remove();

  entry.appendChild(textSpan);
  entry.appendChild(editBtn);
  entry.appendChild(deleteBtn);

  document.getElementById('med-list').appendChild(entry);
}
