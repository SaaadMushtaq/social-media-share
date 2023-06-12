import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useStopwatch } from "react-timer-hook";
import Button from "@mui/material/Button";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SyncIcon from "@mui/icons-material/Sync";
import CircularProgress from "@mui/material/CircularProgress";
import { storage } from "../firebase";
import CustomizedDialogs from "../components/CustomizedDialogs";
import "../App.css";

const HEIGHT = 498;
const WIDTH = 498;

const VideoRecorder = () => {
  const [startRecorder, setStartRecorder] = useState(false);
  const [stopRecorder, setStopRecorder] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(false);
  const [videoCheck, setVideoCheck] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    seconds,
    minutes,
    start: startTimer,
    pause: stopTimer,
    reset: resetTimer,
  } = useStopwatch({ autoStart: false });

  const handleStopRecording = async (blobUrl) => {
    console.log(typeof blobUrl);
    setStopRecorder(true);
    stopTimer();
    const video = document.getElementsByClassName("app-video-feed")[0];
    video.srcObject.getTracks()[0].stop();

    const videoBlob = await fetch(blobUrl).then((r) => r.blob());

    const videoFile = new File([videoBlob], `${v4()}.${"mp4"}`, {
      type: "video/mp4",
    });

    setSelectedFile(videoFile);
  };

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: true,
      onStop: (blobUrl, blob) => {
        handleStopRecording(blobUrl, blob);
      },
    });

  const handleStartRecording = () => {
    startRecording();
    startTimer();
    navigator.getUserMedia(
      {
        video: true,
      },
      (stream) => {
        let video = document.getElementsByClassName("app-video-feed")[0];
        if (video) {
          video.srcObject = stream;
        }
      },
      (err) => console.error(err)
    );

    setStartRecorder(true);
  };

  const uploadToFirebase = async () => {
    setStartRecorder(false);
    resetTimer();
    setUploading(true);

    const videoRef = ref(storage, `videos/${selectedFile.name}`);

    await uploadBytes(videoRef, selectedFile)
      .then(() => {
        console.log("file uploaded successfully");
      })
      .catch(() => console.log("File failed to upload!"));

    await getDownloadURL(videoRef)
      .then((url) => {
        setVideoUrl(url);
      })
      .catch(() => console.log("failed to get url!"));

    setUploading(false);
    setVideoCheck(true);
  };

  const renderSwitch = (status) => {
    switch (status) {
      case "idle":
        return (
          <>
            <p>Recording not Started!</p>
            <NotStartedIcon color="action" />
          </>
        );
      case "recording":
        return (
          <>
            <p>Recording!</p>
            <StopCircleIcon color="success" />
          </>
        );
      case "stopped":
        return (
          <>
            <p>Stopped!</p>
            <PlayCircleIcon color="secondary" />
          </>
        );
      case "acquiring_media":
        return (
          <>
            <p>Starting!</p>
            <SyncIcon color="primary" />
          </>
        );
      default:
        return "";
    }
  };

  return (
    <div className="app">
      {renderSwitch(status)}
      <div style={{ fontSize: "20px" }}>
        <span>{`${minutes} m `}</span>:<span>{` ${seconds} s`}</span>
      </div>
      {uploading ? (
        <CircularProgress />
      ) : (
        <>
          <div className="app-container">
            {previewVideo ? (
              <video
                className="app-video-feed"
                height={HEIGHT}
                width={WIDTH}
                src={mediaBlobUrl}
                controls
              />
            ) : (
              <video
                className="app-video-feed"
                height={HEIGHT}
                width={WIDTH}
                autoPlay
              />
            )}
          </div>
          <div className="app-input">
            {startRecorder ? (
              stopRecorder ? (
                <Button
                  className="button-btn"
                  variant="contained"
                  onClick={() => {
                    setPreviewVideo(true);
                    console.log(mediaBlobUrl);
                  }}
                >
                  Preview
                </Button>
              ) : (
                <Button
                  className="button-btn"
                  variant="contained"
                  onClick={stopRecording}
                >
                  Stop
                </Button>
              )
            ) : (
              <Button
                className="button-btn"
                variant="contained"
                onClick={handleStartRecording}
              >
                Start
              </Button>
            )}
          </div>
          <span>
            <Button
              className="button-btn"
              variant="contained"
              disabled={!(status === "stopped")}
              onClick={uploadToFirebase}
            >
              Share
            </Button>
          </span>
        </>
      )}
      {videoCheck && !uploading && (
        <CustomizedDialogs
          fileCheck={videoCheck}
          selectedFile={videoUrl}
          setFileCheck={setVideoCheck}
          videoFile={true}
        />
      )}
    </div>
  );
};

export default VideoRecorder;
