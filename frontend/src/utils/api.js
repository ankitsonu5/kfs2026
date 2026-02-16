const BASE_URL = "http://localhost:8080";

const getHeaders = (extraHeaders = {}) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = {
        "Content-Type": "application/json",
        ...extraHeaders,
    };

    if (token) {
        headers["Authorization"] = token;
    }

    return headers;
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        const error = new Error(data.message || "Request failed");
        error.response = { data, status: response.status };
        throw error;
    }
    return { data, status: response.status };
};

const api = {
    get: async (url, config = {}) => {
        const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: getHeaders(config.headers),
        });
        return handleResponse(response);
    },

    post: async (url, body, config = {}) => {
        const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
        const isFormData = body instanceof FormData;

        const headers = getHeaders(config.headers);
        if (isFormData) {
            delete headers["Content-Type"]; // Let browser set boundary for FormData
        }

        const response = await fetch(fullUrl, {
            method: "POST",
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });
        return handleResponse(response);
    },

    put: async (url, body, config = {}) => {
        const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
        const isFormData = body instanceof FormData;

        const headers = getHeaders(config.headers);
        if (isFormData) {
            delete headers["Content-Type"];
        }

        const response = await fetch(fullUrl, {
            method: "PUT",
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async (url, config = {}) => {
        const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
        const response = await fetch(fullUrl, {
            method: "DELETE",
            headers: getHeaders(config.headers),
        });
        return handleResponse(response);
    },
};

export default api;
