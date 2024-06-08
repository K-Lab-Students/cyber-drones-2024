import React from 'react';

const DroneControl: React.FC = () => {
    const handleControl = (command: string) => {
        console.log(`Executing command: ${command}`);
        // Здесь можно добавить логику для отправки команд на дрон
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => handleControl('rotate-left')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Вращение налево
                </button>
                <button
                    onClick={() => handleControl('up')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Вверх
                </button>
                <button
                    onClick={() => handleControl('rotate-right')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Вращение направо
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => handleControl('left')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Влево
                </button>
                <button
                    onClick={() => handleControl('forward')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Вперед
                </button>
                <button
                    onClick={() => handleControl('right')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Вправо
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => handleControl('down')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Вниз
                </button>
                <button
                    onClick={() => handleControl('backward')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Назад
                </button>
            </div>
        </div>
    );
};

export default DroneControl;