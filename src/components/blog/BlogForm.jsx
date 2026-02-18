import React from 'react';
import { toast } from 'react-toastify';

const BlogForm = () => {

    const handleSearch = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks for your comment")
    }

    return (
        <>
            <div className="contact-field">
                <h2>add your comment</h2>
                <form onSubmit={handleSearch}>
                    <div className="row">
                        <div className="col-md-12 message-input">
                            <div className="single-input-field">
                                <textarea placeholder="Message" name='message' autoComplete='true' required></textarea>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12">
                            <div className="single-input-field">
                                <input type="text" placeholder="Your Name" name='name' autoComplete='true' required />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-12">
                            <div className="single-input-field">
                                <input type="email" placeholder="Your E-mail" name='email' autoComplete='true' required />
                            </div>
                        </div>
                        <div className="single-input-fieldsbtn">
                            <input type="submit" value="send now" />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default BlogForm;