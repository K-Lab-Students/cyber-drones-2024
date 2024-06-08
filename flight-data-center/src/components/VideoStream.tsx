import React, { useEffect, useState } from 'react';

const VideoStream = (props: {ip: string}) => {
    const videoUrl = "http://" + props.ip +":5000/control_signals";

    const [controlSignals, setControlSignals] = useState({ move_x: 0, move_y: 0 });

    useEffect(() => {
        const fetchControlSignals = async () => {
            try {
                const response = await fetch(videoUrl);
                const data = await response.json();
                setControlSignals(data);
            } catch (error) {
                console.error('Error fetching control signals:', error);
            }
        };

        const intervalId = setInterval(fetchControlSignals, 1000);

        return () => clearInterval(intervalId);
    }, [controlSignals]);

    return (
        <div>
            <h1 className={'font-bold text-center'}>Video Stream</h1>
            <img className={'rounded-md'} id="video" src={"http://" + props.ip + ":5000/video_feed"} alt="Camera feed" />
        </div>
    );
}

export default VideoStream;