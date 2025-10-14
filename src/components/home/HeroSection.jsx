import FeatureCard from "./FeatureCard";

function HeroSection() {
    return (
        <>
            <div
                className="bg-[url('/HomeImage.png')] bg-cover bg-center w-full h-[calc(100vh-64px)] flex flex-col justify-center items-center text-center px-4 pt-20 bg-black/50 bg-blend-overlay"
            >
                {/* Hero Content */}
                <div>
                    <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
                        Lost & Found Management System
                    </h1>
                    <p className="text-white text-lg md:text-xl mb-6">
                        Easily report and retrieve lost items with our system.
                    </p>
                    <a
                        href="#"
                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md text-sm hover:bg-blue-800 transition"
                    >
                        Report Item
                    </a>
                </div>

                {/* Feature Boxes (Desktop only) */}
                <div className="hidden md:flex mt-12 justify-center gap-6 w-full max-w-6xl">
                    <FeatureCard
                        title="Easy Reporting"
                        description="Quickly submit lost and found reports."
                    />
                    <FeatureCard
                        title="Verified Listings"
                        description="Ensuring accurate and valid reports."
                    />
                    <FeatureCard
                        title="Secure System"
                        description="Your data is safe and protected."
                    />
                </div>
            </div>

            {/* Feature Boxes (Mobile only - below hero) */}
            <section className="md:hidden max-w-6xl mx-auto py-12 px-6 grid gap-6">
                <FeatureCard
                    title="Easy Reporting"
                    description="Quickly submit lost and found reports."
                />
                <FeatureCard
                    title="Verified Listings"
                    description="Ensuring accurate and valid reports."
                />
                <FeatureCard
                    title="Secure System"
                    description="Your data is safe and protected."
                />
            </section>
        </>
    );
}

export default HeroSection;