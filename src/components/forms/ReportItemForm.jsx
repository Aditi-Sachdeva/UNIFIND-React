import { useState } from 'react';
import { toast } from 'react-hot-toast';
import supabase from '../../supabaseClient';

export default function ReportItemForm({ user }) {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Electronics',
    description: '',
    dateTime: '',
    location: '',
    status: 'Lost',
    contactInfo: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user || !user.id) {
    toast.error('You must be logged in');
    return;
  }

  let imageUrl = null;

  // Upload image if provided
  if (formData.image) {
    const fileExt = formData.image.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('report-images')
      .upload(fileName, formData.image);

    if (uploadError) {
      toast.error('Image upload failed');
      console.error('Upload error:', uploadError);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('report-images')
      .getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  // Optional: test with hardcoded data to isolate issue
  /*
  const { error: testError } = await supabase
    .from('reports')
    .insert([{
      user_id: user.id,
      item_name: 'Test Item',
      category: 'Electronics',
      description: 'Test description',
      date_time: new Date().toISOString(),
      location: 'Test location',
      status: 'Lost',
      contact_info: 'test@example.com',
      image_url: null
    }]);

  if (testError) {
    console.error('Test insert error:', testError);
    toast.error('Test insert failed');
    return;
  }
  */

  // Actual form submission
  const { error } = await supabase
    .from('reports')
    .insert([{
      user_id: user.id,
      item_name: formData.itemName,
      category: formData.category,
      description: formData.description,
      date_time: formData.dateTime || new Date().toISOString(),
      location: formData.location,
      status: formData.status,
      contact_info: formData.contactInfo,
      image_url: imageUrl
    }]);

  if (error) {
    console.error('Supabase insert error:', error); // ← This will show the real issue
    toast.error('Submission failed');
  } else {
    toast.success('Report submitted');
    setFormData({
      itemName: '',
      category: 'Electronics',
      description: '',
      dateTime: '',
      location: '',
      status: 'Lost',
      contactInfo: '',
      image: null
    });
  }
};

  

  return (
    <div className="pt-8 px-4 pb-8 flex justify-center items-start h-auto md:h-[calc(100vh-64px)] overflow-auto md:overflow-hidden">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">
          Report Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Item Name + Category */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
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
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Books</option>
                <option>Others</option>
              </select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Description</label>
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
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Date & Time</label>
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
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Row 4: Status + Contact Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Status</label>
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
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Contact Info</label>
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
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Upload Image</label>
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