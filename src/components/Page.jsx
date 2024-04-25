import { forwardRef } from 'react';
import './Document.css';

import PropTypes from 'prop-types';


// Page Class. Has Text, Image, and Table classes built in as html elements
// Document has the classes for spawning the items
// But uses ref to put them in the page, therefore the page is the parent

const Page = forwardRef((props, ref) => {
    console.log("PAGE LOADED")
    return (
        <div
            contentEditable={true}
            ref={ref}
            style={{
                border: '1px solid #ccc',
                padding: '5px',
                aspectRatio: '8.5 / 11',
                width: '110%',
                margin: '20px',
                backgroundColor: props.bgColor,
                color: props.fontColor,
                fontSize: `${props.fontSize}px`,
            }}
        />
    )
})


Page.propTypes = {
    bgColor: PropTypes.string,
    fontColor: PropTypes.string,
    fontSize: PropTypes.number,
}


Page.displayName = 'Page'
export default Page