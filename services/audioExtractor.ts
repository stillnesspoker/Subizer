import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const loadFfmpeg = async (): Promise<FFmpeg> => {
    if (ffmpeg) {
        return ffmpeg;
    }
    
    ffmpeg = new FFmpeg();
    // Match the core version with the library version from importmap (^0.12.10)
    const baseURL = 'https://aistudiocdn.com/@ffmpeg/core@^0.12.10/dist/esm';
    
    ffmpeg.on('log', ({ message }) => {
        console.log(message);
    });

    // Explicitly loading the single-threaded core is safer in environments
    // that may lack COOP/COEP headers required for the multi-threaded version.
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    return ffmpeg;
};

export const extractAudio = async (videoFile: File): Promise<File> => {
    const ffmpegInstance = await loadFfmpeg();
    const inputFileName = 'input.mp4'; // Use a consistent name
    const outputFileName = 'output.mp3';

    // Write the video file to FFmpeg's virtual file system
    await ffmpegInstance.writeFile(inputFileName, new Uint8Array(await videoFile.arrayBuffer()));

    // Run the FFmpeg command to extract audio
    // -i: input file
    // -vn: no video output
    // -acodec libmp3lame: use MP3 codec for audio
    // -q:a 2: audio quality (0-9, lower is better)
    await ffmpegInstance.exec(['-i', inputFileName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', outputFileName]);

    // Read the resulting audio file
    const data = await ffmpegInstance.readFile(outputFileName);

    // Convert the Uint8Array to a Blob, then to a File
    const audioBlob = new Blob([data], { type: 'audio/mpeg' });
    const audioFile = new File([audioBlob], 'extracted_audio.mp3', {
        type: 'audio/mpeg',
        lastModified: new Date().getTime(),
    });

    // Clean up virtual files
    await ffmpegInstance.deleteFile(inputFileName);
    await ffmpegInstance.deleteFile(outputFileName);

    return audioFile;
};