import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from '../../App';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)
    useEffect(()=>{
        fetch('http://localhost:5000/bookings?email='+loggedInUser.email,{
            method: "GET",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "Authorization" : `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            setBookings(data)
        })
    },[])
    return (
        <div>
            <h3>You have: {bookings.length}</h3>
            {
                bookings.map(book => <li>
                    {book.name} from:
                    {book.checkIn} To:
                    {book.checkOut}
                    </li>)
            }
        </div>
    );
};

export default Bookings;