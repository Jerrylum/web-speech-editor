import React from 'react';
import './App.css';
import Languages from './Languages';
import AlertMessages from './AlertMessages';
import { IMyAlertParameter, MyAlert } from './MyAlert';
import { Button, Container, FormControl, InputLabel, ListSubheader, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';

interface IAppState {
  alert_message: IMyAlertParameter
}

export default class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      alert_message: { severity: 'success', message: 'Hello.' }
    };

  }

  doActionButton = () => {
    this.setState({ alert_message: AlertMessages.allow }); // testing
  }

  render(): React.ReactNode {
    return (
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <MyAlert data={this.state.alert_message} />
        <Paper elevation={2} sx={{ mt: 4, p: 4 }}>
          <Paper variant="outlined" sx={{ m: 0, p: 1.5, whiteSpace: 'nowrap', minHeight: '100px' }} contentEditable>
            Hi
          </Paper>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined">copy</Button>
            <Button variant="outlined" onClick={this.doActionButton}>start</Button>
          </Stack>
        </Paper>
        <Paper elevation={2} sx={{ mt: 4, p: 4 }}>
          <FormControl sx={{ m: 0, minWidth: 120 }}>
            <InputLabel htmlFor="grouped-select">Language</InputLabel>
            <Select defaultValue={'yue-Hant-HK'} id="grouped-select" label="Grouping" sx={{ minWidth: 200 }}>
              {Languages.map((item, idx) => item.length > 2
                ? [
                  <ListSubheader key={idx}>{item[0]}</ListSubheader>,
                  ...item.slice(1).map(subitem => <MenuItem key={subitem[0]} value={subitem[0]}>{'> ' + subitem[1]}</MenuItem>)
                ]
                : (<MenuItem key={item[1] as string} value={item[1]}>{item[0]}</MenuItem>))}
            </Select>
          </FormControl>
        </Paper>
      </Container>
    );
  }
};
