import React, { useState } from 'react';
import { ParagraphElement, PropertiesChangeProps } from '@Src/types';
// import { StyledTextField } from '@Components/styledComponents';
// import { useDebouncedInputChange } from '@Utils/debounceHooks';
// import RichTextEditor from 'react-rte';

// import SunEditor from 'suneditor-react';
import RichTextEditor from 'react-rte';

const TextContent: React.FC<PropertiesChangeProps<ParagraphElement>> = ({
  element,
  // updateParams,
  // canEdit,
}) => {
  const { textContent } = element.parameters;

  // const [state, handleChange] = useDebouncedInputChange(textContent, (value) =>
  //   updateParams({ textContent: value }),
  // );

  const [value, setValue] = useState(
    textContent
      ? RichTextEditor.createValueFromString(textContent, 'html')
      : RichTextEditor.createEmptyValue(),
  );
  // const handleChange = (value) => {
  //   const text = value.toString('html');
  //   updateParams({ textContent: text });
  //   // setValue(text);
  // };
  if (element.children && element.children.length) {
    return <span>Text content not allowed</span>;
  }
  console.log(setValue);
  return (
    <RichTextEditor value={value} />

    // <StyledTextField
    //   value={state || ''}
    //   variant="outlined"
    // onChange={handleChange}
    //   label="Text Content"
    //   margin="dense"
    //   fullWidth
    //   multiline
    //   disabled={!canEdit}
    // />
  );
};

export default TextContent;
// <SunEditor
//   setContents={state}
//   onChange={handleChange}
//   // setDefaultStyle="font-size: 10px;"
//   setOptions={{
//     height: '200px',
//     buttonList: [
//       [
//         'bold',
//         'underline',
//         'italic',
//         'strike',
//         'subscript',
//         'superscript',
//         // 'fontSize',
//         'align',
//       ],
//     ],
//   }}
// />
