import { IMyAlertParameter } from './MyAlert';

export default {
    "start": {
        message: 'Click on the microphone icon and begin speaking.',
        severity: 'success'
    },
    "speak_now": {
        message: 'Speak now.',
        severity: 'success'
    },
    "no_speech": {
        message: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a>.',
        severity: 'warning'
    },
    "no_microphone": {
        message: 'No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a> are configured correctly.',
        severity: 'warning'
    },
    "allow": {
        message: 'Click the "Allow" button above to enable your microphone.',
        severity: 'warning'
    },
    "denied": {
        message: 'Permission to use microphone was denied.',
        severity: 'warning'
    },
    "blocked": {
        message: 'Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone',
        severity: 'warning'
    },
    "upgrade": {
        message: 'Web Speech API is not supported by this browser. It is only supported by <a href="//www.google.com/chrome">Chrome</a> version 25 or later on desktop and Android mobile.',
        severity: 'warning'
    },
    "stop": {
        message: 'Stop listening, click on the microphone icon to restart',
        severity: 'success'
    },
    "copy": {
        message: 'Content copy to clipboard successfully.',
        severity: 'success'
    },
}