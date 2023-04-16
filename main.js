const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

let index;

let loop = true;

const songList = [
  {
    name: "Tanımadığım Ten",
    link: "./assets/ahmet-aslan-tanimadigim-ten.mp3",
    artist: "Ahmet Aslan",
    image: "./assets/ahmet-aslan.jpg",
  },
  {
    name: "Anlatmam Derdimi",
    link: "./assets/altin-gun-anlatmam-derdimi.mp3",
    artist: "Altın Gün",
    image: "./assets/altin-gun.jpg",
  },
  {
    name: "Astrakan Cafe",
    link: "./assets/anouar-brahem-astrakan-cafe.mp3",
    artist: "Anouar Brahem",
    image: "./assets/anouar-brahem.jpg",
  },
  {
    name: "İnsan İnsan",
    link: "./assets/fazil-say-insan-insan.mp3",
    artist: "Fazıl Say",
    image: "./assets/fazil-say.jpg",
  },
  {
    name: "Day One",
    link: "./assets/hans-zimmer-day-one.mp3",
    artist: "Hans Zimmer",
    image: "./assets/hans-zimmer.jpg",
  },
  {
    name: "So Far",
    link: "./assets/olafur-arnalds-so-far.mp3",
    artist: "Olafur Arnalds",
    image: "./assets/olafur-arnalds.jpg",
  },
];

let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

const setSong = (arrayIndex) => {
  console.log(arrayIndex);
  console.log(songList[arrayIndex]);

  audio.src = songList[arrayIndex].link;
  songName.innerHTML = songList[arrayIndex].name;
  songArtist.innerHTML = songList[arrayIndex].artist;
  songImage.src = songList[arrayIndex].image;

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };
  playListContainer.classList.add("hide");
  playAudio();
};

const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
    console.log("Loop is OFF");
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
    console.log("Loop is ON");
  }
});

const nextSong = () => {
  if (loop) {
    if (index == songList.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
    playAudio();
  } else {
    let randIndex = Math.floor(Math.random() * songList.length);
    console.log(randIndex);
    setSong(randIndex);
    playAudio();
  }
};

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songList.length - 1;
  }
  setSong(index);
  playAudio();
};

audio.onended = () => {
  nextSong();
};

shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("Shuffle is OFF");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("Shuffle is ON");
  }
});

playButton.addEventListener("click", playAudio);

nextButton.addEventListener("click", nextSong);

pauseButton.addEventListener("click", pauseAudio);

prevButton.addEventListener("click", previousSong);

isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;

  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progress * 100 + "%";

  audio.currentTime = progress * audio.duration;

  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

const initializePlaylist = () => {
  for (let i in songList) {
    playListSongs.innerHTML += `<li class="playListSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
            ${songList[i].name}
            </span>
            <span id="playlist-song-artist-album">
            ${songList[i].artist}
            </span>
        </div>
        </li>`;
  }
};

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

window.onload = () => {
  index = 0;
  setSong(index);
  //   pauseAudio();

  initializePlaylist();
};
