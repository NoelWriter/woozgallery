import {useEffect, useLayoutEffect, useState} from "react";
import React from 'react';
import ReactPlayer from 'react-player'

const useOnceCall = (cb, condition = true) => {
    const isCalledRef = React.useRef(false);

    React.useEffect(() => {
        if (condition && !isCalledRef.current) {
            isCalledRef.current = true;
            cb();
        }
    }, [cb, condition]);
};

const useInterval = (callback, delay) => {
    const savedCallback = React.useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

const Show = () => {
    const [images, setImages] = useState()
    const [image, setImage] = useState("")
    const [doRotate, setDoRotate] = useState(true)

    const _DELAY = 10000

    const importAll = (r) => {
        return r.keys().map(r);
    }

    const fetchImages = () => {
        const files = importAll(require.context("../public/gallery", false, /\.*$/));

        setImages(files)
    };

    useOnceCall(() => {
        fetchImages()
    })

    const getExtension = filename => {
        let parts = filename.split('.');
        return parts[parts.length - 1];
    };

    const isVideo = filename => {
        let ext = getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'm4v':
            case 'avi':
            case 'mpg':
            case 'mp4':
                return true;
        }
        return false;
    };

    const doRotatePls = () => {
      setDoRotate(true)
    }

    useEffect(() => {
        if (!image)
            return

        if (isVideo(image))
            setDoRotate(false)
        else
            setDoRotate(true)
    }, [image])

    const getDisplayComponent = (url) => {
        if (!url)
            return ""

        if (isVideo(url)) {
            return (<div className={"center-fit"}>
                <ReactPlayer
                    url={url}
                    playing={true}
                    width={"1366px"}
                    height={"768px"}
                    controls={true}
                    onEnded={doRotatePls}
                />
                <style jsx>
                    {`
                        .center-fit {
                            overflow: hidden;
                            width: 100%;
                            max-width: 100%;
                            max-height: 98vh;
                            margin: auto;
                        }
                    `}
                </style>
            </div>)
        }
        else
            return (<>
                <img src={image} className={"center-fit"} alt=""/>
                <style jsx>
                    {`
                        .center-fit {
                            overflow: hidden;
                            width: 100%;
                            max-width: 100%;
                            max-height: 98vh;
                            margin: auto;
                        }
                    `}
                </style>
            </>)
    }

    const getRandomImage = () => {
        if (!images)
            return ""

        const randomElement = images[Math.floor(Math.random() * images.length)];

        if (!randomElement)
            return ""

        console.log(randomElement)

        setImage(randomElement)
    }

    useInterval(() => {
        fetchImages()
    }, 1000000)

    useInterval(() => {
        console.log("go to next slide: ", doRotate)
        if (doRotate)
            getRandomImage()
    }, _DELAY)

    useEffect(() => {
        getRandomImage()
    }, [images])

    return (<>
        <div className="imgbox">
            {getDisplayComponent(image)}
        </div>

        <style jsx>{`
            .html {
              overflow: hidden;
            }

            * {
                overflow: hidden;
                margin: 0;
                padding: 0;
            }
            .imgbox {
                overflow: hidden;
                display: grid;
                height: 100%;
            }
            .center-fit {
                overflow: hidden;
                width: 100%;
                max-width: 100%;
                max-height: 98vh;
                margin: auto;
            }
        `}</style>
    </>)
}

export default Show