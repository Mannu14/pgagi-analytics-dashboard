import React from "react";
import { useState } from 'react'
import { useEffect } from "react";

function Footer() {
    const apiUrlProcess = `${window.location.origin}/apis`;
    const [EmailValue, setEmailValue] = useState('');
    const [Message, setMessage] = useState('');
    const InputEmailValue = (e) => {
        const Email = e.target.value;
        setEmailValue(Email);
    }

    const SubscribeToGetNewUpdates = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', EmailValue);

        if (EmailValue !== '') {
            try {
                const response = await fetch(`${apiUrlProcess}/subscribe`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });
                const alertMsgdata = await response.json();

                if (response.ok) {
                    setMessage(alertMsgdata.alertMsg);
                    setEmailValue('');
                }
                else {
                    setMessage(alertMsgdata.alertMsg);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            setMessage('Enter the Email')
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage('')
        }, 7000);

        return () => clearInterval(intervalId);
    }, [Message]);

    return (
        <>
            <footer className="footer-section">
                <div className="footer-container">
                    <div className="footer-cta pt-5 pb-5">
                        <div className="footer-row">
                            <div className="footer-row-top">
                                <div className="single-cta">
                                    <div className="single-cta-1">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <div className="cta-text">
                                            <h4>Find us</h4>
                                            <span>Mundru, sikar 332712, Rajasthan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-row-top">
                                <div className="single-cta">
                                    <div className="single-cta-2">
                                        <i className="fas fa-phone"></i>
                                        <div className="cta-text">
                                            <h4>Call us</h4>
                                            <span>+1 90000000000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-row-top">
                                <div className="single-cta">
                                    <div className="single-cta-3">
                                        <i className="far fa-envelope-open"></i>
                                        <div className="cta-text">
                                            <h4>Mail us</h4>
                                            <span>mail@info.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-content pt-5 pb-5">
                        <div className="footer-row">
                            <div className="footer-row-1">
                                <div className="footer-widget">
                                    <div className="footer-logo">
                                        <a className="logo-contact" href="NewsApis">News <span>Apis</span></a>
                                    </div>
                                    <div className="footer-text">
                                        <p>Lorem ipsum dolor sit amet, consec tetur adipisicing elit, sed do eiusmod tempor incididuntut consec tetur adipisicing
                                            elit,Lorem ipsum dolor sit amet.</p>
                                    </div>
                                    <div className="footer-social-icon">
                                        <span>Follow us</span>
                                        <a href="#"><i className="fab fa-facebook-f facebook-bg"></i></a>
                                        <a href="#"><i className="fab fa-twitter twitter-bg"></i></a>
                                        <a href="#"><i className="fab fa-google-plus-g google-bg"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="footer-row-2">
                                <div className="footer-widget">
                                    <div className="footer-widget-heading">
                                        <h3>Useful Links</h3>
                                    </div>
                                    <ul>
                                        <li><a href="#">Home</a></li>
                                        <li><a href="#">about</a></li>
                                        <li><a href="#">services</a></li>
                                        <li><a href="#">portfolio</a></li>
                                        <li><a href="#">Contact</a></li>
                                        <li><a href="#">About us</a></li>
                                        <li><a href="#">Our Services</a></li>
                                        <li><a href="#">Expert Team</a></li>
                                        <li><a href="#">Contact us</a></li>
                                        <li><a href="#">Latest News</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="footer-row-3">
                                <div className="footer-widget">
                                    <div className="footer-widget-heading">
                                        <h3>Subscribe</h3>
                                    </div>
                                    <div className="footer-text mb-25">
                                        <p>Don’t miss to subscribe to our new feeds, kindly fill the form below.</p>
                                    </div>
                                    <div className="subscribe-form">
                                        <form onSubmit={SubscribeToGetNewUpdates}>
                                            <input type="email" name="email" placeholder="Email Address" value={EmailValue} onChange={InputEmailValue} />
                                            <button type='submit'><i className="fab fa-telegram-plane"></i></button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright-area">
                    <div className="container">
                        <div className="footer-row">
                            <div className="col-xl-6 col-lg-6 text-center text-lg-left">
                                <div className="copyright-text">
                                    <p>Copyright &copy; 2023, All Right Reserved <a target="_blank" href="https://mkcoding.online">Mkcoding</a></p>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 d-none d-lg-block text-right">
                                <div className="footer-menu">
                                    <ul>
                                        <li><a href="#">Home</a></li>
                                        <li><a href="#">Terms</a></li>
                                        <li><a href="#">Privacy</a></li>
                                        <li><a href="#">Policy</a></li>
                                        <li><a href="#">Contact</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {Message ?
                <div className="user-message" style={{ border: `${Message === 'Successfully subscribe.' ? '1px solid #89ee2b' : '1px solid #f96c78'}` }}>
                    <div className="notification">
                        {Message === 'Successfully subscribe.' ?
                            <>
                                <i className="fa-solid fa-bell"></i>
                                <p style={{ color: '#89ee2b' }}>{Message}</p>
                            </>
                            :
                            <>
                                <i className="fa-solid fa-bell-slash"></i>
                                <p style={{ color: '#f02d2d' }}>{Message}</p>
                            </>
                        }
                        <i className="fa-regular fa-circle-xmark" onClick={() => setMessage('')}></i>
                    </div>
                </div> : ''
            }
        </>
    );
}

export default Footer;