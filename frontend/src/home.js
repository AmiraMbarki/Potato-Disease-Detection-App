import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import bg from "./bg.jpg";
import "./index.css";

export const Home = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      setIsloading(true);
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
      setIsloading(false);
    }
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    // sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div
      style={{
        width: "100vw", // Full viewport width
        height: "100vh", // Full viewport height
        backgroundImage: `url(${bg})`, // Set background image
        backgroundSize: "cover", // Cover the entire area
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Prevent image repetition
      }}
    >
      <div className="flex justify-center items-center py-6 text-4xl">
        <h1 className="text-white">Potato Disease Detection</h1>
      </div>
      <div className="text-white mb-4 ">
        {selectedFile && (
          <div className="flex justify-center items-center text-xl ">
            <div className="flex justify-center items-center">
              <img alt="not found" width={"350px"} src={preview} />
            </div>
            <br /> <br />
           
              
           
          </div>
        )}
      </div>
      <div>
        {image && (
          <div className="text-white">
            <div className="flex justify-center items-center text-xl py-2 ">
            <button className="mr-8 px-8" onClick={clearData}>Remove</button>
            <button className="px-10" onClick={sendFile}>Predict</button>
            </div>
            {!data && <div>{isLoading && <h2>...Loading</h2>}</div>}
            {data && (
              <div className="flex justify-center items-center text-2xl">
              <div className="bg-white bg-opacity-20 backdrop-blur-md text-white py-6 px-10 rounded-lg shadow-lg border border-white border-opacity-30 text-3xl my-4 px-8 py-6">
                
                <h3>Class:  {data.class}</h3>
                <h3>Confidence:  {confidence}</h3>
              </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-white flex justify-center items-center">
        <input
          type="file"
          name="myImage"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
            setImage(true);
          }}
        />
      </div>
    </div>
  );
};
