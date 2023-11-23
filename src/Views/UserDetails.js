import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useFetch from '../Helpers/useFetch';
import { Select, Button } from 'antd';
import { Card, Col, Row } from 'antd';

const UserDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams()
    const [area, setArea] = useState();
    const [currentLocation, setCurrentLocation] = useState();
    const [region, setRegion] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isCountrySelected, setIsCountrySelected] = useState(false)
    const [isClockRunning, setIsClockRunning] = useState(true)
    const [countryData, isCLoading, getCountryData] = useFetch(
        'http://worldtimeapi.org/api/timezone',
        [],
        true
    );
    const [timeData, isTLoading, getTimeData] = useFetch(
        `http://worldtimeapi.org/api/timezone/${area}/${currentLocation}/${region}`,
        [],
        false
    );
    const [postsData, isPLoading, getPostsData] = useFetch(
        'https://jsonplaceholder.typicode.com/posts',
        [],
        true
    );
    const [clockTimer, setClockTimer] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [lastPausedTime, setLastPausedTime] = useState('');

    const { Option } = Select;


    const user = location.state && location.state.user;


    const handleCountryChange = (value) => {
        const [selectedArea, selectedLocation, selectedRegion] = value.split('/');
        setArea(selectedArea);
        setCurrentLocation(selectedLocation);
        setRegion(selectedRegion ?? "");

        let apiEndpoint;

        if (selectedRegion) {
            apiEndpoint = `http://worldtimeapi.org/api/timezone/${selectedArea}/${selectedLocation}/${selectedRegion}`;
        } else if (selectedLocation) {
            apiEndpoint = `http://worldtimeapi.org/api/timezone/${selectedArea}/${selectedLocation}`;
        } else {
            apiEndpoint = `http://worldtimeapi.org/api/timezone/${selectedArea}`;
        }

        getTimeData(apiEndpoint);
        setIsCountrySelected(true)
    };



    useEffect(() => {
        if (!isTLoading && timeData && timeData.datetime) {
            setCurrentTime(timeData.datetime.slice(11, 19));
            startClock();
        }
    }, [isTLoading, timeData, area, currentLocation, region]);


    const startClock = () => {
        clearInterval(clockTimer);
        setIsClockRunning(true)

        // Use the last paused time as the initial time if it exists
        const initialTime = lastPausedTime || timeData.datetime.slice(11, 19);
        setCurrentTime(initialTime);

        setClockTimer(setInterval(() => {
            setCurrentTime((prevTime) => {
                const [hours, minutes, seconds] = prevTime.split(':');
                const newSeconds = (parseInt(seconds, 10) + 1) % 60;
                const newMinutes = (parseInt(minutes, 10) + Math.floor((parseInt(seconds, 10) + 1) / 60)) % 60;
                const newHours = (parseInt(hours, 10) + Math.floor((parseInt(minutes, 10) + 1) / 60)) % 24;

                return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
            });
        }, 1000));
    };



    const pauseClock = () => {
        clearInterval(clockTimer);
        setClockTimer(null);
        setIsClockRunning(false)

        // Save the current time as the last paused time
        setLastPausedTime(currentTime);
    };
    const openModal = (event, card) => {
        setIsModalVisible(true);
        setSelectedCard(card)
    };


    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedCard(null)
    };

    const userPost = postsData?.filter(i => i.userId == id)

    if (!user) {
        return <p>No user data found</p>;
    }

    return (
        <div>
            {/* <div className='topBar'>
                <button onClick={() => navigate('/')} style={{ background: "#cfe2f3", borderRadius: "5px" }}>Back</button>

                <div>
                    <label>Select Country: </label>
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select a country"
                        loading={isCLoading}
                        onChange={handleCountryChange}
                    >
                        {countryData?.map((country, index) => (
                            <Option key={index} value={country} onClick={() => { }}>
                                {country}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className='clock'>
                    <h4 style={{ textAlign: "center" }}>{isCountrySelected ? currentTime : "Select a country first"}</h4>
                </div>
                {!isClockRunning ? <Button onClick={startClock} disabled={!isCountrySelected} style={{ background: "#b6d7a8" }}>Pause/Start</Button> :
                    <Button onClick={pauseClock} disabled={!isCountrySelected} style={{ background: "#b6d7a8" }}>Pause/Start</Button>}


            </div> */}
            <Row gutter={16} className='topBar'>
                <Col xs={24} md={2}>
                    <button onClick={() => navigate('/')} style={{ background: "#cfe2f3", borderRadius: "5px" }}>Back</button>
                </Col>
                <Col xs={24} md={6}>
                    <div>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select a country"
                            loading={isCLoading}
                            onChange={handleCountryChange}
                        >
                            {countryData?.map((country, index) => (
                                <Option key={index} value={country} >
                                    {country}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </Col>
                <Col xs={24} md={6}>
                    <div className='clock'>
                        <h4 style={{ textAlign: "center" }}>{isCountrySelected ? currentTime : "Select a country first"}</h4>
                    </div>
                </Col>
                <Col xs={24} md={3}>
                    <Button
                        onClick={!isClockRunning ? startClock : pauseClock}
                        disabled={!isCountrySelected}
                        style={{ background: "#b6d7a8", width: '100%' }}
                    >
                        {!isClockRunning ? "Pause/Start" : "Pause/Start"}
                    </Button>
                </Col>
            </Row>

            <h3 style={{ textAlign: "center" }}>Profile Page</h3>
            <div className='userInfo'>
                <div className='userName'>
                    <p>{user.name}</p>
                    <p>{user.username} | {user.company.catchPhrase}</p>
                </div>

                <div className='userAddress'>
                    <p>{user.address.street} {user.address.suite} {user.address.city} {user.address.zipcode}</p>

                    <p>{user.email} | {user.phone}</p>

                </div>

            </div>
            <Row gutter={16}>
                {(
                    userPost?.map((p) => (
                        <Col sm={24} md={8} key={p.id}>
                            <Card onClick={(event) => openModal(event, p)} className='postCard'>
                                <div >
                                    <strong> <p className='userName'>{p.title}</p></strong>
                                    <p className='userPosts'>{p.body}</p>
                                </div>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {isModalVisible && (
                <div
                    className='modalBackground'
                    onClick={closeModal}
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <div
                        className='modalContent'
                        onClick={(event) => event.stopPropagation()} // Closes the popup only if click outside of the popup
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                        }}
                    >

                        <div >
                            <h2>{selectedCard.title}</h2>
                            <p>{selectedCard.body}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserDetails;
