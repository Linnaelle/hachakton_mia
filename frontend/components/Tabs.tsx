interface TabsProps {
    setActiveTab: React.Dispatch<React.SetStateAction<'forYou' | 'following'>>;
    activeTab: 'forYou' | 'following';
}

export default function Tabs({ setActiveTab, activeTab }: TabsProps) {
    return (
        <div className="sticky top-0 bg-white border-b border-gray-300 z-10">
            <div className="flex">
                <button
                    onClick={() => setActiveTab('forYou')}
                    className={`flex-1 py-5 font-medium transition-colors ease-in-out duration-200 ${
                        activeTab === 'forYou'
                            ? 'text-black border-b-4 border-blue-500'
                            : 'text-gray-600'
                    } hover:bg-gray-100`}
                >
                    For you
                </button>

                <button
                    onClick={() => setActiveTab('following')}
                    className={`flex-1 py-5 font-medium transition-colors ease-in-out duration-200 ${
                        activeTab === 'following'
                            ? 'text-black border-b-4 border-blue-500'
                            : 'text-gray-600'
                    } hover:bg-gray-100`}
                >
                    Following
                </button>
            </div>
        </div>
    );
}
