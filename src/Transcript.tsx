import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { ITranscript } from "./Algorithm";

export default class Transcript extends React.Component<{ data: ITranscript, is_final: boolean }, { data: ITranscript }> {
    // contentEditable: React.RefObject<HTMLElement>;
    // mydata: ITranscript;

    constructor(props: { data: ITranscript, is_final: boolean }) {
        super(props);
        this.state = {
            data: props.data,
        };
        // this.mydata = useRef(this.props.data);
        // this.contentEditable = React.createRef();
        
    }

    doOnInput = (event: ContentEditableEvent) => {
        console.log("rrr");
        // this.setState((prevState: { data: ITranscript }) => {
        //     let data = prevState.data;
        //     data.selected = "Hello";
        //     console.log("ddd " + event.target.value);
        //     return { data };
        // });
    }
    
    render = (): React.ReactNode => {
        const using_classes = 'transcript ' + (this.props.is_final ? '' : 'interim');
        return (
            <span id={this.props.data.uuid} className={using_classes} onChange={this.doOnInput}>{this.props.data.selected}</span>    
            // <ContentEditable
            //     className={using_classes}
            //     innerRef={this.contentEditable}
            //     html={this.state.data.selected}
            //     disabled={false}
            //     onChange={console.log}
            // />
            );
    }
};

// class MyComponent extends React.Component {
//     constructor() {
//       super()
//       this.contentEditable = React.createRef();
//       this.state = {html: "<b>Hello <i>World</i></b>"};
//     };
  
//     handleChange = evt => {
//       this.setState({html: evt.target.value});
//     };
  
//     render = () => {
//       return <ContentEditable
//                 innerRef={this.contentEditable}
//                 html={this.state.html} // innerHTML of the editable div
//                 disabled={false}       // use true to disable editing
//                 onChange={this.handleChange} // handle innerHTML change
//                 tagName='article' // Use a custom HTML tag (uses a div by default)
//               />
//     };
//   };