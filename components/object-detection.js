"use client"

import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import {load as cocoSSDLoad} from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'

let detectInterval;
const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true)
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async() => {
    setIsLoading(true);
    const model = await cocoSSDLoad();
    setIsLoading(false);

    detectInterval = setInterval(() => {
        runObjectDetection(model)
    }, 1000)
  }

  async function runObjectDetection(model) {
    if(canvasRef.current && webCamRef.current !== null && webCamRef.current.video?.readyState === 4){
        canvasRef.current.width = webCamRef.current.video.videoWidth;
        canvasRef.current.height = webCamRef.current.video.videoHeight;

        const detectedObjects = await model.detect(webCamRef.current.video, undefined, 0.6);
        console.log("Hellio")
        console.log(detectedObjects)
    }
  }

  const showMyVideo = () => {
    if(webCamRef.current !== null && webCamRef.current.video?.readyState === 4){
        const myVideoWidth = webCamRef.current.video.videoWidth;
        const myVideoHeight = webCamRef.current.video.videoHeight;

        webCamRef.current.video.width = myVideoWidth;
        webCamRef.current.video.height = myVideoHeight;
    }
  }

  useEffect(() => {
    runCoco();
    showMyVideo();
  }, [])
  return (
    <div className='mt-8'>
        {
          isLoading ? (
            <h1 className='gradient-text'>Loading AI Models</h1>
          ):  
        <div className='relative flex justify-center items-center gradient p-1.5 rounded-md'>
            <Webcam className='rounded-md w-full lg:h-[720px]' muted />
            <canvas ref={canvasRef} className='absolute top-0 left-0 z-99999 w-full lg:h-[720px]'/>
        </div>
        }
    </div>
  )
}

export default ObjectDetection