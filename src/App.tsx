import React from 'react';
import './style/App.css';
import Languages from './Languages';
import AlertMessages from './AlertMessages';
import { IMyAlertParameter, MyAlert } from './MyAlert';
import { Button, Container, FormControl, InputLabel, ListSubheader, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';

interface IAppState {
  alert_message: IMyAlertParameter,
  start_button: { label: string, enabled: boolean },
  is_recognizing: boolean,
  ignore_onend_event: boolean,
  start_timestamp: number,
  language: string,
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
      language: 'yue-Hant-HK'
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

    };


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
          <Paper variant="outlined" sx={{ m: 0, p: 1.5, whiteSpace: 'nowrap', minHeight: '100px' }} contentEditable>
            Hi
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
    );
  }
};
