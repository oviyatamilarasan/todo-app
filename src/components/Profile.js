import { useState, useEffect, useRef } from 'react';
import './Profile.css';

function Profile() {
  const [name, setName] = useState('Oviya Tamilarasan');
  const [avatar, setAvatar] = useState('');
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem('profileName');
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedName) setName(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const startEdit = () => {
    setTempName(name);
    setEditing(true);
  };

  const saveProfile = () => {
    const newName = tempName.trim() || name;
    setName(newName);
    localStorage.setItem('profileName', newName);
    setEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      localStorage.setItem('profileAvatar', reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-card">
      <div className="profile-avatar-wrap" onClick={() => fileInputRef.current.click()}>
        {avatar ? (
          <img src={avatar} alt="avatar" className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="avatar-edit-icon">📷</div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="profile-info">
        {editing ? (
          <div className="profile-edit-row">
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveProfile()}
              className="profile-name-input"
              autoFocus
            />
            <button className="profile-save-btn" onClick={saveProfile}>✅</button>
          </div>
        ) : (
          <div className="profile-edit-row">
            <h3>{name}</h3>
            <button className="profile-edit-btn" onClick={startEdit}>✏️</button>
          </div>
        )}
        <p className="profile-tag">Keep going, you're doing great! 🌟</p>
      </div>
    </div>
  );
}

export default Profile;