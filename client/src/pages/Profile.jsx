import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../supabaseClient";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Load user data into form
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
      });
      setAvatarUrl(currentUser.avatar || "");
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadSuccess(false);
    setUploadError("");
    setUploading(true);

    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("profile")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      setUploadError("Upload failed");
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("profile")
      .getPublicUrl(fileName);

    setAvatarUrl(publicUrlData.publicUrl);
    setUploading(false);
    setUploadSuccess(true);

    setTimeout(() => {
      setUploadSuccess(false);
      setUploadError("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = currentUser?._id;
    if (!userId) {
      console.error("No user or missing ID");
      dispatch(updateUserFailure("User not authenticated or missing ID"));
      return;
    }

    dispatch(updateUserStart());

    try {
      const res = await fetch(`/api/user/update/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data.message || "Update failed"));
        return;
      }

      dispatch(updateUserSuccess(data.user));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      navigate("/"); // redirect after delete
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-sm mx-auto bg-white rounded-md shadow-md mt-6 text-sm">
      <h1 className="text-2xl font-semibold text-center mb-6">Profile</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={avatarUrl || "/placeholder.png"}
          alt="profile"
          className="rounded-full h-20 w-20 object-cover cursor-pointer self-center mb-2"
        />
        {uploading && <p className="text-blue-600 text-center">Uploading...</p>}
        {uploadSuccess && (
          <p className="text-green-600 text-center">Uploaded successfully!</p>
        )}
        {uploadError && (
          <p className="text-red-600 text-center">{uploadError}</p>
        )}

        <input
          name="username"
          type="text"
          placeholder="username"
          className="border p-2 rounded-md text-sm"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="email"
          className="border p-2 rounded-md text-sm"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          className="border p-2 rounded-md text-sm"
          value={formData.password}
          onChange={handleChange}
        />

        <button className="bg-slate-700 text-white rounded-md p-2 text-sm mt-2 hover:bg-slate-800 transition">
          Update Profile
        </button>
        <Link
          className="bg-green-700 p-2 text-white rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>

        <div className="flex justify-between mt-5">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer"
          >
            Delete Account
          </span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
            Sign Out
          </span>
        </div>
      </form>
    </div>
  );
}

export default Profile;
