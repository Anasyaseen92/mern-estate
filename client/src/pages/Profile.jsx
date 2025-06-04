import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../supabaseClient';

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadSuccess(false);
    setUploadError('');
    setUploadProgress(0);
    setUploading(true);

    const fileName = `${Date.now()}_${file.name}`;

    // Use Supabase's upload with onUploadProgress callback
    const { data, error } = await supabase.storage
      .from('profile')
      .upload(fileName, file, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(percent);
          }
        },
      });

    setUploading(false);

    if (error) {
      console.error('Upload failed:', error);
      setUploadError('Upload failed. Please try again.');
      setUploadSuccess(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('profile')
      .getPublicUrl(fileName);

    setAvatarUrl(publicUrlData.publicUrl);
    setUploadSuccess(true);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadError('');
      setUploadProgress(0);
    }, 5000);

    console.log('Public URL:', publicUrlData.publicUrl);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-md shadow-md mt-8">
      <h1 className="text-2xl font-semibold text-center mb-6">Profile</h1>
      <form className="flex flex-col gap-3">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={
            avatarUrl ||
            'https://via.placeholder.com/100x100?text=Upload' // fallback
          }
          alt="profile"
          className="rounded-full h-20 w-20 object-cover cursor-pointer self-center mb-2"
        />
        {/* Show progress or messages */}
        {uploading && (
          <p className="text-blue-600 text-center mb-2">
            Uploading... {uploadProgress}%
          </p>
        )}
        {uploadSuccess && !uploading && (
          <p className="text-green-600 text-center mb-2">
            Profile uploaded successfully
          </p>
        )}
        {uploadError && !uploading && (
          <p className="text-red-600 text-center mb-2">{uploadError}</p>
        )}
        <input
          type="text"
          placeholder="username"
          className="border p-2 rounded-md text-sm"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-2 rounded-md text-sm"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-2 rounded-md text-sm"
        />
        <button className="bg-slate-700 text-white rounded-md p-2 text-sm mt-2 hover:bg-slate-800 transition">
          Update Profile
        </button>
      </form>
      <div className="flex justify-between mt-4 text-sm">
        <span className="text-red-700 cursor-pointer hover:underline">Delete</span>
        <span className="text-red-700 cursor-pointer hover:underline">Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
