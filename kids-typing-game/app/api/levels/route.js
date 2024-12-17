   // kids-typing-game/app/api/levels/route.js

   export async function GET(request) {
    try {
      // Fetch levels from your backend or database
      const response = await fetch('http://localhost:8000/api/levels');
      const levels = await response.json();

      // Return the levels as a JSON response
      return new Response(JSON.stringify(levels), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error fetching levels:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch levels' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }