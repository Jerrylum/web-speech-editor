export default {
    "start": {
        message: '點擊「按下開始」然後說話',
        severity: 'success'
    },
    "speak_now": {
        message: '請說話',
        severity: 'success'
    },
    "no_speech": {
        message: '未檢測到語音。 您可能需要調整<a href="//support.google.com/chrome/answer/2693767" target="_blank">麥克風設置</a>。',
        severity: 'warning'
    },
    "no_microphone": {
        message: '未找到麥克風。 確保已安裝麥克風並且正確配置<a href="//support.google.com/chrome/answer/2693767" target="_blank">麥克風設置。</a>',
        severity: 'warning'
    },
    "allow": {
        message: '單擊上方的「允許」按鈕以啟用您的麥克風',
        severity: 'warning'
    },
    "denied": {
        message: '使用麥克風的權限被拒絕',
        severity: 'warning'
    },
    "blocked": {
        message: '使用麥克風的權限被阻止。要更改，請訪問 chrome://settings/content/microphone',
        severity: 'warning'
    },
    "upgrade": {
        message: '此瀏覽器不支持 Web Speech API。 只有桌面和 Android 移動設備上的 <a href="//www.google.com/chrome">Chrome</a> 版本 25 或更高版本支持。',
        severity: 'warning'
    },
    "stop": {
        message: '停止收聽，點擊「按下開始」重啟',
        severity: 'success'
    },
    "copy": {
        message: '內容成功複製到剪貼板',
        severity: 'success'
    },
}