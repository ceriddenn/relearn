// components/LoadingVideo.tsx
import React, { useEffect, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { StyleSheet, View } from "react-native";

interface LoadingVideoProps {
  isVisible: boolean;
  loadApp: (v: boolean) => void;
}

const LoadingVideo = ({ isVisible, loadApp }: LoadingVideoProps) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  // This effect ensures the video plays when it becomes visible
  useEffect(() => {
    if (isVisible && isReady && videoRef.current) {
      videoRef.current.playAsync();
    }
  }, [isVisible, isReady]);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      // Trigger the provided callback when the video finishes playing
      loadApp(true);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../../assets/images/relearn_loader.mp4")} // Local video
        shouldPlay={isVisible} // Play when visible
        isLooping // Loop the video
        onReadyForDisplay={() => setIsReady(true)} // Trigger when video is ready
        style={styles.video}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take full screen
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: semi-transparent overlay for a better visual experience
  },
  video: {
    width: 400, // The video will scale to the width of the container
    height: 400, // The height of the container
    maxWidth: 800, // Optional: Set a max width for the video (to prevent it from being too large)
    maxHeight: 600, // Optional: Set a max height for the video
  },
});

export default LoadingVideo;
