import React from 'react';
import './style/App.css';
import Languages from './Languages';
import AlertMessages from './AlertMessages';
import { IMyAlertParameter, MyAlert } from './MyAlert';
import { Button, Container, FormControl, InputLabel, ListSubheader, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { recognition_result_to_transcripts, ITranscript } from './Algorithm';
import Transcript from './Transcript';

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
  editor: React.RefObject<HTMLDivElement>;
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
    this.editor = React.createRef();
  }

  componentDidMount() {
    if (!('webkitSpeechRecognition' in window)) {
      this.setState({
        alert_message: AlertMessages.upgrade,
        start_button: { label: 'Start', enabled: false }
      });

      return;
    }

    this.editor.current?.addEventListener('DOMSubtreeModified', (e) => {
      if (!(e instanceof MutationEvent)) return;

      let mevent = e as MutationEvent;
      
      let mtarget = (mevent.target as HTMLElement).parentNode as HTMLElement;
      if (mtarget.tagName == 'DIV') {
        var ggg = mtarget.querySelector('div');
        if (ggg)
          console.log(ggg.childNodes.length, mtarget.tagName);
      }

      if (!mtarget.classList.contains('transcript')) return;

      // {
      //   let final_transcripts = this.state.final_transcripts;
      //   let interim_transcripts = this.state.interim_transcripts;
      //   let uuid = mtarget.id;
      //   let selected = mtarget.innerText;
      //   let options = new Set<string>();
      //   let found = false;
      //   for (let i = 0; i < final_transcripts.length; i++) {
      //     if (final_transcripts[i].uuid === uuid) {
      //       final_transcripts[i].selected = selected;
      //       found = true;
      //       break;
      //     }
      //   }
      //   if (!found) {
      //     for (let i = 0; i < interim_transcripts.length; i++) {
      //       if (interim_transcripts[i].uuid === uuid) {
      //         interim_transcripts[i].selected = selected;
      //         found = true;
      //         break;
      //       }
      //     }
      //   }
      // }

      // mtarget.innerText = "ddd";

      console.log('dddd');
    });

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
      this.setState((prevState) => {
        let final_transcripts = prevState.final_transcripts;
        let interim_transcripts: ITranscript[] = [];

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          let result = event.results[i];
          let transcript = recognition_result_to_transcripts(result);

          if (result.isFinal) {
            final_transcripts = final_transcripts.concat(transcript);
            console.log(final_transcripts);
          } else {
            interim_transcripts = interim_transcripts.concat(transcript);
          }
        }

        return {final_transcripts, interim_transcripts};
      });
    }


  }

  doActionButton = () => {
    // this.setState({ alert_message: AlertMessages.allow }); // testing
    if (!this.recognition) return;

    if (this.state.is_recognizing) {
      this.recognition.stop();
      return;
    }

    // TODO setup env

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
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <MyAlert data={this.state.alert_message} />
        <Paper elevation={2} sx={{ mt: 4, p: 4 }}>
          <div ref={this.editor}>
            <Paper variant="outlined" className="Editor" sx={{ m: 0, p: 1.5, minHeight: '100px' }} contentEditable>
              { this.state.final_transcripts.map(item => <Transcript data={item} is_final={true}/>) }
              { this.state.interim_transcripts.map(item => <Transcript data={item} is_final={false}/>) }
            </Paper>
          </div>
          
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
    );
  }
};
