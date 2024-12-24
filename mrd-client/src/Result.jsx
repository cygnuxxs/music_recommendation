import React, { useState } from "react";

const Result = (data, index) => {
  const [isLoading, setLoading] = useState(false);

  const sendData = (songData) => {
    setLoading(true);
    
    fetch("http://localhost:8000/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: songData.videoId, songTitle : songData.title }),
    })
      .then((response) => {
        // Ensure the response is okay (status 200)
        if (!response.ok) {
          throw new Error('Failed to fetch audio');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${songData.title}.mp3`);  // Set file name for download
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);  // Clean up the DOM
      })
      .catch((error) => {
        console.error("Download error:", error);
      }).finally(() => setLoading(false))
  };
  return (
    <div
      key={index}
      className="w-full h-[10rem] mb-3 flex rounded-xl bg-slate-900"
    >
      <div className="w-1/5 max-sm:w-1/3 flex items-center justify-center h-auto overflow-hidden">
        <img
          className=" object-contain rounded-md "
          src={data.thumbnail}
          alt=""
        />
      </div>
      <div className="max-sm:w-2/3 w-4/5 mx-2 mt-3">
        <h1 className="font-bold text-primary max-sm:text-sm line-clamp-3">
          {data.title}
        </h1>
        <div className="flex gap-2 mt-3">
          <p className="text-info px-1 max-sm:text-[10px] bg-slate-700 flex items-center justify-center rounded">
            {data.duration}
          </p>
          <p className="text-accent px-1 max-sm:text-[10px] bg-slate-700 flex items-center justify-center rounded">
            {data.viewCount}
          </p>
          <p className="text-accent px-1 max-sm:text-[10px] bg-slate-700 flex items-center justify-center rounded">
            {data.publishedTime}
          </p>
        </div>
        <div className="flex gap-3 mt-3">
          {isLoading ? (
            <span className="loading loading-spinner bg-secondary loading-lg max-sm:loading-sm"></span>
          ) : (
            <button
              onClick={() => sendData(data)}
              className="mt-2 max-sm:btn-sm max-sm:mt-0 btn btn-ghost btn-outline btn-accent"
            >
              Download MP3
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
