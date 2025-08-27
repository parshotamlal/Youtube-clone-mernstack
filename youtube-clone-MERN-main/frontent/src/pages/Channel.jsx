import React, { useEffect, useState } from "react";
import VideoPlayerModal from "../components/VideoPlayer";
import axios from "axios";

function Channel() {
  const [user, setUser] = useState(null);
  const [userdetail, setUserDetails] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}user/getpost`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("youtubetoken")}`,
            },
          }
        );
        setUser(response.data?.data);
      } catch (err) {
        console.error("Error fetching channel data:", err);
      }
    };

    const fetchuser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}user/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("youtubetoken")}`,
            },
          }
        );

        setUserDetails(response.data?.data?.user);
      } catch (err) {
        console.error("Error fetching channel data:", err);
      }
    };

    fetchData();
    fetchuser();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Banner */}
      <div className="h-40 md:h-60 bg-gradient-to-r from-gray-900 to-gray-700 relative">
        <div className="absolute bottom-0 left-6 transform translate-y-1/2">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-xl font-bold">
            {userdetail?.username ? userdetail.username.toUpperCase() : "U"}
          </div>
        </div>
      </div>

      {/* User Info */}
      {userdetail && (
        <div className="mt-16 px-6 border-b pb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {userdetail?.username || "User Name"}
          </h1>
          <p className="text-gray-600">
            {userdetail?.email || "No email provided"}
          </p>
        </div>
      )}

      {/* Videos */}
      <div className="mt-6">
        {user?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.map((video) => (
              <div
                key={video._id}
                className="bg-black text-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-[1.03] hover:shadow-xl transition transform"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Video Thumbnail */}
                <div className="relative w-full h-52 bg-gray-900">
                  <video
                    src={video.video_url}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md">
                    {video.duration || "5:20"}
                  </span>
                </div>

                {/* Video Details */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold truncate">
                    {video.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {video.views || "0"} views
                    </span>
                    <span className="text-xs text-gray-500">
                      {video.uploadDate || "Just now"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">
            This channel has no videos yet.
          </p>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}

export default Channel;





// import React, { useEffect, useState } from "react";
// import VideoPlayerModal from "../components/VideoPlayer";
// import axios from "axios";

// function Channel() {
//   const [user, setUser] = useState(null);
//   const [userdetail, setUserDetails] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   // 🔹 LocalStorage States
//   const [banner, setBanner] = useState(localStorage.getItem("channelBanner") || "");
//   const [profilePic, setProfilePic] = useState(localStorage.getItem("channelProfilePic") || "");
//   const [isSubscribed, setIsSubscribed] = useState(
//     JSON.parse(localStorage.getItem("isSubscribed")) || false
//   );


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}user/getpost`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("youtubetoken")}`,
//             },
//           }
//         );
//         setUser(response.data?.data);
//       } catch (err) {
//         console.error("Error fetching channel data:", err);
//       }
//     };

//   // 🔹 Profile Upload
//   const handleProfileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setProfilePic(reader.result);
//       localStorage.setItem("channelProfilePic", reader.result);
//     };
//     reader.readAsDataURL(file);
//   };


//     const fetchuser = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}user/profile`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("youtubetoken")}`,
//             },
//           }
//         );

//         setUserDetails(response.data?.data?.user);
//       } catch (err) {
//         console.error("Error fetching channel data:", err);
//       }
//     };

//     fetchData();
//     fetchuser();
//   }, []);

    
//   return (
//     <div className="min-h-screen bg-white text-black">
//      {/* Banner */}
//   <div className="h-40 md:h-60 relative">
//       {banner ? (
//           <img src={banner} alt="Banner" className="w-full h-full object-cover" />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-700" />
//         )}

//         {/* Banner Upload */}
//         <label className="absolute top-2 right-2 bg-white px-3 py-1 text-sm rounded cursor-pointer shadow">
//           Upload Banner
//           <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
//         </label>

//         {/* Profile Photo */}
//         <div className="absolute bottom-0 left-6 transform translate-y-1/2">
//           {profilePic ? (
//             <img
//               src={profilePic}
//               alt="Profile"
//               className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover"
//             />
//           ) : (
//             <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-xl font-bold">
//               {userdetail?.username ? userdetail.username[0].toUpperCase() : "U"}
//             </div>
//           )}

//           {/* Profile Upload */}
//           <label className="block text-xs mt-2 text-blue-600 cursor-pointer">
//             Change Photo
//             <input type="file" accept="image/*" className="hidden" onChange={handleProfileChange} />
//           </label>
//         </div>
//       </div>

//       {/* User Info + Subscribe */}
//       {userdetail && (
//         <div className="mt-16 px-6 border-b pb-6 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold">
//               {userdetail?.username || "User Name"}
//             </h1>
//             <p className="text-gray-600">{userdetail?.email || "No email provided"}</p>
//           </div>

//           <button
//             onClick={handleSubscribe}
//             className={`px-4 py-2 rounded-lg font-semibold transition ${
//               isSubscribed ? "bg-gray-300 text-black" : "bg-red-600 text-white"
//             }`}
//           >
//             {isSubscribed ? "Subscribed" : "Subscribe"}
//           </button>
//         </div>
//       )}



      

//       {/* Videos */}
//       <div className="mt-6">
//         {user?.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {user.map((video) => (
//               <div
//                 key={video._id}
//                 className="bg-black text-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-[1.03] hover:shadow-xl transition transform"
//                 onClick={() => setSelectedVideo(video)}
//               >
//                 {/* Video Thumbnail */}
//                 <div className="relative w-full h-52 bg-gray-900">
//                   <video
//                     src={video.video_url}
//                     className="w-full h-full object-cover"
//                   />
//                   <span className="absolute bottom-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md">
//                     {video.duration || "5:20"}
//                   </span>
//                 </div>

//                 {/* Video Details */}
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold truncate">
//                     {video.title}
//                   </h2>
//                   <p className="text-sm text-gray-400 mt-1 line-clamp-2">
//                     {video.description}
//                   </p>
//                   <div className="flex items-center justify-between mt-3">
//                     <span className="text-xs text-gray-500">
//                       {video.views || "0"} views
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       {video.uploadDate || "Just now"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center text-lg">
//             This channel has no videos yet.
//           </p>
//         )}
//       </div>

//       {/* Video Modal */}
//       {selectedVideo && (
//         <VideoPlayerModal
//           video={selectedVideo}
//           onClose={() => setSelectedVideo(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default Channel;

