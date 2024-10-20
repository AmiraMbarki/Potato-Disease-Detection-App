import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import bg from "./bg.jpg"
import './index.css'; 


export const Home = () => {
    
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();
    const [data, setData] = useState();
    const [image, setImage] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    let confidence = 0;
  
    const sendFile = async () => {
      if (image) {
        setIsloading(true)
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
    }

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
      sendFile();
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
  
    
  return(
    <div   style={{
        width: "100vw", // Full viewport width
        height: "100vh", // Full viewport height
        backgroundImage: `url(${bg})`, // Set background image
        backgroundSize: "cover", // Cover the entire area
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Prevent image repetition
      }}
      >
    <div className=""><h1 className="text-white">Potato Disease Detection</h1></div>
    <div className="text-white ">
        {selectedFile && (
            <div>
                <img
                alt="not found"
                width={"400px"}
                src={preview}
                />
                <br/> <br/>
                <button onClick={clearData}>Remove</button>
            </div>
        )}
        
    </div>
    <div>
        {image &&(
            <div className="text-white">
                <button onClick={sendFile} >Predict</button>
                {!data &&(
                    <div>
                       {isLoading && (<h2>...Loading</h2>)}
                    </div>
                )}
                {data && (<div>
                    <h2>Predictions:</h2>
                    <h3>Class:{data.class}</h3>
                    <h3>Confidence:{confidence}</h3>
                </div>)}
            </div>
        )

        }
    </div>
    <div className="text-white">
        <input
         type="file"   
         name="myImage"
         onChange={(e) =>{
            setSelectedFile(e.target.files[0])
            setImage(true)
         }}
         />
    </div>

    </div>

    
  );}