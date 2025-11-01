import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import supabase from "../../supabaseClient";

export default function EditReport({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: "",
    category: "Electronics",
    description: "",
    date_time: "",
    location: "",
    status: "Lost",
    contact_info: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const locationOptions = [
    "Alpha Zone", "Central Library", "Girls Hostel", "Boys Hostel", "SQ1", "SQ2",
    "Exploratorium", "Sportorium", "Turing Block", "Martin Luther Block",
    "Rockfeller Block", "Main Gate",
  ];

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Error loading report");
        navigate("/listings");
      } else {
        setFormData(data);
      }
      setLoading(false);
    };
    fetchReport();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    let imageUrl = formData.image_url;

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("report-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("report-images")
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from("reports")
      .update({
        item_name: formData.item_name,
        category: formData.category,
        description: formData.description,
        date_time: formData.date_time,
        location: formData.location,
        status: formData.status,
        contact_info: formData.contact_info,
        image_url: imageUrl,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update report");
    } else {
      toast.success("Report updated successfully");
      navigate("/listings");
    }

    setLoading(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-800 dark:text-white">
        Loading...
      </div>
    );

  return (
    <div className="pt-5 px-4 pb-8 flex justify-center items-start md:h-[calc(100vh-64px)] md:overflow-hidden bg-gray-200 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">
          Edit Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name & Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Books</option>
                <option>Clothing</option>
                <option>Footwear</option>
                <option>Bags & Wallets</option>
                <option>Stationery</option>
                <option>ID & Access Cards</option>
                <option>Documents</option>
                <option>Keys</option>
                <option>Eyewear</option>
                <option>Sports & Gym Gear</option>
                <option>Water Bottles & Drinkware</option>
                <option>Others</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Date & Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="date_time"
                value={formData.date_time?.slice(0, 16) || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select Location</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status + Contact */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option>Lost</option>
                <option>Found</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Contact Info
              </label>
              <input
                type="text"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white border border-gray-400 dark:border-gray-600 file:cursor-pointer file:bg-gray-300 dark:file:bg-gray-700 file:text-black dark:file:text-white file:px-2 file:py-1 file:rounded file:hover:bg-gray-400 dark:file:hover:bg-gray-600"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 font-bold rounded transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Updating..." : "Update Report"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p className="text-base font-medium text-gray-800 dark:text-gray-200">
            View updated reports?{" "}
            <Link
              to="/listings"
              className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              View your listings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
