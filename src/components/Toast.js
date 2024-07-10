import { useRef } from 'react';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

function Toast() {

    const editorRef = useRef();

    const onChange = () => {
        const data = editorRef.current.getInstance().getHTML();
        console.log(data);
      };

    return (
        <div className="edit_wrap">
        <Editor
          initialValue="hello react editor world!"
          previewStyle="vertical"
          height="600px"
          initialEditType="wysiwyg"
          useCommandShortcut={false}
          language="ko-KR"
          ref={editorRef}
          onChange={onChange}
          plugins={[colorSyntax]}
        />
      </div>
    );
  }
  
  export default Toast;