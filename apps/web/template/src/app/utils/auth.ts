export function getLoggedInUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.id || null;
    } catch (error) {
      console.error('❌ Failed to decode token', error);
      return null;
    }
  }
  