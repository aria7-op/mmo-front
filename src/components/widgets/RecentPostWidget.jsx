import React from 'react';
import RecentPostV1Data from '../../jsonData/RecentPostV1Data.json'
import SingleRecentPost from './SingleRecentPost';

const RecentPostWidget = () => {
    return (
        <>
            <div className="widget-two">
                <h1>Recent Post</h1>
                <div className="all_r_pst">
                    {RecentPostV1Data.map(post =>
                        <SingleRecentPost post={post} key={post.id} />
                    )}
                </div>
            </div>
        </>
    );
};

export default RecentPostWidget;