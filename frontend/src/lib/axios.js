import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // sends the httpOnly refresh token cookie automatically
});

// Attach access token to every outgoing request
api.interceptors.request.use((config) => {
    const accessToken = getAccessToken(); // where this lives, discussed below

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// Handle expired access tokens automatically
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.data.accessToken;
                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest); // retry the original failed request
            } catch (refreshError) {
                clearAccessToken();
                window.location.href = '/login'; // force logout
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;