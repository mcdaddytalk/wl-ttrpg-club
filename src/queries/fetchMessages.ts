export const fetchMessages = async (userId: string, method = 'unread') => {
    const response = await fetch(`/api/messages?user_id=${userId}&method=${method}`);
  
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    const data = await response.json();
    console.log('Data:  ', data)
    return data;
  };
  