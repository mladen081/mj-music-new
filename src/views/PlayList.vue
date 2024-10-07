<template>
  <main>
    <div class="home-cont pt-128">
      <h1>Play Time</h1>
      <section class="playlist all">
        <h2>The Playlist</h2>
        <button
          v-for="song in songs"
          :key="song.src"
          @click="play(song)"
          :class="{
            song: true,
            playing: song.src === current.src && isPlaying
          }"
        >
          <span class="song-info">
            <span v-if="song.src === current.src && isPlaying" class="indicator animated">
              <i class="fa fa-music"></i>
            </span>
            {{ song.title }} - {{ song.artist }}
          </span>
        </button>
      </section>
      <section class="player">
        <div class="controls">
          <p class="song-title" @click="resetSong(current)">
            {{ current.title }} - {{ current.artist }}
            <span class="time-display">{{ formattedCurrentTime }}</span>
            <!-- <span class="time-display">/</span>
            <span class="time-display">{{ formattedDuration }}</span> -->
          </p>
          <div class="progress-bar" @click="seek">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <div>
            <i class="fa fa-angle-double-left" aria-hidden="true" @click="prev"></i>
            <i class="fa fa-play" aria-hidden="true" v-if="!isPlaying" @click="play(current)"></i>
            <i class="fa fa-pause" aria-hidden="true" v-else @click="togglePlayback"></i>
            <i class="fa fa-stop" aria-hidden="true" @click="stop"></i>
            <i class="fa fa-angle-double-right" aria-hidden="true" @click="next"></i>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      current: {},
      index: 0,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      formattedCurrentTime: '0:00',
      formattedDuration: '0:00',
      songs: [
        { title: '1. Song 1', artist: 'A T', src: '/s1.mp3' },
        { title: '2. Song 2', artist: 'A T', src: '/s2.mp3' },
        { title: '3. Song 3', artist: 'A T', src: '/s3.mp3' },
        { title: '4. Song 4', artist: 'M G', src: '/s4.mp3' },
        { title: '5. Song 5', artist: 'M G', src: '/s5.mp3' }
      ],
      player: new Audio()
    }
  },
  computed: {
    progress() {
      return this.duration ? (this.currentTime / this.duration) * 100 : 0
    }
  },
  methods: {
    formatTime(time) {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    },
    updateTime() {
      this.currentTime = this.player.currentTime
      this.duration = this.player.duration
      this.formattedCurrentTime = this.formatTime(this.currentTime)
      this.formattedDuration = this.formatTime(this.duration)
    },
    togglePlayback() {
      if (this.isPlaying) {
        this.pause()
      } else {
        this.play(this.current)
      }
    },
    play(song) {
      const index = this.songs.findIndex((s) => s.src === song.src)
      if (index === -1) {
        console.error('Song not found in the playlist')
        return
      }
      this.index = index
      if (this.player.src === song.src) {
        if (this.player.paused) {
          this.player.play()
          this.isPlaying = true
        }
      } else {
        this.current = song
        this.player.src = this.current.src
        this.player.currentTime = this.currentTime
        this.player
          .play()
          .then(() => {
            this.isPlaying = true
          })
          .catch((error) => {
            console.error('Error playing the song:', error)
          })
      }
    },
    pause() {
      this.player.pause()
      this.currentTime = this.player.currentTime
      this.isPlaying = false
    },
    next() {
      this.index = (this.index + 1) % this.songs.length
      this.current = this.songs[this.index]
      this.player.currentTime = 0
      setTimeout(() => {
        this.play(this.current)
      }, 100)
    },
    prev() {
      this.index = (this.index - 1 + this.songs.length) % this.songs.length
      this.current = this.songs[this.index]
      this.player.currentTime = 0
      this.play(this.current)
    },
    stop() {
      this.player.pause()
      this.player.currentTime = 0
      this.isPlaying = false
    },
    resetSong(song) {
      if (song) {
        if (this.current.src === song.src) {
          this.player.currentTime = 0
          this.isPlaying = false
        }
      } else {
        this.player.currentTime = 0
        this.isPlaying = false
      }
    },
    songEnded() {
      this.next()
    },
    stopPlaybackAndResetState() {
      this.player.pause()
      this.player.currentTime = 0
      this.isPlaying = false
    },
    seek(event) {
      const progressBar = event.currentTarget
      const clickPosition = event.clientX - progressBar.getBoundingClientRect().left
      const newWidth = progressBar.clientWidth
      const newTime = (clickPosition / newWidth) * this.duration
      this.player.currentTime = newTime
      this.currentTime = newTime
      if (!this.isPlaying) {
        this.player.pause()
      }
    }
  },
  created() {
    this.current = this.songs[0]
    this.player.addEventListener('timeupdate', this.updateTime)
    this.player.addEventListener('ended', this.songEnded)
    this.player.addEventListener('loadedmetadata', () => {
      this.duration = this.player.duration
    })
    this.$router.beforeEach((to, from, next) => {
      this.stopPlaybackAndResetState()
      next()
    })
  },
  beforeUnmount() {
    this.player.removeEventListener('timeupdate', this.updateTime)
    this.player.removeEventListener('ended', this.songEnded)
    this.player.pause()
    this.isPlaying = false
  }
}
</script>

<style scoped>
.song-title {
  font-weight: 200;
  color: var(--yellow-color);
  margin-bottom: 1rem;
}
.controls {
  flex-direction: column;
  width: 100%;
  position: fixed;
  bottom: 5rem;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  z-index: 1000;
}
.fa {
  font-size: 2.5rem;
  margin: 1rem 2rem;
  color: #fff;
}
.fa:hover,
.fa:focus {
  color: var(--yellow-color);
}
button {
  appearance: none;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
}
.playlist.all {
  padding: 1rem;
  border-radius: 0.6rem;
  margin: 3.6rem auto;
  width: 50%;
  height: 40vh;
  overflow-y: auto;
}
.playlist {
  padding: 0px 2rem;
}
.playlist .song {
  display: block;
  width: 100%;
  background-color: var(--primary-color);
  color: #fff;
  padding: 0.3rem;
  font-size: 1.8rem;
  font-weight: 200;
  cursor: pointer;
  margin: 1.8rem 0;
  padding: 1rem 0;
  position: relative;
}
.playlist .song.playing {
  color: var(--yellow-color);
}
.song-info {
  position: relative;
}
.indicator {
  position: absolute;
  left: -7rem; /* 10px left from the song number */
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem; /* Adjust size of the icon */
  animation: moveAnimation 2s linear infinite; /* Adjust the duration */
  color: var(--yellow-color);
}
.indicator .fa {
  color: var(--yellow-color); /* Use variable for yellow color */
}
@keyframes moveAnimation {
  0% {
    transform: translate(-5px, -50%);
  }
  50% {
    transform: translate(5px, -50%);
  }
  100% {
    transform: translate(-5px, -50%);
  }
}
.progress-bar {
  width: 50%;
  height: 0.7rem;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 1.6rem auto;
  border-radius: 0.6rem;
  cursor: pointer;
}
.progress {
  height: 100%;
  background-color: #fff;
  border-radius: 0.6rem;
  width: var(--progress);
}
.time-display {
  margin-left: 3rem;
}
@media (max-width: 767px) {
  .playlist.all,
  .progress-bar {
    width: 84%;
  }
}
</style>
