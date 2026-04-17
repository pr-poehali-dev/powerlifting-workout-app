const URLS = {
  auth: 'https://functions.poehali.dev/3b613a32-86f0-46d4-b423-f443848f3014',
  records: 'https://functions.poehali.dev/9d1c0d3c-a036-43b2-9a63-0f51ef734ada',
  profile: 'https://functions.poehali.dev/7427402f-f50d-4b2e-b7dc-b26994d34c70',
};

function getToken(): string | null {
  return localStorage.getItem('ironforce_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { 'Content-Type': 'application/json', 'X-Auth-Token': token } : { 'Content-Type': 'application/json' };
}

export const api = {
  auth: {
    register: async (email: string, password: string, name: string) => {
      const res = await fetch(`${URLS.auth}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      return res.json();
    },
    login: async (email: string, password: string) => {
      const res = await fetch(`${URLS.auth}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return res.json();
    },
    me: async () => {
      const res = await fetch(`${URLS.auth}/me`, { headers: authHeaders() });
      return res.json();
    },
  },

  records: {
    getAll: async () => {
      const res = await fetch(URLS.records, { headers: authHeaders() });
      return res.json();
    },
    add: async (lift: string, weight: number, notes?: string) => {
      const res = await fetch(URLS.records, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ lift, weight, notes }),
      });
      return res.json();
    },
  },

  profile: {
    get: async () => {
      const res = await fetch(URLS.profile, { headers: authHeaders() });
      return res.json();
    },
    update: async (data: { name?: string; body_weight?: number; gender?: string; weight_category?: string }) => {
      const res = await fetch(URLS.profile, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },

  saveToken: (token: string) => localStorage.setItem('ironforce_token', token),
  clearToken: () => localStorage.removeItem('ironforce_token'),
  getToken,
};
