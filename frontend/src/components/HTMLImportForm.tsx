import React from 'react';

const HtmlImportForm = () => {
  return (
    <div>
      file
      <form
        onDrop={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          console.log(ev.dataTransfer.files);
        }}
      >
        <input
          accept="text/html"
          type="file"
          onChange={async (ev) => {
            const { files } = ev.target;
            if (files) {
              const content = await files[0].text();
              console.log(content);
            }
          }}
        />
      </form>
    </div>
  );
};

export default HtmlImportForm;
