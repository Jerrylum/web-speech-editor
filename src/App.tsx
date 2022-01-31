import React from 'react';
import './style/App.css';
import Languages from './Languages';
import AlertMessages from './AlertMessages';
import { IMyAlertParameter, MyAlert } from './MyAlert';
import { Button, Container, FormControl, InputLabel, ListSubheader, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { recognition_result_to_transcripts, ITranscript } from './Algorithm';

interface IAppState {
  alert_message: IMyAlertParameter,
  start_button: { label: string, enabled: boolean },
  is_recognizing: boolean,
  ignore_onend_event: boolean,
  start_timestamp: number,
  language: string,
  final_transcripts: ITranscript[],
  interim_transcripts: ITranscript[]
}

export default class App extends React.Component<{}, IAppState> {
  recognition: SpeechRecognition | undefined;

  constructor(props: {}) {
    super(props);
    this.state = {
      alert_message: { severity: 'success', message: 'Hello.' },
      start_button: { label: 'Start', enabled: true },
      is_recognizing: false,
      ignore_onend_event: false,
      start_timestamp: 0,
      language: 'yue-Hant-HK',
      final_transcripts: [],
      interim_transcripts: [],
    };
  }

  componentDidMount() {
    if (!('webkitSpeechRecognition' in window)) {
      this.setState({
        alert_message: AlertMessages.upgrade,
        start_button: { label: 'Start', enabled: false }
      });

      return;
    }

    const recognition = this.recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 20;

    recognition.onstart = () => {
      this.setState({
        alert_message: AlertMessages.speak_now,
        is_recognizing: true,
      });
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      var alert_message: IMyAlertParameter;

      if (event.error === 'no-speech') {
        alert_message = AlertMessages.no_speech;
      } else if (event.error === 'audio-capture') {
        alert_message = AlertMessages.no_microphone;
      } else if (event.error === 'not-allowed') {
        alert_message = (event.timeStamp - this.state.start_timestamp < 100)
          ? AlertMessages.blocked
          : AlertMessages.denied;
      } else {
        return;
      }

      this.setState({ alert_message, ignore_onend_event: true });
    }

    recognition.onend = () => {
      this.setState({ is_recognizing: false });

      if (this.state.ignore_onend_event) {
        return;
      }

      // TODO check final transcript

      this.setState({ alert_message: AlertMessages.stop });

      // TODO do somthing on selection
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // let final_transcripts = prevState.final_transcripts;
      // let interim_transcripts: ITranscript[] = [];

      let editor = this.doGetEditor();
      if (!editor) return;

      editor.querySelectorAll('.transcript.interim').forEach(e => e.remove());

      let doc_transcripts = '';

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        let result = event.results[i];
        let transcript = recognition_result_to_transcripts(result);

        if (result.isFinal) console.log(transcript);

        transcript.forEach(t => doc_transcripts += `<span
            id="${t.uuid}" 
            class="transcript ${result.isFinal ? '' : 'interim'}"            
            ${t.options.size > 1 ? `transcript-options="${Array.from(t.options).join(';')}"` : ''}
            >${t.selected}</span>`);
      }

      this.doInsertHtml(doc_transcripts, editor);
    }


    document.body.addEventListener('mouseover', (event: MouseEvent) => {
      let menu = this.doGetTranscriptMenu();
      if (!menu) return;

      let target = event.target;
      if (target && target instanceof HTMLElement) {
        if (this.doMenuShow(target)) return;
      }

      if (menu.classList.contains('show') && !this.menu_dismiss_timeout) {
        this.menu_dismiss_timeout = setTimeout(this.doMenuHide, 500);
      }

    });

    document.body.addEventListener('click', (event: MouseEvent) => {
      let menu = this.doGetTranscriptMenu();
      if (!menu || !this.menu_focused_transcript) return;

      let target = event.target;
      if (target && target instanceof HTMLElement && menu.contains(target)) {
        this.menu_focused_transcript.innerText = target.innerText;
        this.doMenuHide();
      }
    });

    document.body.addEventListener('DOMCharacterDataModified', (event: Event) => {
      let e = event as MutationEvent;
      let target = (e.target as Text).parentElement;

      if (target?.matches('.transcript[transcript-options]')) {
        target.removeAttribute('transcript-options');
        this.doMenuHide();
      }
    });
  }

  menu_focused_transcript: HTMLElement | null = null;
  menu_dismiss_timeout: NodeJS.Timeout | null = null;
  doMenuShow = (target: HTMLElement) => {
    let menu = this.doGetTranscriptMenu();
    if (!menu) return;

    if (this.menu_dismiss_timeout) clearTimeout(this.menu_dismiss_timeout);
    this.menu_dismiss_timeout = null;

    if (target.matches('.transcript[transcript-options]')) {
      let pos = target.getBoundingClientRect();
      let font_size = parseInt(document.defaultView?.getComputedStyle(menu).fontSize || '') || 0;

      menu.style.left = `${pos.x - 15}px`;
      menu.style.top = `${pos.y + font_size + 10}px`;
      menu.innerHTML = '';
      menu.classList.add('show');
      this.menu_focused_transcript = target;

      target.getAttribute('transcript-options')?.split(';').forEach(o => {
        if (o == target.innerText) return;
        let option = document.createElement('div');
        // option.classList.add('transcript-option');
        option.innerText = o;
        menu?.appendChild(option);
      });

      return true;
    } else if (menu == target || menu.contains(target)) {
      return true;
    }
    return false;
  }

  doMenuHide = () => {
    this.doGetTranscriptMenu()?.classList.remove('show');
    this.menu_dismiss_timeout = null;
    this.menu_focused_transcript = null;
  }

  doGetTranscriptMenu = (): (HTMLElement | null) => {
    return document.querySelector('.transcript-menu');
  }

  doGetEditor = (): (HTMLElement | null) => {
    return document.getElementById('ref-editor');
  }

  doInsertHtml = (html: string, inside: HTMLElement): void => {
    let sel = window.getSelection && window.getSelection();
    if (!sel || !sel.rangeCount) return;

    let range = sel.getRangeAt(0);

    if (!(
      (inside.contains(range.startContainer) || inside == range.startContainer) &&
      (inside.contains(range.endContainer) || inside == range.endContainer))) return;

    range.deleteContents();

    // Range.createContextualFragment() would be useful here but is
    // non-standard and not supported in all browsers (IE9, for one)
    var el = document.createElement("div");
    el.innerHTML = html;
    var frag = document.createDocumentFragment(), node, lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);

    // Preserve the selection
    if (lastNode) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    // Jerry: not supported
    // } else if (document.selection && document.selection.type != "Control") {
    //   // IE < 9
    //   // document.selection.createRange().pasteHTML(html);
    // }
  }

  doActionButton = () => {
    // this.setState({ alert_message: AlertMessages.allow }); // testing
    if (!this.recognition) return;

    if (this.state.is_recognizing) {
      this.recognition.stop();
      return;
    }

    // TODO setup env
    this.doGetEditor()?.focus();

    this.recognition.lang = this.state.language;
    this.recognition.start();

    this.setState({
      alert_message: AlertMessages.allow,
      start_timestamp: Date.now(),
      ignore_onend_event: false,
    });
  }

  doOnLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (this.recognition)
      this.recognition.lang = event.target.value;
  }

  render(): React.ReactNode {
    const default_language = this.state.language;

    const option_paper = (
      <Paper elevation={2} sx={{ mt: 4, p: 4 }}>
        <FormControl sx={{ m: 0, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-select">Language</InputLabel>
          <Select defaultValue={default_language} id="grouped-select" label="Grouping" sx={{ minWidth: 200 }}>
            {Languages.map((item, idx) => item.length > 2
              ? [
                <ListSubheader key={idx}>{item[0]}</ListSubheader>,
                ...item.slice(1).map(subitem => <MenuItem key={subitem[0]} value={subitem[0]}>{'> ' + subitem[1]}</MenuItem>)
              ]
              : (<MenuItem key={item[1] as string} value={item[1]}>{item[0]}</MenuItem>))}
          </Select>
        </FormControl>
      </Paper>
    );

    return (
      <>
        <Container maxWidth="sm" sx={{ pt: 4 }}>
          <MyAlert data={this.state.alert_message} />
          <Paper elevation={2} sx={{ mt: 4, p: 4 }}>
            <Paper variant="outlined" className="Editor" id="ref-editor" sx={{ m: 0, p: 1.5, minHeight: '100px' }} contentEditable>
            </Paper>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined">copy</Button>
              {this.state.start_button.enabled
                ? <Button
                  variant="outlined"
                  color={this.state.is_recognizing ? "success" : "primary"}
                  onClick={this.doActionButton}>
                  {this.state.is_recognizing ? 'end' : 'start'}
                </Button>
                : null}
            </Stack>
          </Paper>
          {option_paper}
        </Container>
      </>
    );
  }
};
