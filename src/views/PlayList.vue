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
            'song playing': song.src === current.src && isPlaying,
            song: true
          }"
        >
          {{ song.title }} - {{ song.artist }}
        </button>
      </section>
      <section class="player">
        <div class="controls">
          <p class="song-title" @click="resetSong(current)">
            {{ current.title }} - {{ current.artist }}
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
      // If the song is already loaded
      if (this.player.src === song.src) {
        if (this.player.paused) {
          this.player.play()
          this.isPlaying = true
        }
      } else {
        // Load a new song
        this.current = song
        this.player.src = this.current.src
        this.player.currentTime = this.currentTime // Keep the current time if resuming
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
      this.currentTime = this.player.currentTime // Save the current time
      this.isPlaying = false
    },
    next() {
      this.index = (this.index + 1) % this.songs.length // Move to the next song
      this.current = this.songs[this.index] // Update current song
      this.player.currentTime = 0 // Reset the current time to 0
      // Short timeout to ensure proper playback
      setTimeout(() => {
        this.play(this.current) // Play the current song
      }, 100) // 100ms delay
    },
    prev() {
      this.index = (this.index - 1 + this.songs.length) % this.songs.length // Move to the previous song
      this.current = this.songs[this.index] // Update current song
      this.player.currentTime = 0 // Reset the current time to 0
      this.play(this.current) // Play the previous song
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
    updateTime() {
      this.currentTime = this.player.currentTime
      this.duration = this.player.duration
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
  /* border: 0.2rem solid #fff; */
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
  /* border: 1px solid #fff; */
  color: #fff;
  padding: 0.3rem;
  font-size: 1.8rem;
  font-weight: 200;
  cursor: pointer;
  margin: 1.8rem 0 1.8rem 0;
  padding: 1rem 0;
}
.playlist .song:hover {
  border-color: var(--yellow-color);
  color: var(--yellow-color);
}

.playlist .song.playing {
  background-color: var(--yellow-color);
  color: var(--primary-color);
  border: 0.2rem #fff;
  border-radius: 0.6rem;
}

.progress-bar {
  width: 50%;
  height: 0.7rem;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 1.6rem auto;
  border-radius: 0.6rem;
  --progress: 0;
  cursor: pointer;
}

.progress {
  height: 100%;
  background-color: #fff;
  border-radius: 0.6rem;
  width: var(--progress);
}

@media (max-width: 767px) {
  .playlist.all,
  .progress-bar {
    width: 84%;
  }
}
</style>
