import React from 'react';
import { toast } from 'react-toastify';

const AccountContent = () => {

    const handleRegister = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks for Registration")
    }

    const handleLogin = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Login Successfully")
    }

    return (
        <>
            <div className="account-page-area pt-120 pb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="register-form billing-form">
                                <h2>new account</h2>
                                <form onSubmit={handleRegister}>
                                    <input type="email" placeholder="Email" name='email' autoComplete='true' required />
                                    <input type="text" placeholder="Username" name='userName' autoComplete='true' required />
                                    <input type="password" placeholder="password" name='password' required />
                                    <span>Contain a combination of at least six number, letters .</span>
                                    <input type="password" placeholder="Re-password" name='rePassword' required />
                                    <label className="radio-inline">
                                        <input name="policy-radio" type="radio" className='me-2' required />I have read and agree to the tos and privacy policy.
                                    </label>
                                    <input type="submit" value="register" />
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="login-form billing-form">
                                <h2>login your account </h2>
                                <form onSubmit={handleLogin}>
                                    <input type="text" placeholder="Username" name='user' />
                                    <input type="password" placeholder="password" name='password' />
                                    <input type="submit" value="login" />
                                    <span className="login-note">NB :  Lorem ipsum dolor sit amet, dolor at felis blandit curabitur molestie, feugiat lectus a, varius justo. Nulla quis at, tincidunt enim, amet</span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountContent;