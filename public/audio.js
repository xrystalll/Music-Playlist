$(document).ready(_ => {
    console.log('%cxrystalll'+'%chttps://behance.net/xrystalll', 'background:#2c2e35;color:#fff;padding:4px', 'background:#2c2e35;color:#F44336;padding:4px');
    const player = new Audio;
    const db = new Firebase('https://godb-xlll.firebaseio.com/');
    const storage = db.child('music');
    const get = new URLSearchParams(window.location.search);
    const list = [];
    $('.control').each(function(i, v) {
        list.push($(this).data('src'))
    });
    let index = 0;

    const loadData = () => {
        $.ajax({
            type: 'GET',
            url: 'https://godb-xlll.firebaseio.com/music.json',
            async: false, // important
            success: function(data) {
                $.each(data, (i, v) => {
                    let track = encodeURI(data[i].url),
                        artist = data[i].artist.replace(/(<([^>]+)>)/ig, ''),
                        title = data[i].title.replace(/(<([^>]+)>)/ig, ''),
                        cover = data[i].cover ? ' style="background-image: url(' + encodeURI(data[i].cover) + ');" ' : '',
                        action = get.has('del') ? `
                            <span class="del" data-key="${i}">
                                <i class="material-icons">delete</i>
                            </span>` : '',
                        item = `
                            <div class="audio" data-key="${i}">
                                <div class="audio-side">
                                    <div class="audio-btn"${cover}>
                                        <div class="control" data-src="${track}"></div>
                                    </div>
                                </div>
                                <div class="audio-text">
                                    <span class="artist">${artist}</span>
                                    <span class="title">${title}</span>
                                </div>
                                <div class="audio-menu">
                                    <a href="${track}" class="download" download>
                                        <i class="material-icons">get_app</i>
                                    </a>
                                    ${action}
                                </div>
                            </div>`;

                    list.indexOf(data[i].url) === -1 && (
                        list.push(data[i].url),
                        $('.playlist').append(item)
                    )
                })
            }
        })
    };
    loadData();

    const findCover = (artist, title) => {
        let key = 'f527eecbaa6cb9c028502e7a9b8d6a0a';
        $.get(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${key}&artist=${artist}&track=${title}&format=json`).done(function(data) {
            $.each(data, (i, v) => {
                data.error === '6' || data[i].album === undefined && (
                    $('#result').text('Album cover not found. Try to enter manually')
                );
                let finded = Object.values(data[i].album.image[3])
                finded[0].length != 0 ? (
                    $('#add_cover').val(finded[0])
                ) : $('#result').text('Album cover not found. Try to enter manually')
            })
        })
    };

    const openModal = () => {
        $('.overlay, .modal').addClass('active'),
        $('body').css('overflow', 'hidden')
    };

    const closeModal = () => {
        $('.overlay, .modal').removeClass('active'),
        $('body').css('overflow', 'auto'),
        $('#result').text('')
    };

    const capitalize = (str) => str.split(' ').map((l) => {
        if (l.length < 1 ) {
            return ''
        } else {
            let firstLetter = l[0].toUpperCase(),
                restOfStr = l.substring(1).toLowerCase();
            return firstLetter + restOfStr;
        }
    }).join(' ');

    const checkUrl = (url) => url.match(/\.(mp3|wav|ogg|flac)$/) != null;

    const checkImg = (url) => url.match(/\.(jpeg|jpg|png)|(1000x1000)$/) != null;

    const del = (key) => storage.child(key).remove();

    const round = (length) => {
        min = isNaN(parseInt(length / 60, 10)) ? '0' : parseInt(length / 60, 10);
        s = isNaN(parseInt(length % 60)) ? '0' : parseInt(length % 60);
        sec = s < 10 ? '0' + s : s;
        return `${min}:${sec}`
    };

    const meta = (title, artist, cover) => {
        navigator.mediaSession.metadata = new MediaMetadata({
            title,
            artist,
            // album: '',
            artwork: [{src: cover}]
        }),
        $('title').text(`${artist} - ${title}`),
        $('.artist_meta').text(artist),
        $('.song_meta').text(title),
        $('.cover_meta').css('background-image', `url(${cover})`),
        $('.cover_full').attr('src', cover),
        $('.player .audio').addClass('modal_btn song_modal')
    };

    const playPause = (index, initial = index) => {
        let curSrc = player.currentSrc.replace(/.+[\\\/]/, ''),
            dataSrc = encodeURI($('.audio').eq(index).find('.control').data('src').replace(/.+[\\\/]/, ''));
        initial === index ? (
            player.paused ? (
                curSrc === dataSrc ? (
                    player.play()
                ) : (
                    player.src = list[index],
                    cover = $('.audio').eq(index).find('.audio-btn').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
                    cover === 'none' && (
                        cover = 'assets/img/cover.png'
                    ),
                    player.play()
                    .then(_ => meta(
                        $('.audio').eq(index).find('.title').text(),
                        $('.audio').eq(index).find('.artist').text(),
                        cover
                    ))
                )
            ) : player.pause()
        ) : (
            $('.audio, .playbtn').removeClass('playing'),
            player.src = list[index],
            cover = $('.audio').eq(index).find('.audio-btn').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
            cover === 'none' && (
                cover = 'assets/img/cover.png'
            ),
            player.play()
            .then(_ => meta(
                $('.audio').eq(index).find('.title').text(),
                $('.audio').eq(index).find('.artist').text(),
                cover
            ))
        )
    };

    const next = () => {
        index = (index + 1) % list.length,
        player.src = list[index],
        cover = $('.audio').eq(index).find('.audio-btn').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
        cover === 'none' && (
            cover = 'assets/img/cover.png'
        ),
        player.play()
        .then(_ => meta(
            $('.audio').eq(index).find('.title').text(),
            $('.audio').eq(index).find('.artist').text(),
            cover
        )),
        $('.audio').eq((index - 1 + list.length) % list.length).removeClass('playing')
    };

    const prev = () => {
        index = (index - 1 + list.length) % list.length,
        player.src = list[index],
        cover = $('.audio').eq(index).find('.audio-btn').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
        cover === 'none' && (
            cover = 'assets/img/cover.png'
        ),
        player.play()
        .then(_ => meta(
            $('.audio').eq(index).find('.title').text(),
            $('.audio').eq(index).find('.artist').text(),
            cover
        )),
        $('.audio').eq((index + 1) % list.length).removeClass('playing')
    };

    $(document).on('click', '.playlist .audio', function() {
        let initial = index;
        index = $('.audio').index(this);
        playPause(index, initial)
    }),

    $(document).on('click', '.playbtn', () => {
        playPause(index)
    }),

    $(document).on('click', '.next', next),

    $(document).on('click', '.prev', prev),

    navigator.mediaSession.setActionHandler('nexttrack', () => next()),

    navigator.mediaSession.setActionHandler('previoustrack', () => prev()),

    player.onended = () => {
        $('.repeat').hasClass('loop') ? player.play() : next()
    },

    player.addEventListener('pause', () => {
        $('.audio, .playbtn').removeClass('playing')
    }),

    player.addEventListener('play', () => {
        $('.audio').eq(index).addClass('playing'),
        $('.playbtn').addClass('playing')
    }),

    player.addEventListener('timeupdate', () => {
        let curTime = player.currentTime,
            duration = player.duration;
        $('.progress').stop(true, true).animate({
            'width': `${(curTime + .25) / duration * 100}%`
        }, 200, 'linear'),
        $('.time').text(round(curTime)),
        $('.duration').text(round(duration))
    }),

    $(document).on('click', '.bar', function(e) {
        let offset = e.pageX - $(this).offset().left,
            duration = player.duration,
            width = $(this).width();
        duration && (
            player.currentTime = (offset / width) * duration
        )
    }),

    player.volume = '0.8',
    $('.fill').css('height', 41),
    $('.volume').on('input', function() {
        player.volume = $(this).val(),
        $('.fill').css('height', ($(this).val() * 10 * 4) + 1),
        player.volume === 0 ? (
            $('.mute').addClass('off')
        ) : (
            $('.mute').removeClass('off')
        )
    }),

    $('.mute').on('click', function() {
        $(this).toggleClass('off'),
        player.volume === 0 ? (
            $('.volume').val(0.8),
            player.volume = '0.8',
            $('.fill').css('height', 41)
        ) : (
            $('.volume').val(0),
            player.volume = '0',
            $('.fill').css('height', 1)
        )
    }),

    $(document).on('click', '.repeat', function() {
        $(this).toggleClass('loop')
    }),

    $(document).on('click', '.add_modal', () => {
        let addContent = `
            <div class="title">Adding new track</div>
            <div class="page">
                <div class="wrap-input">
                    <input id="add_artist" class="add_input" type="text" required>
                    <span class="focus-add_input" data-placeholder="Enter artist name"></span>
                </div>
                <div class="wrap-input">
                    <input id="add_title" class="add_input" type="text" required>
                    <span class="focus-add_input" data-placeholder="Enter song title"></span>
                    <span id="find_cover">
                        <i class="material-icons">search</i>
                    </span>
                </div>
                <div class="wrap-input">
                    <input id="add_url" class="add_input" type="text" required>
                    <span class="focus-add_input" data-placeholder="Enter track link"></span>
                </div>
                <div class="wrap-input">
                    <input id="add_cover" class="add_input" type="text" required>
                    <span class="focus-add_input" data-placeholder="Enter album art link"></span>
                </div>

                <input id="add" class="add_btn" type="submit" value="Add new">
                <div id="result"></div>
            </div>
        `;
        $('.modal').removeClass('player_full'),
        $('#modal_container').children('.page').length === 0 && ($('#modal_container').html(addContent));
    }),

    $(document).on('click', '.song_modal', () => {
        let songContent = `
            <div class="player-container">
                <div class="body-cover">
                    <div class="cover-full">
                        <img class="cover_full" src="assets/img/cover.png">
                    </div>

                    <div class="track_time portrait">
                        <div class="progress_full bar">
                            <div class="progress"></div>
                        </div>

                        <div class="time-holder">
                            <div class="time">0:00</div>
                            <div class="duration">0:00</div>
                        </div>
                    </div>
                </div>

                <div class="controls">
                    <div class="track_time landscape">
                        <div class="progress_full bar">
                            <div class="progress"></div>
                        </div>

                        <div class="time-holder">
                            <div class="time">0:00</div>
                            <div class="duration">0:00</div>
                        </div>
                    </div>

                    <div class="body-info">
                        <div class="audio-text">
                            <span class="artist artist_meta"></span>
                            <span class="title song_meta"></span>
                        </div>
                    </div>

                    <div class="control-side all-actions info">
                        <div class="control-side">
                            <span class="prev">
                                <i class="material-icons">skip_previous</i>
                            </span>

                            <span class="playbtn"></span>

                            <span class="next">
                                <i class="material-icons">skip_next</i>
                            </span>
                        </div>
                    </div>

                    <div class="toggles">
                        <span>
                            <a href="" class="download" download>
                                <i class="material-icons">get_app</i>
                            </a>
                        </span>

                        <span class="repeat"></span>
                    </div>
                </div>
            </div>
        `;
        $('.modal').addClass('player_full'),
        $('#modal_container').children('.player-container').length === 0 && ($('#modal_container').html(songContent));
        cover = $('.audio').eq(index).find('.audio-btn').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
        cover === 'none' && (
            cover = 'assets/img/cover.png'
        ),
        !player.paused && $('.player_full .playbtn').addClass('playing'),
        $('.player_full .artist_meta').text($('.audio').eq(index).find('.artist').text()),
        $('.player_full .song_meta').text($('.audio').eq(index).find('.title').text()),
        $('.player_full .cover_full').attr('src', cover),
        $('.player_full .download').attr('href', $('.audio').eq(index).find('.control').data('src'))
    }),

    $(document).on('click', '.modal_btn', () => {
        openModal()
    }),

    $('.close, .overlay').on('click', () => {
        closeModal()
    }),

    $(document).on('click', '#add', (e) => {
        e.preventDefault();
        let artist = capitalize($('#add_artist').val().replace(/(<([^>]+)>)/ig, '')),
            title = capitalize($('#add_title').val().replace(/(<([^>]+)>)/ig, '')),
            url = encodeURI($('#add_url').val()),
            cover = encodeURI($('#add_cover').val());

        artist ? title ? url ? checkUrl(url) ? list.indexOf(url) === -1 ? cover ? checkImg(cover) ? (
            storage.push({
                artist,
                title,
                url,
                cover
            }),
            loadData(),
            closeModal(),
            $('#track_count').text($('.playlist .audio').length),
            $('#add_artist').val(''),
            $('#add_title').val(''),
            $('#add_url').val(''),
            $('#add_cover').val(''),
            $('#result').text('')
        )
        : $('#result').text('Image format allowed: png, jpeg, jpg')
        : $('#result').text('Enter album cover link')
        : $('#result').text('This track has already added')
        : $('#result').text('Audio format allowed: mp3, wav, ogg, flac')
        : $('#result').text('Enter track link')
        : $('#result').text('Enter song title')
        : $('#result').text('Enter artist name')
    }),

    $(document).on('click', '.del', function() {
        del($(this).data('key')),
        $('.audio[data-key="' + $(this).data('key') + '"]').remove()
    }),

    $(document).on('click', '#find_cover', () => {
        let a = $('#add_artist').val(),
            t = $('#add_title').val();

        a ? t ? (
            $('#result').text(''),
            findCover(a, t)
        )
        : $('#result').text('Enter artist name and song title')
        : $('#result').text('Enter artist name and song title')
    }),

    $('.search_btn').on('click', () => {
        $('.search').toggleClass('active'),
        $('#search-input').focus()
    }),

    $(document).keyup('#search-input', () => {
        let searchTerm = $('#search-input').val();
        let searchSplit = searchTerm.replace(/ /g, ' ');
        $.extend($.expr[':'], {
            containsi: (elem, i, match) => (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0
        }),
        $('.playlist .audio').not(':containsi("' + searchSplit + '")').each(function(e) {
            $(this).addClass('notfound').removeClass('found'),
            $('.notfound').addClass('hidden')
        }),
        $('.playlist .audio:containsi("' + searchSplit + '")').each(function(e) {
            $(this).removeClass('notfound').addClass('found').removeClass('hidden'),
            $('.found').removeClass('hidden')
        }),
        $('.audio.found').length === 0 ? $('.playlist').addClass('empty') : $('.playlist').removeClass('empty');
    }),

    $('#track_count').text($('.playlist .audio').length);

    $(window).scroll(() => {
        let scroll = $(window).scrollTop();
        scroll >= 25 ? $('.player').addClass('hide') : $('.player').removeClass('hide');
        scroll + $(window).height() === $(document).height() && $('.player').removeClass('hide')
    }),
    
    $(document).keyup((e) => {
        $('.modal, .search').hasClass('active') || 32 !== e.which || playPause(index),
        39 === e.which && next(),
        37 === e.which && prev(),
        27 === e.which && closeModal()
    })
});