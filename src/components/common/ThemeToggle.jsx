
function ThemeToggle() {
    return (
        <label className="relative cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-6 transition-transform duration-300"></div>
        </label>
    );
}

export default ThemeToggle;