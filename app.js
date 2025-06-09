
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
    notes: document.getElementById('med-notes').value,
    temporary: document.getElementById('med-temporary').checked,
    startDate: document.getElementById('med-start-date').value,
    endDate: document.getElementById('med-end-date').value,
    noRefills: document.getElementById('med-no-refills').checked
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
  const { profile, name, time, dosage, instruction, notes, temporary, startDate, endDate, noRefills } = entry;
  const formattedTime = formatTime(time);
  const li = document.createElement('li');
  li.setAttribute('tabindex', 0);
  li.innerHTML = `
    <span><strong>${name}</strong> at ${formattedTime} — ${dosage} (Taken by: ${profile})<br>
    <em>Instructions:</em> ${instruction || 'None'}<br>
    <em>Temporary:</em> ${temporary ? 'Yes' : 'No'}<br>
    <em>Start:</em> ${startDate || 'N/A'}<br>
    <em>End:</em> ${endDate || 'N/A'}<br>
    <em>No Refills:</em> ${noRefills ? 'Yes' : 'No'}<br>
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

  document.getElementById('current-med-list').appendChild(li);
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
