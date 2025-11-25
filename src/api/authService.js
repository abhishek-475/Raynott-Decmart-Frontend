import api from "./api";

// REGISTER USER
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// LOGIN USER
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// GET LOGGED IN USER PROFILE
export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// UPDATE USER PROFILE
export const updateProfile = async (data) => {
  try {
    console.log('Sending update data:', data);
    const res = await api.put("/auth/profile", data);
    console.log('Update response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Update Profile Full Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};


// GET ALL USERS (Admin only)
export const getAllUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};

// UPDATE USER ROLE (Admin only)
export const updateUserRole = async (userId, role) => {
  const res = await api.put(`/auth/users/${userId}/role`, { role });
  return res.data;
};

// DELETE USER (Admin only)
export const deleteUser = async (userId) => {
  const res = await api.delete(`/auth/users/${userId}`);
  return res.data;
};

// CREATE ADMIN USER (Admin only)
export const createAdminUser = async (data) => {
  const res = await api.post("/auth/create-admin", data);
  return res.data;
};

// REGISTER INITIAL ADMIN (For setup)
export const registerInitialAdmin = async (data) => {
  const res = await api.post("/auth/admin/register", data);
  return res.data;
};