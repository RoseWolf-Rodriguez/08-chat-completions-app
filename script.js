// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

// Create an array to store the conversation history
const messages = [
  {
    role: 'system',
    content: 'You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination. If the user\'s query is unrelated to budget travel, respond by stating that you do not know.'
  }
];

// Listen for form submission
chatForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the page from reloading

  // Get the user's question from the input field
  const userQuestion = userInput.value;

  // Add the user's message to the conversation history
  messages.push({ role: 'user', content: userQuestion });

  // Show a loading message while waiting for the AI's response
  responseContainer.textContent = 'Thinking...';

  // Clear the input field for the next question
  userInput.value = '';

  // Send a POST request to the OpenAI API
  let aiReply = '';
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      // Send the conversation history in the request body
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages, max_completion_tokens: 800
        temperature: 0.7
        // Note: The temperature can be adjusted to control the randomness of the AI's responses
        frequency_penalty: 0.8,
      })
    });

    // Parse and store the response data
    const result = await response.json();

    // Check if the response is valid and contains the AI's reply
    if (
      result &&
      result.choices &&
      result.choices[0] &&
      result.choices[0].message &&
      result.choices[0].message.content
    ) {
      aiReply = result.choices[0].message.content;
    } else {
      // If the response is not as expected, show an error message
      aiReply = "Sorry, I couldn't understand the response from the server.";
      console.error('Unexpected API response:', result);
    }
  } catch (error) {
    // If there is a network or other error, show an error message
    aiReply = "Sorry, something went wrong. Please try again later.";
    console.error('API request failed:', error);
  }

  // Add the AI's reply to the conversation history
  messages.push({ role: 'assistant', content: aiReply });

  // Display the AI's reply or error message on the page, preserving line breaks and spacing
  responseContainer.textContent = aiReply;
  responseContainer.style.whiteSpace = 'pre-wrap';
});