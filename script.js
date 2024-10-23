let currentsong = new Audio();//to track the play song//
const seekbar = document.getElementsByClassName('seekbar');
const durationDisplay = document.getElementsByClassName('songtime');
let currentSongIndex = 0;
let songs;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs")
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}
const playMusic = (track, pause = false) => {
    //let audio = new Audio("/songs/" + track)//
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    if (currentsong) (currentsong.pause()
    )
    currentsong = new Audio("/songs/" + track);//load the new song//
    currentsong.play();//play the new song//
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = `00:00/00:00`
}
async function main() {

    let songs = await getsongs()
    playMusic(songs[0], true)
    console.log(songs)
    let songul = document.querySelector(".songlist");//acess the ul insonglist directly//
    songul.innerHTML = '';
    songs.forEach((song) => {
        let li = document.createElement('li');
        li.innerHTML = ` <div class="info ">
                                <img class="invert" src="music.svg" alt="">
                                <span>${song.replaceAll("%20", " ")}</span>
                                <span class = "artist"> pankaj </span>
                               
                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>`
        li.addEventListener("click", () => {
            console.log(`playing song ${song}`)
            playMusic(song)
        });
        songul.appendChild(li);


    });
    //attach an songs in play pause mode //
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "/play.svg"
        }
    })
    //listen for time update//
    //currentsong.addEventListener("timeupdate",() => {
    //  console.log(currentsong.currentTime,currentsong.currentsong.duration)
    // document.querySelector(".songtime").innerHTML = `${secondsTOMinuteseconds(currentsong.currentTime)}:${secondsTOMinuteseconds(currentsong.duration)}`;
    //document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration)*100+"%";


    // Update seekbar and duration display
    currentsong.addEventListener('timeupdate', () => {
        const currentTime = formatTime(currentsong.currentTime);
        const duration = formatTime(currentsong.duration);
        durationDisplay.textContent = `${currentTime} / ${duration}`;
        seekbar.value = (currentsong.currentTime / currentsong.duration) * 100;

    });
    //seekbar interaction//
    currentsong.addEventListener('input', () => {
        const seekTo = (seekbar.value / 100) * currentsong.duration;
        currentsong.currentTime = seekTo;
    });
    // Metadata loaded (e.g., duration is known)
    currentsong.addEventListener('loadedmetadata', () => {
        const duration = formatTime(currentsong.duration);
        durationDisplay.textContent = `00:00 / ${duration}`;
    });
    // Next and Previous buttons (basic implementation)
    document.getElementById('next').addEventListener('click', () => {
        currentsong.currentTime += 10;  // Move forward 10 seconds
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentsong.currentTime -= 10;  // Move backward 10 seconds
    });
    //add eventlistner for hamburger
    document.addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //add eventlistner for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    //add a next song to click the previous button
    document.getElementById("prev").addEventListener("click", () => {
        currentsong.pause()
        console.log("previous song chal raha hai")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) > -0) {
            playMusic(songs[index - 1])
        }

    })
    //add a next song to click the next button
    document.getElementById("next").addEventListener("click", () => {
        currentsong.pause()
        console.log("next song chal raha hai")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })
    //add event to the volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("volume set ho rahi hai ", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100

    })
    //add a mute icons in volume button
    document.querySelector(".volume img").addEventListener("click", e => {
        const volumeicon=e.target
        const rangeinput = document.querySelector(".range input")

        if (volumeicon.src.includes("volume.svg")) {
            volumeicon.src = volumeicon.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            rangeinput.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value =0;

        }
        else {
            volumeicon.src = volumeicon.src.replace("mute.svg", "volume.svg")
            currentsong.volume = 0.1;
            rangeinput.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0] = 0;
        }
    })





}
main()




