import React, { useEffect, useState } from 'react';
import './../App.css';

const MLPage: React.FC = () => {
    const [controlSignals, setControlSignals] = useState({ move_x: 0, move_y: 0 });

    useEffect(() => {
        const fetchControlSignals = async () => {
            try {
                const response = await fetch('http://10.131.56.157:5000/control_signals');
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
            <h1>Camera Feed</h1>
            <div id="video-container">
                <img id="video" src="http://10.131.56.157:5000/video_feed" alt="Camera feed" />
            </div>
            <div id="arrows-container">
                <span id="arrow-left" className="arrow" style={{ display: controlSignals.move_y < 0 ? 'inline' : 'none' }}>←</span>
                <span id="arrow-right" className="arrow" style={{ display: controlSignals.move_y > 0 ? 'inline' : 'none' }}>→</span>
                <span id="arrow-up" className="arrow" style={{ display: controlSignals.move_x > 0 ? 'inline' : 'none' }}>↑</span>
                <span id="arrow-down" className="arrow" style={{ display: controlSignals.move_x < 0 ? 'inline' : 'none' }}>↓</span>
            </div>
        </div>
    );
};

export default MLPage;