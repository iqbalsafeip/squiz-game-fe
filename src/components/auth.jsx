import React, { useEffect, useState } from 'react'


const Auth = props => {
    const [data, setData] = useState({
        username: '',
        isBuat: false,
        isJoin: false,
        isAuth: false,
        jml: undefined,
        roomName: ''
    });

    const setUserName = () => {
        props.socket.emit('setUsername', data.username);
        setData({...data, isAuth: true});
    }

    const buatRoom = () => {
        props.socket.emit('buatRoom', data.jml)
    }

    const joinRoom = () => {
        props.socket.emit('joinRoom', data.roomName)
    }
    
    
    return (
        <div className="auth-container">
            <h2>Squiz Game</h2>
                <div className="doll-img"></div>
                {!data.isAuth && <div className="auth-box">
                    <label htmlFor="">Username</label>
                    <input type="text" placeholder="Masukan Username" onChange={(e)=> setData({...data, username: e.target.value})} />
                    <button onClick={setUserName} >Masuk</button>
                </div>}
                {data.isAuth && <div className="auth-box">
                    <button onClick={()=> setData({...data, isBuat: true, isAuth: false})} >Buat Room</button>
                    <button onClick={()=> setData({...data, isJoin: true, isAuth: false})}>Masuk Room</button>
                </div>}
                {data.isBuat && <div className="auth-box">
                    <select value={data.jml} onChange={(e) => setData({...data, jml: e.target.value})} >
                        <option value={undefined}>pilih jml member</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>    
                    </select>    
                    <button onClick={buatRoom} >Buat Room</button>
                </div>}
                {data.isJoin && <div className="auth-box">
                    <input type="text" onChange={(e) => setData({...data, roomName: e.target.value})} />
                    <button onClick={joinRoom} >Join Room</button>
                </div>}
        </div>
    )
}

export default Auth