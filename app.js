
document.addEventListener('DOMContentLoaded', loadEntries);

document.getElementById('med-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const entry = getEntryFromForm();
  if (!entry.name || !entry.time || !entry.dosage || !entry.profile) return;
  saveEntry(entry);
  addEntryToDOM(entry);
  document.getElementById('med-form').reset();
});

function formatTime(time24) {
  const [hour, minute] = time24.split(':');
  const h = parseInt(hour);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${minute} ${suffix}`;
}

function getEntryFromForm() {
  return {
    profile: document.getElementById('profile-select').value,
    name: document.getElementById('med-name').value,
    time: document.getElementById('med-time').value,
    dosage: document.getElementById('med-dosage').value,
    instruction: document.getElementById('med-instruction').value,
    notes: document.getElementById('med-notes').value
  };
}

function saveEntry(entry) {
  const entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  entries.push(entry);
  localStorage.setItem('medEntries', JSON.stringify(entries));
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  entries.forEach(entry => addEntryToDOM(entry));
}

function addEntryToDOM(entry) {
  const { profile, name, time, dosage, instruction, notes } = entry;
  const formattedTime = formatTime(time);

  const li = document.createElement('li');
  li.setAttribute('tabindex', 0);
  li.innerHTML = `
    <span><strong>${name}</strong> at ${formattedTime} — ${dosage} (Taken by: ${profile})<br>
    <em>Instructions:</em> ${instruction || 'None'}<br>
    <em>Notes:</em> ${notes || 'None'}</span>
    <div class="action-buttons">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  const editBtn = li.querySelector('.edit-btn');
  const deleteBtn = li.querySelector('.delete-btn');

  deleteBtn.onclick = () => {
    const modal = document.getElementById('confirm-modal');
    const overlay = document.getElementById('modal-overlay');
    modal.style.display = 'block';
    overlay.style.display = 'block';

    document.getElementById('confirm-yes').onclick = () => {
      deleteEntry(entry);
      li.remove();
      modal.style.display = 'none';
      overlay.style.display = 'none';
    };
    document.getElementById('confirm-no').onclick = () => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    };
  };

  editBtn.onclick = () => {
    const editForm = document.createElement('form');
    editForm.innerHTML = `
      <label>Name: <input type="text" name="name" value="${name}"></label><br>
      <label>Time: <input type="time" name="time" value="${time}"></label><br>
      <label>Dosage: <input type="text" name="dosage" value="${dosage}"></label><br>
      <label>Profile: <input type="text" name="profile" value="${profile}"></label><br>
      <label>Instructions: <input type="text" name="instruction" value="${instruction || ''}"></label><br>
      <label>Notes: <input type="text" name="notes" value="${notes || ''}"></label><br>
      <button type="submit">Save</button>
      <button type="button" class="cancel-btn">Cancel</button>
    `;
    li.innerHTML = '';
    li.appendChild(editForm);

    editForm.onsubmit = function(e) {
      e.preventDefault();
      const formData = new FormData(editForm);
      const updatedEntry = {
        name: formData.get('name'),
        time: formData.get('time'),
        dosage: formData.get('dosage'),
        profile: formData.get('profile'),
        instruction: formData.get('instruction'),
        notes: formData.get('notes')
      };
      updateEntry(entry, updatedEntry);
      li.remove();
      addEntryToDOM(updatedEntry);
    };

    editForm.querySelector('.cancel-btn').onclick = () => {
      li.innerHTML = '';
      addEntryToDOM(entry);
    };
  };

  document.getElementById('med-list').appendChild(li);
}

function deleteEntry(entryToDelete) {
  let entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  entries = entries.filter(entry =>
    !(entry.name === entryToDelete.name &&
      entry.time === entryToDelete.time &&
      entry.dosage === entryToDelete.dosage &&
      entry.profile === entryToDelete.profile)
  );
  localStorage.setItem('medEntries', JSON.stringify(entries));
}

function updateEntry(oldEntry, newEntry) {
  let entries = JSON.parse(localStorage.getItem('medEntries') || '[]');
  const index = entries.findIndex(entry =>
    entry.name === oldEntry.name &&
    entry.time === oldEntry.time &&
    entry.dosage === oldEntry.dosage &&
    entry.profile === oldEntry.profile
  );
  if (index !== -1) {
    entries[index] = newEntry;
    localStorage.setItem('medEntries', JSON.stringify(entries));
  }
}
