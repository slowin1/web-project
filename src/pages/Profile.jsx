import { useState, useEffect } from "react";
<<<<<<< HEAD

// TODO: Backend integration (C# API)
// API endpoints:
// - GET /api/user/profile - fetch user profile
// - PUT /api/user/profile - update user profile
// - GET /api/appointments - fetch all appointments
// - PUT /api/appointments/:id - reschedule appointment
// - DELETE /api/appointments/:id - cancel appointment

// Mock data for development (replace with API calls)
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+373 60 123 456",
  avatar: "/work/work_01.jpg",
  memberSince: "January 2025",
  totalVisits: 12,
};

const mockAppointments = [
  {
    id: 1,
    service: "Massage Session",
    date: "Monday",
    time: "15:00",
    endTime: "16:00",
    location: "Room 204, Main Building",
    specialist: "Maria Ivanova",
    type: "Swedish Massage",
  },
  {
    id: 2,
    service: "Facial Treatment",
    date: "Wednesday",
    time: "10:30",
    endTime: "11:30",
    location: "Room 105, Spa Wing",
    specialist: "Elena Popescu",
    type: "Deep Cleansing Facial",
  },
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // TODO: Replace with actual API call to C# backend
  useEffect(() => {
    // Fetch user profile and appointments from backend
    // Promise.all([
    //   fetch('/api/user/profile').then(res => res.json()),
    //   fetch('/api/appointments').then(res => res.json())
    // ])
    // .then(([userData, appointmentsData]) => {
    //   setUser(userData);
    //   setAppointments(appointmentsData);
    //   setLoading(false);
    // });

    // Mock data for now
    setUser(mockUser);
    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  // TODO: Implement save profile function with API call
  const handleSaveProfile = () => {
    console.log("Save profile:", formData);
    // fetch('/api/user/profile', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    setEditMode(false);
  };

  // TODO: Implement reschedule function with API call
  const handleReschedule = (id) => {
    console.log("Reschedule appointment:", id);
    // fetch(`/api/appointments/${id}`, { method: 'PUT', ... })
  };

  // TODO: Implement cancel function with API call
  const handleCancel = (id) => {
    console.log("Cancel appointment:", id);
    // fetch(`/api/appointments/${id}`, { method: 'DELETE' })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p className="loading">Loading profile...</p>
=======
import { useNavigate } from "react-router-dom";

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const API_ENDPOINTS = {
  getProfile: `${API_BASE_URL}/Auth/profile`,
  updateProfile: `${API_BASE_URL}/Auth/profile`,
  changePassword: `${API_BASE_URL}/Auth/change-password`,
  logout: `${API_BASE_URL}/Auth/logout`,
  deleteAccount: `${API_BASE_URL}/Auth/account`,
  getBookings: `${API_BASE_URL}/ServiceBookings`,
  cancelBooking: `${API_BASE_URL}/ServiceBookings`,
};

function formatBookingTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseSpecialistFromDescription(description) {
  if (!description) return "";
  const match = description.match(/Специалист:\s*([^;]+)/i);
  return match ? match[1].trim() : "";
}

function mapApiBooking(booking) {
  return {
    id: booking.id,
    serviceId: booking.bookingId,
    serviceName: booking.bookingName,
    specialist: parseSpecialistFromDescription(booking.bookingDescription),
    date: booking.bookingDate,
    time: formatBookingTime(booking.bookingTime),
    status: "confirmed",
    duration: "-",
    price: "-",
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile update form
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
    loadBookings();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.getProfile, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setUser(null);
          setLoading(false);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load profile");
      }

      const data = await response.json();
      setUser(data.user);
      setProfileData({
        username: data.user.username || "",
        email: data.user.email || "",
      });
    } catch (err) {
      console.error("Profile load error:", err);

      // Fallback: use localStorage data if backend unavailable
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setProfileData({
            username: userData.username || "",
            email: userData.email || "",
          });
          setError("Backend unavailable. Showing cached data from login.");
          return;
        } catch (e) {
          console.error("Failed to parse stored user:", e);
        }
      }

      setError(err.message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load bookings
  const loadBookings = async () => {
    setBookingsLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setBookingsLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.getBookings, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data = await response.json();
      const apiBookings = Array.isArray(data) ? data : data.bookings || [];
      setBookings(apiBookings.map(mapApiBooking));
    } catch (err) {
      console.error("Bookings load error:", err);

      // Fallback: load from localStorage
      const storedBookings = localStorage.getItem("userBookings");
      if (storedBookings) {
        try {
          setBookings(JSON.parse(storedBookings));
        } catch (e) {
          console.error("Failed to parse stored bookings:", e);
        }
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_ENDPOINTS.cancelBooking}/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
      setSuccessMessage("Booking cancelled successfully");
    } catch (err) {
      console.error("Cancel booking error:", err);

      // Fallback: cancel in localStorage
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
      const updated = JSON.parse(localStorage.getItem("userBookings") || "[]");
      const cancelled = updated.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b,
      );
      localStorage.setItem("userBookings", JSON.stringify(cancelled));
      setSuccessMessage("Booking cancelled (offline mode)");
    }
  };

  // Handle profile data input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Handle password data input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Update profile handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(API_ENDPOINTS.updateProfile, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profileData.username,
          email: profileData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      setUser(data.user);
      setSuccessMessage("Profile updated successfully");
      setIsEditing(false);

      // Update local storage
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!passwordData.currentPassword) {
      setError("Current password is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(API_ENDPOINTS.changePassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      setSuccessMessage("Password changed successfully");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password change error:", err);
      setError(err.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        await fetch(API_ENDPOINTS.logout, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/LogIn");
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(API_ENDPOINTS.deleteAccount, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/LogIn");
    } catch (err) {
      console.error("Delete account error:", err);
      setError(err.message || "Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show guest view
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Profile</h1>
          <div className="profile-section">
            <p
              style={{
                fontFamily: "var(--type-3)",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                opacity: 0.7,
                textAlign: "center",
              }}
            >
              Please log in to view your profile
            </p>
            <button
              type="button"
              className="btn-edit"
              onClick={() => navigate("/LogIn")}
              style={{ marginTop: "1.5rem" }}
            >
              Go to Login
            </button>
          </div>
        </div>
>>>>>>> origin/main
      </div>
    );
  }

  return (
    <div className="profile-page">
<<<<<<< HEAD
      <div className="container">
        <div className="profile-card">
          <div className="card-header">
            <h1>Personal Information</h1>
          </div>

          <div className="profile-content">
            <div className="avatar">
              <img src={user.avatar} alt="avatar" />
            </div>

            <div className="user-info">
              {editMode ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name || user.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email || user.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone || user.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSaveProfile}>
                      Save
                    </button>
                    <button
                      className="btn-cancel-edit"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="info-section">
                    <div className="info-header">
                      <ion-icon name="person-outline"></ion-icon>
                      <h3>{user.name}</h3>
                    </div>
                    <div className="info-details">
                      <div className="info-item">
                        <ion-icon name="mail-outline"></ion-icon>
                        <div className="info-text">
                          <span className="info-label">Email</span>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <ion-icon name="call-outline"></ion-icon>
                        <div className="info-text">
                          <span className="info-label">Phone</span>
                          <p>{user.phone}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <ion-icon name="calendar-outline"></ion-icon>
                        <div className="info-text">
                          <span className="info-label">Member Since</span>
                          <p>{user.memberSince}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <ion-icon name="footsteps-outline"></ion-icon>
                        <div className="info-text">
                          <span className="info-label">Total Visits</span>
                          <p>{user.totalVisits}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setFormData({});
                      setEditMode(true);
                    }}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="appointments-section">
          <h2>Appointments</h2>

          {appointments.length === 0 ? (
            <p className="no-appointments">No upcoming appointments</p>
          ) : (
            <div className="appointments-grid">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-icon">
                      <ion-icon name="calendar-outline"></ion-icon>
                    </div>
                    <div className="appointment-info">
                      <h3>{appointment.service}</h3>
                      <p className="appointment-date">
                        {appointment.date}, {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="appointment-details">
                    <div className="appointment-item">
                      <ion-icon name="time-outline"></ion-icon>
                      <span>
                        {appointment.time} - {appointment.endTime}
                      </span>
                    </div>
                    <div className="appointment-item">
                      <ion-icon name="location-outline"></ion-icon>
                      <span>{appointment.location}</span>
                    </div>
                    <div className="appointment-item">
                      <ion-icon name="person-outline"></ion-icon>
                      <span>Specialist: {appointment.specialist}</span>
                    </div>
                    <div className="appointment-item">
                      <ion-icon name="sparkles-outline"></ion-icon>
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <button
                      className="btn-reschedule"
                      onClick={() => handleReschedule(appointment.id)}
                    >
                      Reschedule
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
=======
      <div className="profile-container">
        <h1>My Profile</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* User Info Section */}
        <div className="profile-section">
          <h2>Account Information</h2>

          {isEditing ? (
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({
                      username: user.username || "",
                      email: user.email || "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Username:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <button
                type="button"
                className="btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* My Bookings Section */}
        <div className="profile-section bookings-section">
          <h2>My Bookings</h2>

          {bookingsLoading ? (
            <p className="bookings-loading">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <span className="no-bookings-icon">📅</span>
              <p>No bookings yet</p>
              <button
                type="button"
                className="btn-book"
                onClick={() => navigate("/lab")}
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => {
                const isActive =
                  booking.status === "confirmed" ||
                  booking.status === "pending";

                return (
                  <div
                    key={booking.id}
                    className={`booking-card ${booking.status}`}
                  >
                    <div className="booking-card-glow" />
                    <div className="booking-header">
                      <div className="booking-service-info">
                        <div>
                          <h3 className="booking-service-name">
                            {booking.serviceName || "Unknown Service"}
                          </h3>
                          <p className="booking-specialist">
                            {booking.specialist || "Специалист не указан"}
                          </p>
                        </div>
                      </div>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-details">
                      <div className="booking-detail">
                        <span className="detail-label">📅 Date</span>
                        <span className="detail-value">
                          {new Date(booking.date).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="booking-detail">
                        <span className="detail-label">🕐 Time</span>
                        <span className="detail-value">{booking.time}</span>
                      </div>
                      <div className="booking-detail">
                        <span className="detail-label">⏱ Duration</span>
                        <span className="detail-value">
                          {booking.duration}
                        </span>
                      </div>
                      <div className="booking-detail">
                        <span className="detail-label">💰 Price</span>
                        <span className="detail-value price-value">
                          {booking.price} руб
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <button
                        type="button"
                        className="btn-cancel-booking"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="profile-section">
          <h2>Security</h2>

          {isChangingPassword ? (
            <form className="profile-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="btn-edit"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </button>
          )}
        </div>

        {/* Account Actions */}
        <div className="profile-section profile-actions">
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Logout
          </button>

          <button
            type="button"
            className="btn-delete"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            Delete Account
          </button>
        </div>
>>>>>>> origin/main
      </div>
    </div>
  );
}
