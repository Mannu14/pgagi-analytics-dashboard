import React from 'react'
import '../styles/contact.css'
import Header from '../pages/Header';
import { useState } from 'react';
import Loading from '../pages/Loading';

function Contact() {
    const apiUrlProcess = `${window.location.origin}/apis`;
    // function formreload() {
    //     setTimeout(function() {
    //          window.location.reload();
    //     },2000);
    //     this.submit();
    //   };
    const [Message, setMessage] = useState(null)
    const [updatedUser, setUpdatedUser] = useState({
        name: '',
        email: '',
        subject: '',
        number: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({ ...updatedUser, [name]: value });
    }
    const FormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', updatedUser.name);
        formData.append('email', updatedUser.email);
        formData.append('subject', updatedUser.subject);
        formData.append('number', updatedUser.number);
        formData.append('message', updatedUser.message);
        // console.log(updatedUser);
        if (updatedUser.name !== '' && updatedUser.email !== '' && updatedUser.subject !== '' && updatedUser.number !== '' && updatedUser.message !== '') {
            try {
                const response = await fetch(`${apiUrlProcess}/sendemail`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }
                if (response.ok) {
                    setMessage('Email Send successfully');
                    setUpdatedUser({
                        name: '',
                        email: '',
                        subject: '',
                        number: '',
                        message: ''
                    });
                }
                alert('Email Send successfully');
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            alert('All field are required')
        }
    };
    const [loading, setLoading] = useState(true);

    const handleLoad = () => {
        setLoading(false);
    };

    return (
        <>
            <Header />
            <section className="location">
                {loading && (
                    <Loading />
                )}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113135.4686063189!2d74.99515042057996!3d27.60954170741299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396ca4b82334472b%3A0x7f485cce3a6bf355!2sSikar%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1689331706733!5m2!1sen!2sin"
                    width="600"
                    height="450"
                    style={{ border: '0' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={handleLoad} // Set loading to false when the iframe loads
                ></iframe>
            </section>
            <section className="contact-us">
                <div className="row-contact">
                    <div className="contact-col">
                        <div>
                            <i className="fa fa-home"></i>
                            <span>
                                <h5>ABC Road, ABC Building</h5>
                                <p>sikar, Rajasthan, IN</p>
                            </span>
                        </div>
                        <div>
                            <i className="fa fa-phone"></i>
                            <span>
                                <h5>+1 0123456789</h5>
                                <p>Monday to Saturday,10AM to 6PM</p>
                            </span>
                        </div>
                        <div>
                            <i className="fa fa-envelope-o"></i>
                            <span>
                                <h5>enfo@gmail.com</h5>
                                <p>Email Us youe query</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="container-contact">
                    <h1>Contact Us</h1>
                    <form onSubmit={FormSubmit} id="blankform">
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" autoComplete="off"
                                value={updatedUser.name}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" autoComplete="off"
                                value={updatedUser.email}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Subject:</label>
                            <input type="text" id="subject" name="subject" autoComplete="off"
                                value={updatedUser.subject}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="number">Phone No. :</label>
                            <input type="number" id="number" name="number" autoComplete="off"
                                value={updatedUser.number}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <textarea id="message" name="message" rows="5" autoComplete="off"
                                value={updatedUser.message}
                                onChange={handleInputChange}></textarea>
                        </div>
                        <button id="send-btn" type="submit">Send</button>
                    </form>
                    {Message ?
                        <div style={{ color: '#f44336', fontSize: '17px', textAlign: 'center', marginTop: '10px' }} className="message">{Message}</div>
                        : ''
                    }
                </div>
            </section>
        </>
    )
}

export default Contact;