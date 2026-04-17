import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../pages/utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import { getLightColorFromImage } from "../../pages/utils/helper";

const ResumeSummeryCard = ({ imgUrl, title, lastUpdated, onSelect }) => {
  const { token } = useContext(UserContext);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [thumbUrl, setThumbUrl] = useState(null);

  // Load thumbnail image and set background color
  useEffect(() => {
    if (!imgUrl || !token) return;
    let objectUrl;
    axiosInstance
      .get(imgUrl, { responseType: "blob" })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setThumbUrl(objectUrl);
      })
      .catch((err) => {
        console.error("Thumbnail load failed:", err);
      });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imgUrl, token]);

  useEffect(() => {
    if (!thumbUrl) return;
    getLightColorFromImage(thumbUrl)
      .then((color) => setBgColor(color))
      .catch(() => setBgColor("#ffffff"));
  }, [thumbUrl]);

  return (
    <div
      onClick={onSelect}
      className="group relative h-[340px] flex flex-col justify-between rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer bg-white"
    >
      <div 
        className="w-full flex-1 flex items-center justify-center p-5 overflow-hidden relative transition-colors duration-500"
        style={{ backgroundColor: bgColor !== '#ffffff' ? bgColor : '#f3f4f6' }}
      >
        {thumbUrl ? (
          <div className="relative w-full h-full flex items-start justify-center overflow-hidden rounded-md shadow-sm border border-black/5 group-hover:scale-105 group-hover:shadow-md transition-all duration-500">
            <img src={thumbUrl} alt={title} className="w-full object-cover object-top" />
          </div>
        ) : (
          <div className="w-full h-full bg-white/60 rounded-md flex items-center justify-center border border-dashed border-gray-300">
            <span className="text-gray-400 font-medium tracking-wide text-sm">No Preview</span>
          </div>
        )}
      </div>

      <div className="w-full bg-white px-5 py-4 border-t border-gray-100 z-10">
        <h5 className="text-[15px] font-semibold text-gray-800 truncate group-hover:text-purple-600 transition-colors duration-200">
          {title}
        </h5>
        <p className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
          {lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default ResumeSummeryCard;
