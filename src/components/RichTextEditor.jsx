import { useRef, useEffect, useState } from 'react';
import './RichTextEditor.css';

function RichTextEditor() {
    const contentRef = useRef(null);
    const [fontSize, setFontSize] = useState(16);
    const [fontColor, setFontColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg');
                handleFormat('insertImage', dataUrl);
            };
        };
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (contentRef.current.innerHTML === '') {
            handleFormat('justifyLeft');
        }

        // TODO: add a listener for keyboard shortcuts

    }, []);

    return (
        <>
            <div className='Header'>
                <button onClick={() => handleFormat('bold')}>Bold</button>
                <button onClick={() => handleFormat('italic')}>Italic</button>
                <button onClick={() => handleFormat('underline')}>Underline</button>
                <button onClick={() => handleFormat('strikeThrough')}>Strike</button>
                <button onClick={() => handleFormat('justifyLeft')}>Left</button>
                <button onClick={() => handleFormat('justifyCenter')}>Center</button>
                <button onClick={() => handleFormat('justifyRight')}>Right</button>
                <button onClick={() => handleFormat('justifyFull')}>Justify</button>
                <button onClick={() => handleFormat('indent')}>Indent</button>
                <button onClick={() => handleFormat('outdent')}>Outdent</button>
                <button onClick={() => handleFormat('insertUnorderedList')}>Bulleted List</button>
                <button onClick={() => handleFormat('insertOrderedList')}>Numbered List</button>
                <select onChange={(e) => handleFormat('fontName', e.target.value)}>
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                </select>
                <input type="number" min="1" value={fontSize} onChange={handleFontSizeChange} style={{ width: '45px' }} />
                <input type="color" value={fontColor} onChange={(e) => handleFontColorChange(e.target.value)} />
                <input type="color" value={bgColor} onChange={(e) => handleBgColorChange(e.target.value)} />
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} />




            </div>
            <div className='PageContainer'>
                <div
                    contentEditable={true}
                    ref={contentRef}
                    style={{
                        border: '1px solid #ccc',
                        minHeight: '100px',
                        padding: '5px',
                        aspectRatio: '8.5 / 11',
                        width: '70%',
                        backgroundColor: bgColor,
                        color: fontColor,
                        fontSize: `${fontSize}px`,
                    }}
                />
            </div>
        </>
    );
}

export default RichTextEditor;
