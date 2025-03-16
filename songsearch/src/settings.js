import React from "react";
import { useForm } from "react-hook-form";
import './Settings.css';

const SettingsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Settings Updated:", data);
    alert("Settings updated successfully!");
  };

  const validateAge = (value) => {
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18 || "You must be at least 18 years old";
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
        {/* Display Name */}
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input
            type="text"
            {...register("displayName", { required: "Display name is required" })}
            className="form-input"
          />
          {errors.displayName && <p className="form-error">{errors.displayName.message}</p>}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
            className="form-input"
          />
          {errors.phoneNumber && <p className="form-error">{errors.phoneNumber.message}</p>}
        </div>

        {/* Profile Picture Upload */}
        <div className="form-group">
          <label className="form-label">Profile Picture</label>
          <input type="file" {...register("profilePicture")} className="form-input" />
        </div>

        {/* Theme Selection */}
        <div className="form-group">
          <label className="form-label">Theme</label>
          <select {...register("theme")} className="form-input">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="form-group">
          <label className="form-label">Notification Preferences</label>
          <select {...register("notifications")} className="form-input">
            <option value="all">All Notifications</option>
            <option value="email">Email Only</option>
            <option value="sms">SMS Only</option>
            <option value="none">No Notifications</option>
          </select>
        </div>

        {/* Bio */}
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            {...register("bio")}
            className="form-input"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            {...register("dob", { 
              required: "Date of birth is required",
              validate: validateAge 
            })}
            className="form-input"
          />
          {errors.dob && <p className="form-error">{errors.dob.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="form-button"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;