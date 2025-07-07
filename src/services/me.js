import axios from 'axios';

export async function me() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Erreur dans la fonction me():", error);
    throw error;
  }
}
