function Footer(){
    return(
    <footer className="md:hidden bg-white dark:bg-gray-900 dark:text-gray-400 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
            <p className="mb-4">© 2025 UNIFIND. All Rights Reserved.</p>
            <div className="flex space-x-4">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Contact</a>
            </div>
        </div>
    </footer>
    );
}

export default Footer;