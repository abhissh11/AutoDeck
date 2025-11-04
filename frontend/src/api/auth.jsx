const API_BASE_URL = "http://localhost:3000/api/auth";



export const signupUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    // If not OK, extract the message (even if it's plain text)
    if (!response.ok) {
      let message = 'Signup failed';
      try {
        const errorData = await response.json();
        message = errorData.message || errorData || message;
      } catch {
        const text = await response.text();
        message = text || message;
      }
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error during signup');
  }
};


// Signin API call
export const signinUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Handle errors with message from backend
    if (!response.ok) {
      let message = 'Signin failed';
      try {
        const errorData = await response.json();
        message = errorData.message || errorData || message;
      } catch {
        const text = await response.text();
        message = text || message;
      }
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error during signin');
  }
};
