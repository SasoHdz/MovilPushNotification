import { Plugins } from '@capacitor/core';
const { Http } = Plugins;

Http.startServer({
  'www_root': '',
  'port': 8080,
  'localhost_only': false
}).then(function(response) {
  console.log('Server is live at ' + response.url);
}).catch(function(error) {
  console.error('Failed to start server: ' + error);
});


