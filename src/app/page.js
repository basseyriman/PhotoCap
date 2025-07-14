"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Upload,
  Camera,
  X,
  Copy,
  Check,
  Share2,
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
  Download,
} from "lucide-react";

export default function Home() {
  const [caption, setCaption] = useState(
    "Upload a photo to generate a caption..."
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize component when mounted
  useEffect(() => {
    console.log("Component mounted, checking camera availability...");

    const checkCameraAvailability = async () => {
      try {
        // Check if camera API is available
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          console.log("Camera API is available");

          // Try to enumerate devices to check permissions
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          console.log("Found video devices:", videoDevices);

          if (videoDevices.length > 0) {
            console.log("Camera devices found, setting ready");
            setIsCameraReady(true);
          } else {
            console.log("No camera devices found");
            setError("No camera found on your device");
          }
        } else {
          console.log("Camera API not available");
          setError(
            "Camera not supported in this browser. Please use Chrome, Firefox, or Safari."
          );
        }
      } catch (error) {
        console.error("Error checking camera availability:", error);
        setError(
          "Error checking camera availability. Please refresh and try again."
        );
      }
    };

    checkCameraAvailability();
  }, []);

  // Ensure video element is created when camera is shown
  useEffect(() => {
    if (showCamera && videoRef.current) {
      console.log("Camera modal shown, video element ready");
    }
  }, [showCamera]);

  // Add a separate effect to handle video element creation
  useEffect(() => {
    if (showCamera) {
      // Force a re-render to ensure video element is created
      const timer = setTimeout(() => {
        console.log("Video element check after modal shown:", videoRef.current);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showCamera]);

  const handleImageUpload = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setUploadedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setCaption("Upload a photo to generate a caption...");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      setIsStartingCamera(true);
      setError("");

      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          "Camera API not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari."
        );
        setIsStartingCamera(false);
        return;
      }

      // Show camera modal first to ensure video element is created
      setShowCamera(true);

      // Wait for video element to be created and DOM to update
      // Use a more robust approach to wait for video element
      let attempts = 0;
      const maxAttempts = 20; // 2 seconds total

      while (!videoRef.current && attempts < maxAttempts) {
        console.log(`Waiting for video element... attempt ${attempts + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      // Check if video ref is available
      if (!videoRef.current) {
        console.error("Video ref not available after all attempts");
        setError(
          "Camera interface not ready. Please refresh the page and try again."
        );
        setIsStartingCamera(false);
        setShowCamera(false);
        return;
      }

      console.log("Video ref is available:", videoRef.current);

      // List available devices first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("Available video devices:", videoDevices);

      if (videoDevices.length === 0) {
        setError(
          "No camera found on your device. Please check if your camera is connected and not being used by another application."
        );
        setIsStartingCamera(false);
        setShowCamera(false);
        return;
      }

      // Request camera permissions and get stream with more specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      });

      console.log("Camera stream obtained:", stream);
      console.log("Stream tracks:", stream.getTracks());

      // Check if video ref is still available (component might have unmounted)
      if (!videoRef.current) {
        console.error("Video ref lost during camera initialization");
        stream.getTracks().forEach((track) => track.stop());
        setError("Camera interface lost. Please try again.");
        setIsStartingCamera(false);
        setShowCamera(false);
        return;
      }

      // Set the stream to video element
      videoRef.current.srcObject = stream;

      // Wait for video to be ready with better event handling
      return new Promise((resolve, reject) => {
        const video = videoRef.current;

        const onLoadedMetadata = () => {
          console.log("Video metadata loaded successfully");
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          video.removeEventListener("error", onError);
          setIsStartingCamera(false);
          resolve();
        };

        const onError = (error) => {
          console.error("Video error:", error);
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          video.removeEventListener("error", onError);
          setError("Failed to load camera video. Please try again.");
          setIsStartingCamera(false);
          setShowCamera(false);
          reject(error);
        };

        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("error", onError);

        // Add a timeout to prevent infinite loading
        setTimeout(() => {
          if (isStartingCamera) {
            console.log("Camera initialization timeout");
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            setIsStartingCamera(false);
            reject(new Error("Camera initialization timeout"));
          }
        }, 15000); // 15 second timeout
      });
    } catch (err) {
      console.error("Camera error:", err);
      setIsStartingCamera(false);
      setShowCamera(false);

      let errorMessage = "Unable to access camera. ";

      if (err.name === "NotAllowedError") {
        errorMessage +=
          "Camera access was denied. Please allow camera permissions in your browser settings and try again.";
      } else if (err.name === "NotFoundError") {
        errorMessage +=
          "No camera found on your device. Please check if your camera is connected.";
      } else if (err.name === "NotReadableError") {
        errorMessage +=
          "Camera is already in use by another application. Please close other camera apps and try again.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage +=
          "Camera doesn't support the requested settings. Please try again.";
      } else {
        errorMessage += `Error: ${err.message}. Please check permissions and try again.`;
      }

      setError(errorMessage);
    }
  };

  const capturePhoto = () => {
    console.log("Capturing photo...");
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("Photo captured, creating file...");
            const file = new File([blob], "camera-photo.jpg", {
              type: "image/jpeg",
            });
            handleImageUpload(file);
            stopCamera();
          } else {
            console.error("Failed to create blob from canvas");
            setError("Failed to capture photo. Please try again.");
          }
        },
        "image/jpeg",
        0.9
      );
    } else {
      console.error("Video or canvas ref not available");
      setError("Camera not ready. Please try again.");
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          console.log("Stopping track:", track);
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
    setShowCamera(false);
    setIsStartingCamera(false);
    console.log("Camera stopped and modal hidden");
  };

  const generateCaption = async () => {
    if (!uploadedImage) {
      setError("Please upload an image first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Convert image to base64 for API
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(uploadedImage);
      });

      const response = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          filename: uploadedImage.name,
        }),
      });

      const data = await response.json();

      if (data.caption) {
        setCaption(data.caption);
        setIsCopied(false);
      } else {
        setError(data.error || "Failed to generate caption. Please try again.");
        setCaption("Failed to generate caption. Please try again.");
      }
    } catch (err) {
      setError("Failed to generate caption. Please try again.");
      setCaption("Failed to generate caption. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(caption)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        setError("Failed to copy to clipboard");
      });
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareToSocialMedia = (platform) => {
    if (
      !imagePreview ||
      caption === "Upload a photo to generate a caption..."
    ) {
      setError("Please upload a photo and generate a caption first");
      return;
    }

    try {
      const shareText = encodeURIComponent(caption);
      const shareUrl = encodeURIComponent(window.location.href);

      let shareLink = "";
      let platformName = "";

      switch (platform) {
        case "twitter":
          shareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
          platformName = "Twitter";
          break;
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;
          platformName = "Facebook";
          break;
        case "whatsapp":
          shareLink = `https://wa.me/?text=${shareText}%20${shareUrl}`;
          platformName = "WhatsApp";
          break;
        case "instagram":
          // Instagram doesn't support direct sharing via URL, so we'll copy the caption
          // and optionally open Instagram in a new tab
          navigator.clipboard
            .writeText(caption)
            .then(() => {
              // Try to open Instagram in a new tab
              const instagramWindow = window.open(
                "https://www.instagram.com/",
                "_blank",
                "width=800,height=600"
              );

              if (instagramWindow) {
                setError(
                  "Caption copied! Instagram opened in new tab. Paste the caption with your photo."
                );
              } else {
                setError(
                  "Caption copied! Please open Instagram manually and paste it with your photo."
                );
              }

              // Clear the message after 8 seconds
              setTimeout(() => {
                setError("");
              }, 8000);
            })
            .catch(() => {
              setError(
                "Failed to copy caption. Please copy manually: " + caption
              );
            });
          return;
        case "linkedin":
          shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${encodeURIComponent(
            "Check out this photo!"
          )}&summary=${shareText}`;
          platformName = "LinkedIn";
          break;
        case "pinterest":
          shareLink = `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareText}`;
          platformName = "Pinterest";
          break;
        case "telegram":
          shareLink = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
          platformName = "Telegram";
          break;
        case "reddit":
          shareLink = `https://reddit.com/submit?url=${shareUrl}&title=${shareText}`;
          platformName = "Reddit";
          break;
        case "tumblr":
          shareLink = `https://www.tumblr.com/share/link?url=${shareUrl}&description=${shareText}`;
          platformName = "Tumblr";
          break;
        default:
          setError("Unknown platform selected");
          return;
      }

      // Open sharing window
      const shareWindow = window.open(
        shareLink,
        "_blank",
        "width=600,height=400,scrollbars=yes,resizable=yes"
      );

      if (shareWindow) {
        console.log(`Sharing to ${platformName} opened successfully`);
        setShowShareOptions(false);

        // Show success message
        setError(
          `Sharing to ${platformName} opened in new window. If the window didn't open, please check your popup blocker.`
        );

        // Clear the error message after 5 seconds
        setTimeout(() => {
          setError("");
        }, 5000);
      } else {
        setError(
          `Failed to open ${platformName} sharing window. Please check your popup blocker and try again.`
        );
      }
    } catch (error) {
      console.error("Sharing error:", error);
      setError("Failed to share. Please try again.");
    }
  };

  const downloadImageWithCaption = () => {
    if (
      !imagePreview ||
      caption === "Upload a photo to generate a caption..."
    ) {
      setError("Please upload a photo and generate a caption first");
      return;
    }

    try {
      // Create a canvas to combine image and caption
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        try {
          // Set canvas size (add space for caption)
          canvas.width = img.width;
          canvas.height = img.height + 100; // Extra space for caption

          // Draw the image
          ctx.drawImage(img, 0, 0);

          // Add caption text
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, img.height, img.width, 100);

          ctx.fillStyle = "#000000";
          ctx.font = "16px Arial";
          ctx.textAlign = "center";

          // Wrap text to fit canvas width
          const words = caption.split(" ");
          let line = "";
          let y = img.height + 30;

          for (let word of words) {
            const testLine = line + word + " ";
            const metrics = ctx.measureText(testLine);

            if (metrics.width > img.width - 40) {
              ctx.fillText(line, img.width / 2, y);
              line = word + " ";
              y += 25;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, img.width / 2, y);

          // Download the image
          const link = document.createElement("a");
          link.download = "photocap-share.jpg";
          link.href = canvas.toDataURL();
          link.click();

          console.log("Image with caption downloaded successfully");
        } catch (error) {
          console.error("Error creating image with caption:", error);
          setError("Failed to create image with caption. Please try again.");
        }
      };

      img.onerror = () => {
        setError("Failed to load image for download. Please try again.");
      };

      img.src = imagePreview;
    } catch (error) {
      console.error("Download error:", error);
      setError("Failed to download image. Please try again.");
    }
  };

  const handleChooseFileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <main className="flex items-center justify-center flex-col w-full min-h-screen gap-6 bg-gray-900 text-gray-50 bg-cover bg-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/5638701/pexels-photo-5638701.jpeg')",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        {/* Header */}
        <span className="flex items-center gap-3 mt-4">
          <Sparkles strokeWidth={1.5} size={32} className="text-violet-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            PhotoCap
          </h1>
        </span>

        <p className="text-center text-lg italic text-yellow-300 max-w-2xl mb-8">
          Upload your photo and let AI generate the perfect caption based on the
          entire image context! ✨
        </p>

        {/* Camera Interface */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-center text-white">
                📸 Take a Photo
              </h3>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full rounded-lg border-2 border-gray-600 ${
                    isStartingCamera ? "hidden" : ""
                  }`}
                  onLoadedMetadata={() => {
                    console.log("Video metadata loaded in modal");
                  }}
                  onError={(e) => {
                    console.error("Video error in modal:", e);
                    setError("Failed to load camera video. Please try again.");
                  }}
                  onPlay={() => {
                    console.log("Video started playing");
                  }}
                  onPause={() => {
                    console.log("Video paused");
                  }}
                  onEnded={() => {
                    console.log("Video ended");
                  }}
                  onCanPlay={() => {
                    console.log("Video can play");
                  }}
                  onCanPlayThrough={() => {
                    console.log("Video can play through");
                  }}
                />
                {isStartingCamera && (
                  <div className="absolute inset-0 w-full h-64 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto mb-4"></div>
                      <p className="text-white">Starting camera...</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Please wait while we initialize your camera
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        This may take a few seconds
                      </p>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex gap-4 mt-4 justify-center">
                <button
                  onClick={capturePhoto}
                  disabled={isStartingCamera}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
                >
                  📸 Take Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
                >
                  ❌ Cancel
                </button>
              </div>
              <p className="text-gray-400 text-sm text-center mt-2">
                {isStartingCamera
                  ? "Please wait while we start your camera..."
                  : 'Position yourself in the frame and click "Take Photo"'}
              </p>
              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Upload Area */}
        <div className="w-full max-w-2xl">
          {!imagePreview ? (
            <div
              className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center hover:border-violet-400 transition-colors cursor-pointer bg-gray-800/50 backdrop-blur-sm"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Upload your photo</h3>
              <p className="text-gray-400 mb-4">
                Drag and drop your image here, or click to browse. AI will
                analyze composition, mood, colors, setting, and more!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleChooseFileClick}
                  className="bg-violet-500 text-white px-6 py-2 rounded-lg hover:bg-violet-600 transition-colors flex items-center gap-2"
                >
                  <Upload size={16} />
                  Choose File
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isStartingCamera || !isCameraReady}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Camera size={16} />
                  {isStartingCamera ? "Starting Camera..." : "Take Photo"}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <button
                onClick={generateCaption}
                disabled={isLoading}
                className="w-full mt-4 bg-violet-500 text-white py-3 px-6 rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg"
              >
                {isLoading ? "Generating caption..." : "Generate Caption"}
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 max-w-2xl text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Caption Display */}
        <div className="w-full max-w-2xl">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <p className="text-center text-lg leading-relaxed">{caption}</p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={
              caption === "Upload a photo to generate a caption..." || isLoading
            }
            className="w-full mt-4 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
          >
            {isCopied ? (
              <>
                <Check size={20} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={20} />
                Copy Caption
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={
              caption === "Upload a photo to generate a caption..." || isLoading
            }
            className="w-full mt-3 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
          >
            <Share2 size={20} />
            Share to Social Media
          </button>

          {/* Share Options */}
          {showShareOptions && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-white font-semibold mb-3 text-center">
                Share to Social Media:
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => shareToSocialMedia("instagram")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                >
                  <Instagram size={16} />
                  Instagram
                </button>
                <button
                  onClick={() => shareToSocialMedia("twitter")}
                  className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                >
                  <Twitter size={16} />
                  Twitter
                </button>
                <button
                  onClick={() => shareToSocialMedia("facebook")}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Facebook size={16} />
                  Facebook
                </button>
                <button
                  onClick={() => shareToSocialMedia("whatsapp")}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => shareToSocialMedia("linkedin")}
                  className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </button>
                <button
                  onClick={() => shareToSocialMedia("pinterest")}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                  Pinterest
                </button>
                <button
                  onClick={() => shareToSocialMedia("telegram")}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Telegram
                </button>
                <button
                  onClick={() => shareToSocialMedia("reddit")}
                  className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                  Reddit
                </button>
              </div>
              <button
                onClick={downloadImageWithCaption}
                className="w-full mt-3 bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600 transition-all flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download with Caption
              </button>
              <p className="text-gray-400 text-xs text-center mt-3">
                Click any platform to share your photo and caption. For
                Instagram, the caption will be copied to your clipboard and
                Instagram will open in a new tab.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
