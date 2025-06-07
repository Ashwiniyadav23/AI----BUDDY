import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

const input = document.getElementById('int');
const btn = document.getElementById('button');
const data = document.getElementById('data');
const saveBtn = document.getElementById('saveBtn');
const toggleSavedBtn = document.getElementById('toggleSavedBtn');
const savedData = document.getElementById('savedData');

let savedAnswersList = JSON.parse(localStorage.getItem('savedAnswersList') || "[]");
let savedVisible = true;

renderSavedAnswers();

btn.addEventListener('click', async () => {
  const prompt = input.value.trim();
  if (!prompt) {
    alert("Please enter a question.");
    return;
  }

  data.innerHTML = "Loading answers...";
  saveBtn.style.display = "none"; 
  toggleSavedBtn.style.display = "none";

  try {
    const genAI = new GoogleGenerativeAI("AIzaSyByPZh5onnFJZZaO_7SQs3wBe3fW33afk0");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const fullPrompt = `
    You are a helpful AI assistant.
    Please answer the following question in 5 different ways.
    Each answer should be:
    
    Clear and correct
    
    Easy to understand
    
    Explained in simple terms with a short example (if applicable)
    
    Focused and to the point (no unnecessary information)
        
    Question: ${prompt}
    `;
    

    const result = await model.generateContent(fullPrompt);
    const responseText = await result.response.text();

    const answers = responseText.split(/\n?\s*\d+\.\s+/).filter(Boolean);

    data.innerHTML = "";
    answers.forEach((answer, i) => {
      const div = document.createElement('div');
      div.classList.add('answer-block');
      div.innerHTML = `
        <label>
          <input type="checkbox" class="save-check" />
          <strong>Answer ${i + 1}:</strong><br>${answer.trim()}
        </label>
      `;
      data.appendChild(div);
    });

    saveBtn.style.display = "inline-block";
    toggleSavedBtn.style.display = savedAnswersList.length > 0 ? "inline-block" : "none";
    saveBtn.setAttribute('data-question', prompt);

  } catch (error) {
    data.innerHTML = "Error generating answers. Please try again.";
    console.error(error);
  }
});

saveBtn.addEventListener('click', async () => {
  const question = saveBtn.getAttribute('data-question');
  const selectedCheckboxes = document.querySelectorAll('.save-check:checked');
  if (selectedCheckboxes.length === 0) {
    alert("Please select at least one answer to save.");
    return;
  }

  const answers = Array.from(selectedCheckboxes).map(cb => {
    const label = cb.parentElement;
    return label.innerHTML.split('<br>').slice(1).join('<br>').trim();
  });

  const now = new Date();
  const savedDate = now.toLocaleString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const newId = Date.now().toString();
  savedAnswersList.push({ id: newId, question, answers, savedDate });
  localStorage.setItem('savedAnswersList', JSON.stringify(savedAnswersList));

  renderSavedAnswers();

  try {
    await fetch("https://ai-project-sigma-brown.vercel.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book: { question, answers, savedDate } }) 
    });
  } catch (err) {
    console.error("Error saving to MongoDB:", err);
  }

  savedVisible = true;
  savedData.style.display = "block";
  toggleSavedBtn.textContent = "👁️ Hide Saved Answers";

  // Clear checkboxes after save
  document.querySelectorAll('.save-check').forEach(cb => cb.checked = false);

  toggleSavedBtn.style.display = "inline-block";
});

toggleSavedBtn.addEventListener('click', () => {
  if (savedVisible) {
    savedData.style.display = "none";
    toggleSavedBtn.textContent = "👁️ Show Saved Answers";
    savedVisible = false;
  } else {
    savedData.style.display = "block";
    toggleSavedBtn.textContent = "👁️ Hide Saved Answers";
    savedVisible = true;
  }
});

function renderSavedAnswers() {
  if (savedAnswersList.length === 0) {
    savedData.innerHTML = "<em>No saved answers yet.</em>";
    toggleSavedBtn.style.display = "none";
    return;
  }

  savedData.innerHTML = "";
  savedAnswersList.forEach(({ id, question, answers, savedDate }) => {
    const block = document.createElement('div');
    block.classList.add('answer-block');
    block.dataset.id = id;
    block.style.position = 'relative';

    let innerHTML = `
      <strong>Q:</strong> ${question}<br>
      <small style="color: #666;">Saved on: ${savedDate}</small><br><br>
    `;

    answers.forEach((ans, i) => {
      innerHTML += `<strong>Saved Answer ${i + 1}:</strong><br>${ans}<br><br>`;
    });

    innerHTML += `<button class="delete-saved">Delete</button>`;

    block.innerHTML = innerHTML;
    savedData.appendChild(block);
  });

  document.querySelectorAll('.delete-saved').forEach(button => {
    button.addEventListener('click', (e) => {
      const parentBlock = e.target.closest('.answer-block');
      const idToDelete = parentBlock.dataset.id;

      savedAnswersList = savedAnswersList.filter(item => item.id !== idToDelete);
      localStorage.setItem('savedAnswersList', JSON.stringify(savedAnswersList));

      renderSavedAnswers();
    });
  });
}
