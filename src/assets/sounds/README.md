# SerenityEcho - Default Sounds

This folder should contain royalty-free ambient sound files for the default sound library.

## Required Sound Files

Place the following audio files (MP3, WAV, or OGG format) in this directory:

- `rain.mp3` - Rain sound effect (🌧️)
- `thunder.mp3` - Thunder sound effect (⚡)
- `wind.mp3` - Wind sound effect (💨)
- `ocean.mp3` - Ocean waves sound effect (🌊)
- `forest.mp3` - Forest ambience sound effect (🌲)
- `fireplace.mp3` - Fireplace crackling sound effect (🔥)
- `whitenoise.mp3` - White noise sound effect (📻)

## Where to Find Royalty-Free Sounds

You can download free ambient sounds from:

- **Freesound.org** - https://freesound.org/
- **Zapsplat.com** - https://www.zapsplat.com/
- **Mixkit.co** - https://mixkit.co/free-sound-effects/
- **BBC Sound Effects** - https://sound-effects.bbcrewind.co.uk/

## Current Implementation

For now, the app generates synthetic audio using Web Audio API oscillators to simulate these sounds. This allows the app to work without actual audio files.

To use real audio files:
1. Download the sounds from the sources above
2. Place them in this folder with the exact names listed above
3. Update the `useAudioEngine.ts` hook to load from these files instead of generating synthetic audio

## License

Make sure any audio files you use are properly licensed for your use case (personal, commercial, etc.).
