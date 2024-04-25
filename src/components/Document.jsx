import { useEffect, useState, useRef, forwardRef } from 'react';
import Page from './Page';
import './Document.css';

const Document = forwardRef((_props, ref) => {
    const contentRef = useRef();
    const [fontSize, setFontSize] = useState(16);
    const [fontColor, setFontColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');

    const generateRandomString = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const length = 10;
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    };

    const [title, setTitle] = useState(generateRandomString());

    // Main Format Function
    const handleFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        contentRef.current.focus();
    };

    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value);
        handleFormat('fontSize', e.target.value);
    };

    const handleFontColorChange = (color) => {
        setFontColor(color);
        handleFormat('foreColor', color);
    };

    const handleBgColorChange = (color) => {
        setBgColor(color);
        handleFormat('hiliteColor', color);
    };

    const handleTitleChange = (e) => {
        localStorage.removeItem(title);
        setTitle(e.target.value.replace(" ", '-'));
        const content = localStorage.getItem(title);
        if (content) {
            contentRef.current.innerHTML = content;
        }
    };

    // Document Class
    const loadCache = () => {
        const content = localStorage.getItem(title);
        if (content) {
            contentRef.current.innerHTML = content;
        }
    }

    const download = () => {
        const content = contentRef.current.innerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.html';
        a.click();
    }

    const uploadHTML = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'text/html';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                contentRef.current.innerHTML = content;
            };
            reader.readAsText(file);
        };
        input.click();
    }


    // Image Class
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // Set canvas dimensions to image dimensions
                img.width = img.width / 2 > 400 ? img.width / 4 : img.width / 4;
                img.height = img.height / 2 > 400 ? img.width / 4 : img.height / 4;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                handleFormat('insertImage', dataUrl);
            };
        };
        reader.readAsDataURL(file);
    }

    const handleImageResize = (imgElement) => {
        let originalWidth = 0;
        let originalHeight = 0;
        // eslint-disable-next-line no-unused-vars
        let originalX = 0;
        // eslint-disable-next-line no-unused-vars
        let originalY = 0;
        let originalMouseX = 0;
        let originalMouseY = 0;

        const startResizing = (e) => {
            e.preventDefault();
            originalWidth = imgElement.width;
            originalHeight = imgElement.height;
            originalX = imgElement.x;
            originalY = imgElement.y;
            originalMouseX = e.clientX;
            originalMouseY = e.clientY;
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResizing);
        }

        const resize = (e) => {
            const width = originalWidth + e.clientX - originalMouseX;
            const height = originalHeight + e.clientY - originalMouseY;
            imgElement.width = width;
            imgElement.height = height;
        }

        const stopResizing = () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        }

        imgElement.addEventListener('mousedown', startResizing);
    }

    // Table Class
    const uploadTable = () => {
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '50%';
        table.style.border = '1px solid #ccc';
        table.style.borderBlock = '1px solid #ccc';

        const rows = prompt('Enter number of rows');
        const cols = prompt('Enter number of columns');
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                td.textContent = `Row ${i + 1} Col ${j + 1}`;
                td.style.border = '1px solid #ccc';
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        contentRef.current.appendChild(table);
    }

    // react stuff - not important
    useEffect(() => {
        if (contentRef.current.innerHTML === '') {
            handleFormat('justifyLeft');
        }

        const saveContent = () => {
            localStorage.setItem(title, contentRef.current.innerHTML);
        }
        contentRef.current.addEventListener('input', saveContent);


    }, [title]);

    // on start load content from cache
    useEffect(() => {
        const content = localStorage.getItem(title);
        if (content) {
            contentRef.current.innerHTML = content;
        }
    }, []);

    return (
        <>
            <input type="text" placeholder="Untitled" style={{ textAlign: "center" }} className='Title' value={title} onChange={handleTitleChange} onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()} />
            <div className='Header'>
                <button onClick={() => handleFormat('bold')}>𝗕</button>
                <button onClick={() => handleFormat('italic')}>𝐼</button>
                <button onClick={() => handleFormat('underline')}>U̲</button>
                <button onClick={() => handleFormat('strikeThrough')}>Strike</button>
                <button onClick={() => handleFormat('justifyLeft')}>Left</button>
                <button onClick={() => handleFormat('justifyCenter')}>Center</button>
                <button onClick={() => handleFormat('justifyRight')}>Right</button>
                <button onClick={() => handleFormat('justifyFull')}>Justify</button>
                <button onClick={() => handleFormat('indent')}>Indent</button>
                <button onClick={() => handleFormat('outdent')}>Outdent</button>
                <button onClick={() => handleFormat('insertUnorderedList')}>Bulleted List</button>
                <button onClick={() => handleFormat('insertOrderedList')}>Numbered List</button>
                <button onClick={() => uploadTable()}>Table</button>
                <select onChange={(e) => handleFormat('fontName', e.target.value)}>
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                </select>
                <input type="number" min="1" value={fontSize} onChange={handleFontSizeChange} style={{ width: '45px' }} />
                <label htmlFor="favcolor">Font </label>
                <input type="color" value={fontColor} onChange={(e) => handleFontColorChange(e.target.value)} name={"favcolor"} />
                <label htmlFor="bg">Background </label>
                <input type="color" value={bgColor} onChange={(e) => handleBgColorChange(e.target.value)} name={"bg"} />
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} />

                <button onClick={() => download()}>Download Doc</button>
                <button onClick={() => uploadHTML()}>Upload Doc</button>
                <button onClick={() => loadCache()}>Load Cached</button>
                <button onClick={() => handleImageResize(contentRef.current.querySelector('img'))}>Resize Image</button>
            </div>
            <>
                <div className='PageContainer'>
                    <div
                        contentEditable={true}
                        ref={contentRef}
                        style={{
                            border: '1px solid #ccc',
                            padding: '5px',
                            aspectRatio: '8.5 / 11',
                            width: '110%',
                            margin: '20px',
                            backgroundColor: bgColor,
                            color: fontColor,
                            fontSize: `${fontSize}px`,
                            display: 'none'
                        }}
                    />
                    <Page ref={ref} bgColor={bgColor} fontColor={fontColor} fontSize={fontSize} />
                </div>
            </>
        </>
    );

})

Document.displayName = 'Document';
export default Document;
