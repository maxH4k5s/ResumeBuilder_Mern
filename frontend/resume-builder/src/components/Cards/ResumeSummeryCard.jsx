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
      className="h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      <div className="p-4 w-full flex items-center justify-center">
        {thumbUrl ? (
          <img src={thumbUrl} alt={title} className="w-[100%] rounded" />
        ) : (
          <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No Preview</span>
          </div>
        )}
      </div>
      <div className="w-full bg-white px-4 py-3">
        <h5 className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">
          {title}
        </h5>
        <p className="text-xs font-medium text-gray-500 mt-0.5">
          Last Updated: {lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default ResumeSummeryCard;
