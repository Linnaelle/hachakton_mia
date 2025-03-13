import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import SuggestedProfiles from "../components/SuggestedProfiles";

export default function Home() {
    return (
        <div className="flex justify-center min-h-screen bg-gray-100 text-black pt-22">
            {/* Centered container with a max width */}
            <div className="flex w-full max-w-[1600px]">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content (Feed) */}
                <main className="flex-1 max-w-2xl border-x border-gray-700">
                    <Feed />
                </main>

                {/* Suggested Profiles (hidden on smaller screens) */}
                <div className="w-96 hidden lg:block p-4">
                    <SuggestedProfiles />
                </div>
            </div>
        </div>
    );
}
