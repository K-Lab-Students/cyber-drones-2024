import React, { useState } from 'react';

const DroneControl: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    const handleControl = (command: string) => {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = `${timestamp}: ${command}`;
        setLogs((prevLogs) => [...prevLogs, newLog]);
        console.log(`Executing command: ${command}`);
        // Здесь можно добавить логику для отправки команд на дрон
    };

    return (
        <div className="flex flex-col items-center space-y-4">


            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => handleControl('rotate-left')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"
                >

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>

                </button>
                <button
                    onClick={() => handleControl('up')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>

                </button>
                <button
                    onClick={() => handleControl('rotate-right')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                    </svg>

                </button>
            </div>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => handleControl('left')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>

                </button>

                <div className="bg-gray-500 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"></div>

                <button
                    onClick={() => handleControl('right')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>

                </button>
            </div>
            <div className="flex justify-center space-x-4">
                <div className="bg-gray-500 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"></div>

                <button
                    onClick={() => handleControl('down')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>

                </button>

                <div className="bg-gray-500 text-white font-bold h-14 w-14 flex items-center justify-center rounded-xl"></div>
            </div>

            <button
                onClick={() => handleControl('forward')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-14 w-2/3 flex items-center justify-center rounded-xl"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>

            </button>

            <button
                onClick={() => handleControl('backward')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-14 w-2/3 flex items-center justify-center rounded-xl"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>

            </button>

            <div className="mt-4 w-full max-w-md">
                <h2 className="text-lg font-bold mb-2">Лог событий</h2>
                <div className="h-64 overflow-y-auto bg-gray-100 p-4 rounded shadow">
                    <ul className="list-disc list-inside">
                        {logs.map((log, index) => (
                            <li key={index}>{log}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DroneControl;