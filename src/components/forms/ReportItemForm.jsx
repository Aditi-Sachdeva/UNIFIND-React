import { useState } from "react";
import { toast } from "react-hot-toast";
import supabase from "../../supabaseClient";

const getCurrentISTDateTime = () => { // Gives current date and time in IST
  const now = new Date(); // gives current date and time
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);//coversion to milliseconds and IST
  

  //Gives exact year,month,day,hour and second
  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, "0");//padstart=convert single digit number to double
  const day = String(istTime.getUTCDate()).padStart(2, "0");
  const hours = String(istTime.getUTCHours()).padStart(2, "0");
  const minutes = String(istTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(istTime.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;// combine everything
};

//Form data object hai jo gets updated whenever new values are added
export default function ReportItemForm({ user }) {
  const [formData, setFormData] = useState({ // usestate=variable that remember data, formData = stores data, setFormData = update data
    itemName: "",
    category: "Electronics",
    description: "",
    dateTime: getCurrentISTDateTime(),
    location: "",
    status: "Lost",
    contactInfo: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);//track whether form is currently submitting or not
  

  //list of arrays of location which is shown in dropdown
  const locationOptions = [
    "Alpha Zone", "Central Library", "Girls Hostel", "Boys Hostel", "SQ1", "SQ2",
    "Exploratorium", "Sportorium", "Turing Block", "Martin Luther Block",
    "Rockfeller Block", "Main Gate",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!user || !user.id) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    let imageUrl = null;

    if (formData.image) {
      const fileExt = formData.image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("report-images")
        .upload(fileName, formData.image);

      if (uploadError) {
        toast.error("Image upload failed");
        console.error("Upload error:", uploadError);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("report-images")
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("reports").insert([
      {
        user_id: user.id,
        item_name: formData.itemName,
        category: formData.category,
        description: formData.description,
        date_time: formData.dateTime,
        location: formData.location,
        status: formData.status,
        contact_info: formData.contactInfo,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message, error.details);
      toast.error("Submission failed");
    } else {
      toast.success("Report submitted");
      setFormData({
        itemName: "",
        category: "Electronics",
        description: "",
        dateTime: getCurrentISTDateTime(),
        location: "",
        status: "Lost",
        contactInfo: "",
        image: null,
      });
    }

    setLoading(false);
  };

  return (
    <div className="pt-8 px-4 pb-8 flex justify-center items-start md:h-[calc(100vh-64px)] md:overflow-hidden">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">
          Report Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Item Name + Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
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
              placeholder="Describe the item..."
              rows="3"
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Date & Time + Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
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

          {/* Status + Contact Info */}
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
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 font-bold rounded transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Submitting..." : "Report Item"}
          </button>
        </form>
      </div>
    </div>
  );
}


