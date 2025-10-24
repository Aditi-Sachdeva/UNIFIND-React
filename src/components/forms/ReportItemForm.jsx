import { useState } from "react";
import { toast } from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import supabase from "../../supabaseClient";

// Corrected: Function to get current IST datetime in YYYY-MM-DDTHH:MM format
const getCurrentISTDateTime = () => {
  const now = new Date();
  // Convert UTC time to IST by adding 5 hours 30 minutes
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

  const year = istTime.getUTCFullYear();
  const month = String(istTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istTime.getUTCDate()).padStart(2, "0");
  const hours = String(istTime.getUTCHours()).padStart(2, "0");
  const minutes = String(istTime.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function ReportItemForm({ user }) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Electronics",
    description: "",
    dateTime: getCurrentISTDateTime(), // Default to current IST
    location: "",
    status: "Lost",
    contactInfo: "",
    image: null,
  });

  const locationOptions = [
    { value: "Alpha Zone", label: "Alpha Zone" },
    { value: "Beta Zone", label: "Beta Zone" },
    { value: "Omega Zone", label: "Omega Zone" },
    { value: "Central Library", label: "Central Library" },
    { value: "Chitkara Woods", label: "Chitkara Woods" },
    { value: "Girls Hostel", label: "Girls Hostel" },
    { value: "Boys Hostel", label: "Boys Hostel" },
    { value: "SQ1", label: "SQ1" },
    { value: "SQ2", label: "SQ2" },
    { value: "Exploratorium", label: "Exploratorium" },
    { value: "Sportorium", label: "Sportorium" },
    { value: "Gym", label: "Gym" },
    { value: "Turing Block", label: "Turing Block" },
    { value: "De Morgan Block", label: "De Morgan Block" },
    { value: "Fleming Block", label: "Fleming Block" },
    { value: "Edison Block", label: "Edison Block" },
    { value: "Newton Block", label: "Newton Block" },
    { value: "Turing Extension", label: "Turing Extension" },
    { value: "Martin Luther Block", label: "Martin Luther Block" },
    { value: "Rockfeller Block", label: "Rockfeller Block" },
    { value: "Le Corbusier Block", label: "Le Corbusier Block" },
    { value: "Babbage Block", label: "Babbage Block" },
    { value: "Picasso Block", label: "Picasso Block" },
    { value: "Main Bus Parking", label: "Main Bus Parking" },
    { value: "Rockfeller Bus Parking", label: "Rockfeller Bus Parking" },
    { value: "Tuck Shop 1", label: "Tuck Shop 1" },
    { value: "Tuck Shop 2", label: "Tuck Shop 2" },
    { value: "Moon Block", label: "Moon Block" },
    { value: "Escoffier Block", label: "Escoffier Block" },
    { value: "Go Global Office", label: "Go Global Office" },
    { value: "Explore Hub", label: "Explore Hub" },
    { value: "Studio 401", label: "Studio 401" },
    { value: "Art Gallery", label: "Art Gallery" },
    { value: "Main Gate", label: "Main Gate" },
    { value: "Law School", label: "Law School" },
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

    if (!user || !user.id) {
      toast.error("You must be logged in");
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
        date_time: formData.dateTime || getCurrentISTDateTime(),
        location: formData.location,
        status: formData.status,
        contact_info: formData.contactInfo,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
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

          {/* Row 2: Description */}
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

          {/* Row 3: Date & Time + Location */}
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

            {/* Location */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>

              <CreatableSelect
                options={locationOptions}
                value={
                  formData.location
                    ? { value: formData.location, label: formData.location }
                    : null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: selected ? selected.value : "",
                  }))
                }
                placeholder="Select location"
                menuPlacement="bottom"
                className="text-black dark:text-white"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.375rem",
                    borderColor: "#d1d5db",
                    minHeight: "40px",
                  }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                  singleValue: (base) => ({ ...base, color: "black" }),
                  placeholder: (base) => ({ ...base, color: "black" }),
                }}
              />
            </div>
          </div>

          {/* Row 4: Status + Contact Info */}
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

          {/* Row 5: Upload Image */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded transition"
          >
            Report Item
          </button>
        </form>
      </div>
    </div>
  );
}
