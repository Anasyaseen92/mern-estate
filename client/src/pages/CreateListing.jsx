import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length < 1 || selectedFiles.length > 6) {
      setError("Please select between 1 and 6 image files.");
      return;
    }

    const isAllImages = selectedFiles.every((file) =>
      file.type.startsWith("image/")
    );
    if (!isAllImages) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    setFiles(selectedFiles);
  };

  const storeImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("profile")
      .upload(`listings/${fileName}`, file);

    if (error) {
      console.error("Upload error:", error.message);
      setError("Upload failed.");
      return null;
    }

    const { data: publicData } = supabase.storage
      .from("profile")
      .getPublicUrl(`listings/${fileName}`);

    return publicData.publicUrl;
  };

  const handleImageSubmit = async () => {
  if (files.length < 1 || files.length > 6) {
    setError("Please upload between 1 to 6 images.");
    return;
  }

  try {
    // Upload all images in parallel using Promise.all
    const uploadPromises = files.map((file) => storeImage(file));
    const urls = await Promise.all(uploadPromises);

    const validUrls = urls.filter(Boolean); // Filter out failed uploads

    if (validUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...validUrls]);
      setSuccessMessage("Images uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }

    setFiles([]);
    setError("");
  } catch (err) {
    console.error("Parallel upload error:", err);
    setError("Something went wrong during upload.");
  }
};


  const handleDelete = (url) => {
    setImageUrls((prev) => prev.filter((img) => img !== url));
  };

  return (
    <main className="p-3  max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spoot</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p>
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}

          <div className="flex gap-3 flex-wrap">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="object-cover w-full h-full rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(url)}
                  className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <button className="p-3 bg-slate-700 text-white rounded-lg disabled:opacity-80 uppercase hover:opacity-95">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
