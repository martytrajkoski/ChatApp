import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import Input from "../../Components/Inputs/Input";
import { User } from "../../types/types";
import { getSeasonBackground } from "../../Components/Background/Background";
import Loader from "../../Components/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | undefined>(undefined);
  const [newUsername, setNewUsername] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    fetchUser();
    const seasonBackground = getSeasonBackground();
    setBackgroundImage(seasonBackground);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosClient.get("user");
      setUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    await handleUsername();
    await handlePassword();
    await handleProfilePicture();
  };

  const handleUsername = async () => {
    if(newUsername){
      try {
        await axiosClient.patch("auth/update-user", {
          name: newUsername,
        });
        window.location.reload();
        alert("Username updated successfully!");
      } catch (error) {
        console.error("Error updating username", error);
        alert("Failed to update username.");
      }
    }
  };

  const handlePassword = async () => {
    if (currentPassword && newPassword) {
      try {
        await axiosClient.patch("auth/change-password", {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword
        });
        alert("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password", error);
        alert("Failed to update password.");
      }
    }
  };

  const handleProfilePicture = async () => {
    if (newProfilePicture) {
      const formData = new FormData();
      formData.append("profile_picture", newProfilePicture);

      try {
        await axiosClient.post("auth/change-profile-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        window.location.reload();
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error updating profile picture", error);
        alert("Failed to update profile picture.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("auth/logout");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (selectedFile && validTypes.includes(selectedFile.type)) {
        setNewProfilePicture(selectedFile);
    } else {
        alert('Please select a valid image file (jpeg, png, jpg, gif).');
        setNewProfilePicture(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        setNewProfilePicture(e.dataTransfer.files[0]);
      }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
  };

  if (!user) return <Loader />;

  return (
    <div
      className="profile"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="profile-page">
        <div className="profile-info">
          <div className="info">
            <img
              src={user?.profile_picture ? `${user.profile_picture}` : ""}
              alt="Profile"
              className="profile-picture"
            />
            <h2 className="username-display">{user.name}</h2>
            <p className="account-created">
              Account created: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <div className="edit-section">
          <div className="edit-section-header">
            <div className="header">
              <h3>Edit Profile</h3>
              <i onClick={() => navigate(-1)}>
                <FontAwesomeIcon
                  icon={faClose}
                  style={{ width: "30px", height: "30px" }}
                />
              </i>
            </div>
            <form>
              <Input
                type="text"
                label="New Username:"
                value={newUsername}
                handleChange={(value) => {
                  typeof value === "string" && setNewUsername(value);
                }}
                placeholder="Enter new username"
                className="input-field"
              />
            </form>
          </div>
          <div className="edit-password-image">
            <form>
              <Input
                type="password"
                label="Current Password:"
                value={currentPassword}
                handleChange={(value) => {
                  typeof value === "string" && setCurrentPassword(value);
                }}
                placeholder="Enter current password"
                className="input-field"
              />
              <Input
                type="password"
                label="New Password:"
                value={newPassword}
                handleChange={(value) => {
                  typeof value === "string" && setNewPassword(value);
                }}
                placeholder="Enter new password"
                className="input-field"
              />
              <Input
                type="password"
                label="Confirm New Password:"
                value={confirmPassword}
                handleChange={(value) => {
                  typeof value === "string" && setConfirmPassword(value);
                }}
                placeholder="Confirm new password"
                className="input-field"
              />
            </form>
            <div
              className="upload-container"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="upload-content">
                <div className="upload-icon">
                  <FontAwesomeIcon
                    icon={faUpload}
                    style={{ width: "30px", height: "30px" }}
                  />
                </div>
                <p>
                  Drag & drop or{" "}
                  <span className="upload-choose">Choose profile picture</span>{" "}
                  to upload
                </p>
                <p className="upload-formats">PNG, JPG, JPEG</p>
                <input
                  type="file"
                  className="upload-input"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                />
              </div>
              {newProfilePicture && <p>Selected file: {newProfilePicture.name}</p>}
            </div>
          </div>
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
