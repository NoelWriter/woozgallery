import {useEffect, useLayoutEffect, useState} from "react";
import React from 'react';

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

    const _DELAY = 10000

    const importAll = (r) => {
        return r.keys().map(r);
    }

    const fetchImages = () => {
        const files = importAll(require.context("../public/gallery", false, /\.*$/));

        setImages(files)
    };

    useLayoutEffect(() => {
        fetchImages()
    }, [])

    const getRandomImage = () => {
        if (!images)
            return ""

        const randomElement = images[Math.floor(Math.random() * images.length)];

        if (!randomElement)
            return ""

        setImage(randomElement.default.src)
    }

    useInterval(() => {
        fetchImages()
    }, 100000)

    useInterval(() => {
        getRandomImage()
    }, _DELAY)

    useEffect(() => {
        getRandomImage()
    }, [images])

    return (<>
        <div className="imgbox">
            <img src={image} className={"center-fit"} alt=""/>
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