import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string;
  profilePhoto: string;
  coverPhoto: string;
  role: string;
  entity: string;
  location: string;
}

interface ProfileCardProps {
  userData: UserData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userData }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile if width ≤ 768px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Desktop/Laptop View (Floating Sidebar Card) */}
      {!isMobile && (
        <div
          className="fixed left-2 md:left-6 top-20 cursor-pointer z-50"
          onClick={() => router.push(`/profile/${userData.id}`)}
        >
          <div className="bg-white shadow-lg rounded-2xl w-48 sm:w-60 h-60 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="relative">
              {/* Cover Photo */}
              <img
                src={
                  userData.coverPhoto ||
                  "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"
                }
                alt="Cover"
                className="w-full h-20 sm:h-24 object-cover"
              />

              {/* Profile Photo */}
              <img
                src={
                  userData.profilePhoto ||
                  "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"
                }
                alt="Profile"
                className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-16 sm:w-20 h-16 sm:h-20 rounded-full border-4 border-white shadow-md"
              />
            </div>

            {/* User Info */}
            <div className="text-center pt-12 pb-4 px-4">
              <h2 className="text-base sm:text-lg font-semibold text-black truncate">
                {userData.name || "Loading..."}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                {userData.role ? `${userData.role} at ${userData.entity}` : "Loading..."}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">{userData.location}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile View (Full-width LinkedIn Style) */}
      {isMobile && (
        <div className="w-full bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="relative w-full h-20">
            <img
              src={userData.coverPhoto || "https://via.placeholder.com/280x80"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Details */}
          <div className="relative text-center px-3 pb-3">
            {/* Profile Picture */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-8">
              <img
                src={userData.profilePhoto || "https://via.placeholder.com/60"}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white shadow-md"
              />
            </div>

            {/* User Info */}
            <div className="pt-8">
              <h2 className="text-sm font-semibold text-gray-900">{userData.name}</h2>
              <p className="text-gray-600 text-xs">{userData.role} at {userData.entity}</p>
              <p className="text-gray-500 text-xs">{userData.location}</p>
            </div>

            {/* Manage Notifications */}
            <div className="mt-2">
              <button className="text-xs text-blue-600 hover:underline">Manage your notifications</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
