# Music-Playlist
![Music-Playlist](/screenshot.png)

Creation and installation of the Firebase
- Go to https://console.firebase.google.com and create project
- Set read and write permissions:

```json
{
    "rules": {
        ".read": true,
        ".write": true
    }
}
```


- In file /public/audio.js on the fourth line insert your ID of the created database, eg:

```javascript
const dbname = 'your_db_id';
```


Use
- New tracks are added through the form when you click on the plus icon "+"


You can add more tracks in other ways, for example just registering html markup directly in the file /index.html.

eg:

```html
<div class="audio">
    <div class="audio-side">
        <div class="audio-btn" style="background-image: url('IMAGE URL')">
            <div class="control" data-src="AUDIO FILE URL"></div>
        </div>
    </div>
    <div class="audio-text">
        <span class="artist">AUTHOR NAME</span>
        <span class="title">SONG TITLE</span>
    </div>
    <div class="audio-menu">
        <a href="AUDIO FILE URL FOR DOWNLOAD" class="download" download>
            <i class="material-icons">get_app</i>
        </a>
    </div>
</div>
```


- Delete added tracks can be added to the address bar to your URL this value:

`?del`

eg: http://localhost:8080?del
