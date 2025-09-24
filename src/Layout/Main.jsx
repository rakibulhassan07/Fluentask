import React from 'react';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Pages/Shared/Footer/Footer';

const Main = () => {
    return (
        <div>
            <Navbar />
            <div className="pt-16">
                <Outlet />
            </div>
            <Footer />
            
        </div>
    );
};

export default Main;