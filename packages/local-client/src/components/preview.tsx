import './preview.css';
import React, { useRef, useEffect } from "react";

interface PreviewProps {
  code: string | undefined;
  err: string | undefined;
}

const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>html { background-color: white;}</style>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code Output Sandbox</title>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (err) => {
          const root = document.getElementById('root');
          root.innerHTML = '<div style="color: red"><h2>' + err.name + ':</h2>' + err.message + '</div>';
          console.error(err);
        };
        window.addEventListener('error', (e) => {
          e.preventDefault();
          handleError(e.error);
        })
        window.addEventListener('message', (event) => {
          try { 
            eval(event.data)
          } catch (err) {
            handleError(err);
          }
        }, false);
      </script>
    </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*')
    }, 50)
  }, [code])

  return (
    
    <div className="preview-wrapper">
      <iframe 
        ref={iframe} 
        title="preview" 
        sandbox="allow-scripts" 
        srcDoc={html} 
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  )
};

export default Preview;
