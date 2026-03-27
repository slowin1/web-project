import { useState, useEffect } from "react";

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
      </div>
    );
  }

  return (
    <div className="profile-page">
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
      </div>
    </div>
  );
}
