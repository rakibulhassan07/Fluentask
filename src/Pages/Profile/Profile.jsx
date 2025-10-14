import React, { useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
            
            {user ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">
                                    {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {user.displayName || 'User'}
                            </h2>
                           
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-sm font-bold text-gray-500">Email</dt>
                                    <dd className="text-sm text-gray-900">{user.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm  text-gray-500 font-bold">Name</dt>
                                    <dd className="text-sm text-gray-900">{user.displayName || 'Not set'}</dd>
                                </div>
                                
                            </dl>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Provider With</h3>
                            <dl className="space-y-2">
                                {user.providerData?.map((provider, index) => (
                                    <div key={index}>  
                                        <dd className="text-sm text-gray-900 capitalize">
                                            {provider.providerId.replace('.com', '')}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600">Please log in to view your profile.</p>
                </div>
            )}
        </div>
    );
};

export default Profile;