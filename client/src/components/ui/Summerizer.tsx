"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image"; // Import the Next.js Image component

export default function Summarizer() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      alert("Please select a valid image file.");
      return;
    }

    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImageToSupabase = async () => {
    if (!image) return alert("Please select an image first!");
    setLoading(true);
    setSummary("");

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      const { error } = await supabase.storage
        .from("summerize")
        .upload(filePath, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        alert("Upload failed!");
        console.error("Upload Error:", error);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("summerize")
        .getPublicUrl(filePath);
      
      if (!urlData) {
        alert("Failed to fetch image URL!");
        return;
      }

      const imageUrl = urlData.publicUrl;
      console.log("✅ Public Image URL:", imageUrl);
      
      const response = await fetch("https://study-mate-ai-server.vercel.app/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setSummary(responseData.summary);
      } else {
        alert(responseData.error || "Summarization failed!");
      }
    } catch (error) {
      alert("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Upload & Summarize Image</h2>

      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        className="mb-4" 
      />

      {preview && (
        <div className="relative w-full h-64 mb-4">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded"
            unoptimized={true} // Required for blob URLs
          />
        </div>
      )}

      <button
        onClick={uploadImageToSupabase}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Uploading & Summarizing..." : "Upload & Summarize"}
      </button>

      {summary && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}