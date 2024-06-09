import React, {useState} from 'react';
import NavbarUI from "../components/NavbarUI";
import {YMaps, Map, Circle, Clusterer, Placemark} from '@pbe/react-yandex-maps';
import TelemetryChart from "../components/TelemetryChart";
import svgDroneIcon from "../ui/QuadrocopterIcon";
import {Drone} from "../DTO/Drone";
import DroneControl from "../components/DroneControl";
import VideoStream from "../components/VideoStream";

const VerticalLine: React.FC<{ height: number; top: number; left: number; text: string }> = ({
                                                                                                 height,
                                                                                                 top,
                                                                                                 left,
                                                                                                 text,
                                                                                             }) => {
    return (
        <div
            className="absolute flex flex-col items-center"
            style={{ top: `${top}px`, left: `${left}px` }}
        >
            <div className="relative border-l-2 border-black" style={{ height: `${height}px` }}>
        <span className="absolute top-1/2 -left-10 transform -translate-y-1/2 bg-white px-2 flex items-center w-full">
          {text}
        </span>
                <div
                    className="before:absolute before:border-5 before:border-transparent before:border-b-black
                    before:content-[''] before:top-[-10px] before:left-[-5px]
                    after:absolute after:border-5 after:border-transparent after:border-t-black
                    after:content-[''] after:bottom-[-10px] after:left-[-5px]"
                />
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () =>  {
    const MAX_DRONE_VISUALIZATION_HEIGHT: number = 100; // in display PX

    const [backPack, setBackPack] = useState<boolean>(true);
    const [drones, setDrones] = useState<Drone[]>([
        {
            lat: 47.203113,
            lng: 38.935530,
            height: 10,
            telemetryData: {
                timestamps: [1, 2, 3, 4, 5, 6],
                altitude: [100, 200, 150, 170, 180, 160],
                speed: [10, 20, 15, 18, 16, 14],
                battery: [100, 95, 90, 85, 80, 75],
            },
            ip: "10.131.56.157",
        }
    ]);
    const [droneHeight, setDroneHeight] = useState<number>(drones[0].height);

    function processingDroneHeight(height: number): number {
        if (height >= MAX_DRONE_VISUALIZATION_HEIGHT) {
            return MAX_DRONE_VISUALIZATION_HEIGHT;
        } else {
            return height;
        }
    }

    function processingDroneHeightPx(height: number) {
        return processingDroneHeight(height) + "px";
    }

    const apiControlServo = async (angle: number) => {
        try {
            const response = await fetch('http://' + drones[0].ip + ':5000/set_angle?angle=' + angle);
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Угол установлен:', data);
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    function closeBackPack() {
        setBackPack(true);
        apiControlServo(0);
    }

    function openBackPack() {
        setBackPack(false);
        apiControlServo(90);
    }

    return (<>

        <div className={`flex flex-cols w-full items-center`}>
            <div className="w-1/4 h-screen p-4 space-y-4">
                <h1 className={'text-center font-bold'}>Квадрокоптер #1</h1>
                {/*<div className="w-full rounded-md flex items-center justify-center bg-black h-[300px]">*/}
                {/*    <p className={'text-gray-300'}>Video Capture...</p>*/}
                {/*</div>*/}

                <VideoStream ip={drones[0].ip} />

                {/*<iframe*/}
                {/*    title="Embedded Site"*/}
                {/*    src="http://10.131.56.157:5000/"*/}
                {/*    style={{ width: '100%', height: '500px', border: 'none' }}*/}
                {/*></iframe>*/}

                <div className="rounded-md relative border-1 border-gray-100 p-4">
                    <div className={'relative w-[300px]'}>
                        {/* Верняя и Нижняя основы */}
                        <div className="absolute top-0 left-0 w-[300px] h-1 bg-black"></div>
                        <div className="absolute top-[60px] left-0 w-[300px] h-1 bg-black"></div>

                        {/* Нижние болты - Шаси */}
                        <div className="absolute top-[64px] left-[10px] w-1 h-[60px] bg-gray-300"></div>
                        <div className="absolute top-[64px] right-[10px] w-1 h-[60px] bg-gray-300"></div>

                        {/* Внутрение болты - боковые */}
                        <div className="absolute top-[4px] left-[10px] w-1 h-[56px] bg-gray-300"></div>
                        <div className="absolute top-[4px] right-[10px] w-1 h-[56px] bg-gray-300"></div>


                        {/* Внутрение болты - средние */}
                        <div className="absolute top-[4px] left-[118px] w-1 h-[56px] bg-gray-300"></div>
                        <div className="absolute top-[4px] right-[118px] w-1 h-[56px] bg-gray-300"></div>

                        {/* Левые двигатель */}
                        <div className="absolute top-[7px] left-[16px] w-[100px] h-[50px] bg-green-100 flex items-center justify-center">
                            <p>Левый</p>
                        </div>

                        {/* Правые двигатель */}
                        <div className="absolute top-[7px] right-[16px] w-[100px] h-[50px] bg-green-100 flex items-center justify-center">
                            <p>Правый</p>
                        </div>
                    </div>

                    <VerticalLine height={processingDroneHeight(droneHeight)} top={processingDroneHeight(droneHeight)} left={100} text={processingDroneHeight(droneHeight) + " М"} />

                    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: `${processingDroneHeightPx(droneHeight)}` }}>
                        <path d="M0,150 L20,148 L40,152 L60,149 L80,151 L100,150 L120,149 L140,151 L160,150 L180,148 L200,152 L220,150 L240,149 L260,151 L280,150 L300,148 L320,152 L340,150 L360,149 L380,151 L400,150 L420,148 L440,152 L460,150 L480,149 L500,151"
                              fill="none" stroke="sienna" stroke-width="3" />
                    </svg>
                </div>

                <div className={'relative w-[300px] h-[300px]'}>
                    {/*Внешняя рама*/}
                    <div className="absolute top-0 left-0 w-[150px] h-[150px] rounded-full bg-black"></div>
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-black"></div>
                    <div className="absolute bottom-0 left-0 w-[150px] h-[150px] rounded-full bg-black"></div>
                    <div className="absolute bottom-0 right-0 w-[150px] h-[150px] rounded-full bg-black"></div>

                    {/*Пустота между кругами*/}
                    <div className="absolute top-[18px] left-[18px] w-[112px] h-[112px] rounded-full bg-gray-100"></div>
                    <div className="absolute top-[18px] right-[18px] w-[112px] h-[112px] rounded-full bg-gray-100"></div>
                    <div className="absolute bottom-[18px] left-[18px] w-[112px] h-[112px] rounded-full bg-gray-100"></div>
                    <div className="absolute bottom-[18px] right-[18px] w-[112px] h-[112px] rounded-full bg-gray-100"></div>

                    {/*Внутреняя рама*/}
                    <div className="absolute top-[37px] left-[37px] w-[75px] h-[75px] rounded-full bg-black"></div>
                    <div className="absolute top-[37px] right-[37px] w-[75px] h-[75px] rounded-full bg-black"></div>
                    <div className="absolute bottom-[37px] left-[37px] w-[75px] h-[75px] rounded-full bg-black"></div>
                    <div className="absolute bottom-[37px] right-[37px] w-[75px] h-[75px] rounded-full bg-black"></div>

                    {/*Соединение внешнего и внутренего круга*/}
                    <div className="absolute bottom-[37px] right-[37px] w-[20px] h-[75px] rotate-[70deg] transform-gpu bg-black"></div>
                    <div className="absolute top-[37px] right-[37px] w-[20px] h-[75px] rotate-[70deg] transform-gpu bg-black"></div>
                    <div className="absolute bottom-[37px] left-[37px] w-[20px] h-[75px] rotate-[70deg] transform-gpu bg-black"></div>
                    <div className="absolute top-[37px] left-[37px] w-[20px] h-[75px] rotate-[70deg] transform-gpu bg-black"></div>

                    <div className="absolute bottom-[67px] right-[67px] w-[20px] h-[75px] rotate-[30deg] transform-gpu bg-black"></div>
                    <div className="absolute top-[67px] left-[67px] w-[20px] h-[75px] rotate-[10deg] transform-gpu bg-black"></div>
                    <div className="absolute bottom-[67px] right-[67px] w-[20px] h-[75px] rotate-[30deg] transform-gpu bg-black"></div>
                    <div className="absolute top-[67px] right-[67px] w-[20px] h-[75px] rotate-[30deg] transform-gpu bg-black"></div>

                    <div className="absolute top-[10px] left-[87px] w-[20px] h-[35px] rotate-[30deg] transform-gpu bg-black"></div>
                    <div className="absolute top-[10px] right-[87px] w-[20px] h-[35px] rotate-[-30deg] transform-gpu bg-black"></div>
                    <div className="absolute bottom-[10px] left-[87px] w-[20px] h-[35px] rotate-[-30deg] transform-gpu bg-black"></div>
                    <div className="absolute bottom-[10px] right-[87px] w-[20px] h-[35px] rotate-[30deg] transform-gpu bg-black"></div>

                    {/*Соединение круглых рам*/}
                    <div className="absolute top-[130px] right-[37px] w-[75px] h-[40px] bg-black"></div>
                    <div className="absolute top-[130px] left-[37px] w-[75px] h-[40px] bg-black"></div>
                    <div className="absolute bottom-[37px] right-[130px] w-[40px] h-[75px] bg-black"></div>
                    <div className="absolute top-[37px] left-[130px] w-[40px] h-[75px] bg-black"></div>

                    {/*    Raspbarry*/}
                    <div className={'absolute top-[110px] left-[90px] h-[80px] w-[120px] rounded-md bg-green-300'}></div>

                    {/*     Camera */}
                    <div className={'absolute top-[30px] left-[135px] h-[10px] w-[30px] rounded-md bg-blue-300'}></div>
                    <div className={'absolute top-[25px] left-[145px] h-[5px] w-[10px] bg-gray-500'}></div>

                    {/*  Flight Vector line  */}
                    <div className="absolute bottom-[120px] right-[-80px] arrow-1 w-24 h-8 flex before:block before:bg-current before:w-4 before:animate-[a1_1.5s_infinite_linear] -rotate-90 text-indigo-400"></div>
                </div>
            </div>

            <div className="w-full h-screen relative z-0">
                <div className="w-full absolute top-0 left-0 flex items-center justify-center pt-4 pb-2 z-50">
                    <NavbarUI drone={drones[0]} />
                </div>
                <YMaps>
                    <Map defaultState={{ center: [drones[0].lat, drones[0].lng], zoom: 16 }} width={"100%"} height={"100%"}>
                        <Circle
                            geometry={[[drones[0].lat, drones[0].lng], 35]}
                            options={{
                                draggable: false,
                                fillColor: "#DB709377",
                                strokeColor: "#990066",
                                strokeOpacity: 0.8,
                                strokeWidth: 5,
                            }}
                        />
                        <Clusterer
                            options={{
                                preset: "islands#invertedVioletClusterIcons",
                                groupByCoordinates: false,
                            }}
                        >
                            {drones?.map((drone:any, index:any) => (
                                <Placemark key={index} geometry={{ type: "Point", coordinates: [drone.lat, drone.lng] }} options={{
                                    iconLayout: 'default#image',
                                    iconImageHref: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgDroneIcon)}`,
                                    iconImageSize: [50, 50],
                                }} />
                            ))}
                        </Clusterer>
                        {
                            (!backPack) ? <Placemark geometry={{ type: "Point", coordinates: [drones[0].lat, drones[0].lng] }} /> : ""
                        }
                    </Map>
                </YMaps>
            </div>

            <div className="w-1/4 h-screen p-4">
                <div className="shadow p-2 rounded-md ring-1 border-1 border-gray-100 space-y-4">
                    <h2 className={'text-center font-bold'}>Управление полезной нагрузкой</h2>
                    <p>Статус:
                        {
                            (backPack) ? <span className={'font-bold text-green-600'}>Закрыто</span> : <span className={'font-bold text-red-600'}>Сброшено</span>
                        }
                    </p>

                    {
                        (backPack) ? <button type={'button'} className={'w-full py-2 font-bold bg-red-400 hover:bg-red-500 rounded-md'} onClick={() => openBackPack()}>Сбросить</button> : ""
                    }
                    <button type={'button'} className={'w-full py-2 font-bold bg-red-400 hover:bg-red-500 rounded-md'} onClick={() => closeBackPack()}>Debug Close</button>
                </div>

                <div className="shadow mt-4 p-2 rounded-md ring-1 border-1 border-gray-100 space-y-4">
                    <h1 className={'text-center'}>Quadcopter Telemetry Dashboard</h1>
                    <TelemetryChart data={drones[0].telemetryData} />
                </div>

                <div className="shadow mt-4 p-2 rounded-md ring-1 border-1 border-gray-100 space-y-4">
                    <DroneControl />
                </div>

                <div className="mt-4">

                </div>
            </div>
        </div>

    </>);
}

export default DashboardPage;