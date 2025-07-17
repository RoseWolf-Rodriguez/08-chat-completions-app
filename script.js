// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Listen for form submission
chatForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the page from reloading

  // Get the user's question from the input field
  const userQuestion = userInput.value;

  // Show a loading message while waiting for the AI's response
  responseContainer.textContent = 'Thinking...';

  // Send a POST request to the OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST', // We are POST-ing data to the API
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
      'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
    },
    // Send model details and system message
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination. If the user\'s query is unrelated to budget travel, respond by stating that you do not know.' },
        { role: 'user', content: userQuestion }
      ]
    })
  });

  // Parse and store the response data
  const result = await response.json();

  // Get the AI's reply from the response
  const aiReply = result.choices[0].message.content;

  // Display the AI's reply on the page, preserving line breaks and spacing
  responseContainer.textContent = aiReply;
  responseContainer.style.whiteSpace = 'pre-wrap'; // Preserve formatting

  // Clear the input field for the next question
  userInput.value = '';
});