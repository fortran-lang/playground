import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-fortran';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/ext-language_tools';

export default function Editor(props) {
	return (
		<AceEditor
			mode='fortran'
			theme={props.theme}
			onChange={props.onChange}
			name='UNIQUE_ID_OF_DIV'
			editorProps={{ $blockScrolling: true }}
			value={props.value}
			width='100%'
			height={props.height}
			readOnly={props.snippet}
			showGutter={props.gutter}
			highlightActiveLine={props.highlight}
			fontSize={14}
		/>
	);
}
