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
          <h2 class="song-title" @click="resetSong(current)">
            {{ current.title }} - {{ current.artist }}
          </h2>
          <div class="progress-bar">
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
        {
          title: '1. Song 1',
          artist: 'A T',
          src: '/s1.mp3'
        },
        {
          title: '2. Song 2',
          artist: 'A T',
          src: '/s2.mp3'
        },
        {
          title: '3. Song 3',
          artist: 'A T',
          src: '/s3.mp3'
        },
        {
          title: '4. Song 4',
          artist: 'M G',
          src: '/s4.mp3'
        },
        {
          title: '5. Song 5',
          artist: 'M G',
          src: '/s5.mp3'
        }
      ],
      player: new Audio()
    }
  },
  computed: {
    progress() {
      if (this.duration) {
        return (this.currentTime / this.duration) * 100
      } else {
        return 0
      }
    }
  },
  methods: {
    togglePlayback() {
      if (this.player.paused) {
        // If the audio is paused, play the song
        this.play(this.current)
      } else {
        // If the audio is playing, pause the song
        this.pause()
      }
    },
    play(song) {
      const index = this.songs.findIndex((s) => s.src === song.src)
      if (index === -1) {
        console.error('Song not found in the playlist')
        return
      }

      this.index = index // Update the index

      if (this.player.src !== song.src) {
        // Load new song
        this.current = song
        this.player.src = this.current.src
      }

      // Set the playback position to the stored current time
      this.player.currentTime = this.currentTime

      // Check if the audio is paused, then play
      if (this.player.paused) {
        // Play the song
        this.player.play()
        // Update playback status
        this.isPlaying = true
      }
    },
    pause() {
      this.player.pause()
      // Store the current playback position
      this.currentTime = this.player.currentTime
      this.isPlaying = false
    },
    next() {
      this.index = (this.index + 1) % this.songs.length
      this.current = this.songs[this.index]
      this.resetSong() // Reset song before playing the next one
    },
    prev() {
      this.index = (this.index - 1 + this.songs.length) % this.songs.length
      this.current = this.songs[this.index]
      this.resetSong() // Reset song before playing the previous one
    },
    stop() {
      this.player.pause()
      this.player.currentTime = 0 // Reset current time to 0
      this.isPlaying = false
    },
    resetSong(song) {
      if (song) {
        // If a specific song is provided, reset that song
        if (this.current.src === song.src) {
          this.player.currentTime = 0 // Reset current time to 0
          this.player.load() // Reload the audio file
          this.isPlaying = false // Set isPlaying to false
        }
      } else {
        // If no specific song is provided, reset the currently playing song
        this.player.currentTime = 0 // Reset current time to 0
        this.player.load() // Reload the audio file
        this.isPlaying = false // Set isPlaying to false
      }
    },
    updateTime() {
      this.currentTime = this.player.currentTime
      this.duration = this.player.duration
    },
    songEnded() {
      // Automatically play the next song when the current one ends
      this.next()
    },
    stopPlaybackAndResetState() {
      this.player.pause()
      this.player.currentTime = 0
      this.isPlaying = false
    }
  },
  created() {
    this.current = this.songs[0] // Set current to the first song in the playlist
    this.player.addEventListener('timeupdate', this.updateTime)
    this.player.addEventListener('ended', this.songEnded)

    // Add a navigation guard to handle route changes
    this.$router.beforeEach((to, from, next) => {
      // Stop playback and reset state when navigating away
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
.song-title span {
  font-weight: 700;
}
.controls {
  flex-direction: column;
  width: 100%;
  position: fixed;
  bottom: 5rem;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #141417;
  z-index: 1000;
}
.fa {
  font-size: 3rem;
  margin: 3rem;
  color: #fff;
}

.fa:hover,
.fa:focus {
  color: #ffd432;
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
  border: 0.2rem solid #fff;
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
  background-color: #141417;
  border: 1px solid #fff;
  color: #fff;
  padding: 0.3rem;
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
  margin: 1.8rem 0 1.8rem 0;
  padding: 1rem 0;
}
.playlist .song:hover {
  border-color: #ffd432;
  color: #ffd432;
}

.playlist .song.playing {
  background-color: #ffd432;
  color: #141417;
  border: 0.2rem #fff;
  border-radius: 0.6rem;
}

.progress-bar {
  width: 50%;
  height: 0.3rem;
  background-color: rgba(255, 212, 50, 0.5);
  margin: 1.6rem auto;
  border-radius: 0.6rem;
  --progress: 0;
}

.progress {
  height: 100%;
  background-color: #ffd432;
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
