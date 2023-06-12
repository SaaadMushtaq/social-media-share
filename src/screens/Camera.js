import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { v4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedDialogs from "../components/CustomizedDialogs";

const Camera = () => {
  const webRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [photoCheck, setPhotoCheck] = useState(false);
  const [uploading, setUploading] = useState(false);

  const showImage = async () => {
    setUploading(true);
    const imageRef = ref(storage, `photos/${v4()}.jpg`);

    await uploadString(
      imageRef,
      webRef.current.getScreenshot(),
      "data_url"
    ).then(() => {
      console.log("file uploaded to firebase!");
      getDownloadURL(imageRef)
        .then((url) => setImageUrl(url))
        .finally(() => {
          setUploading(false);
          setPhotoCheck(true);
        })
        .catch(() => {
          console.log("Error uploading file!");
        });
    });
  };

  return (
    <div className="cam">
      {uploading ? (
        <CircularProgress />
      ) : (
        <>
          <Webcam
            className="camera"
            width={500}
            height={500}
            ref={webRef}
            audio={false}
            screenshotFormat="image/jpeg"
          />
          <CameraAltIcon
            className="camera-icon"
            color="primary"
            onClick={showImage}
          />
        </>
      )}

      {photoCheck && !uploading && (
        <CustomizedDialogs
          fileCheck={photoCheck}
          selectedFile={imageUrl}
          setFileCheck={setPhotoCheck}
          videoFile={false}
        />
      )}
    </div>
  );
};

export default Camera;
