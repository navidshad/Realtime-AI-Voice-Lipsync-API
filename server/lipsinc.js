import { Router } from "express";
import OpenAI from "openai";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API endpoints
const lipsyncRouter = Router();

/**
 * Generate speech from text using OpenAI and convert to OGG format
 * @param {string} text - Input text to convert to speech
 * @param {string} outputDir - Directory to save audio files
 * @return {Promise<Object>} Paths to the generated audio files
 */
async function generateSpeechFromText(text, outputDir) {
  const wavFile = path.join(outputDir, `${uuidv4()}.wav`);
  const oggFile = path.join(outputDir, `${uuidv4()}.ogg`);

  try {
    // Generate speech using OpenAI
    const waveFile = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      response_format: "wav",
    });

    // Save WAV file
    const buffer = Buffer.from(await waveFile.arrayBuffer());
    await fs.writeFile(wavFile, buffer);

    // write dialog.txt
    await fs.writeFile("dialog.txt", text);

    // Convert WAV to OGG using FFmpeg
    await execFileAsync("ffmpeg", [
      "-i",
      wavFile,
      "-c:a",
      "libvorbis",
      "-d",
      "dialog.txt",
      oggFile,
    ]);

    return {
      wavFile,
      oggFile,
    };
  } catch (error) {
    console.error("Error in speech generation:", error);
    throw error;
  }
}

/**
 * Process audio file with Rhubarb Lip Sync
 * @param {string} audioFile - Path to the audio file
 * @param {string} outputDir - Directory for output files
 * @param {Object} options - Rhubarb configuration options
 * @return {Promise<Object>} Processed lip sync data
 */
async function processWithRhubarb(audioFile, outputDir, text, options = {}) {
  const outputFile = path.join(outputDir, "output.json");

  try {
    // Process with Rhubarb
    const args = [audioFile, "-o", outputFile, "-f", "json"];

    if (text) {
      const dialogFile = path.join(outputDir, "dialog.txt");
      await fs.writeFile(dialogFile, text);
      args.push("-d", dialogFile);
    }

    // Add extended shapes if specified
    args.push("--extendedShapes", options.extendedShapes || "");

    // Run Rhubarb
    await execFileAsync(options.rhubarbPath || "rhubarb", args);

    // Read output file
    const outputData = await fs.readFile(outputFile, "utf8");
    const lipSyncData = JSON.parse(outputData);

    // Convert to talking head format
    return convertToTalkingHeadFormat(lipSyncData, 22050);
  } catch (error) {
    console.error("Error in Rhubarb processing:", error);
    throw error;
  }
}

/**
 * Convert Rhubarb mouth shapes to Oculus OVR visemes for Talking Head
 * @param {Object} rhubarbData - Parsed Rhubarb output
 * @param {number} sampleRate - Sample rate of the audio
 * @return {Object} Data formatted for Talking Head
 */
function convertToTalkingHeadFormat(rhubarbData, sampleRate) {
  // Map from Rhubarb mouth shapes to Oculus OVR visemes
  const mouthShapeToViseme = {
    A: "PP", // Closed mouth for "P", "B", and "M" sounds
    B: "kk", // Clenched teeth
    C: "E", // Open mouth
    D: "aa", // Wide open mouth
    E: "O", // Slightly rounded mouth
    F: "U", // Puckered lips
    G: "FF", // Upper teeth touching lower lip
    H: "nn", // Tongue visible, raised behind upper teeth
    X: "sil", // Idle position
  };

  const mouthCues = rhubarbData.mouthCues;
  const visemes = [];
  const vtimes = [];
  const vdurations = [];

  // Extract duration from metadata or calculate from last cue
  const duration =
    rhubarbData.metadata?.duration ||
    mouthCues[mouthCues.length - 1].end ||
    mouthCues[mouthCues.length - 1].start;

  // Process mouth cues
  for (let i = 0; i < mouthCues.length; i++) {
    const cue = mouthCues[i];
    const nextCue = mouthCues[i + 1];

    const startTime = cue.start || cue.time;
    const endTime = cue.end || (nextCue ? nextCue.start : duration);

    visemes.push(mouthShapeToViseme[cue.value] || "sil");
    vtimes.push(startTime * 1000);
    vdurations.push((endTime - startTime) * 1000);
  }

  return {
    visemes,
    vtimes,
    vdurations,
    totalDurationInMs: duration * 1000,
    rhubarbData,
  };
}

lipsyncRouter.get("/generate", async (req, res) => {
  let tempDir = "temp";

  try {
    const { text, options } = req.query;

    if (!text) {
      return res.status(400).json({ error: "Text input is required" });
    }

    // Create temporary directory for this request
    tempDir = await fs.mkdtemp(path.join("./", "tts-"));

    // Step 1: Generate speech and convert to OGG
    const audioFiles = await generateSpeechFromText(text, tempDir);

    // Step 2: Process with Rhubarb
    const lipSyncData = await processWithRhubarb(
      audioFiles.oggFile,
      tempDir,
      text,
      options
    );

    // read wave file as raw data
    const waveData = await fs.readFile(audioFiles.wavFile);

    // Convert to Base64 for safe JSON transmission
    const base64Data = waveData.toString("base64");

    await fs.rm(tempDir, { recursive: true, force: true });

    // Send response with both lip sync data and audio URLs
    res.json({
      ...lipSyncData,
      audio: {
        type: "pcm",
        encoding: "base64",
        data: base64Data,
      },
    });

    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    await fs.rm(tempDir, { recursive: true, force: true });
    console.error("Error in generate endpoint:", error);
    res.status(500).json({ error: "Failed to process text to lip sync" });
  }
});

lipsyncRouter.post("/generate-from-file", async (req, res) => {
  let tempDir = "temp";

  try {
    // Get the audio file from the request
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    // Create temporary directory for this request
    tempDir = await fs.mkdtemp(path.join("./", "audio-"));

    const audioFile = req.files.audio;
    const inputAudioPath = path.join(tempDir, "input.webm");

    // Move the uploaded file to our temp directory
    await audioFile.mv(inputAudioPath);

    // Convert WebM to OGG using FFmpeg
    const oggFile = path.join(tempDir, "output.ogg");
    await execFileAsync("ffmpeg", [
      "-i",
      inputAudioPath,
      "-c:a",
      "libvorbis",
      oggFile,
    ]);

    // Process with Rhubarb
    const lipSyncData = await processWithRhubarb(
      oggFile,
      tempDir,
      req.body?.text || null,
      req.query.options
    );

    // Convert the original audio to WAV for consistency
    const wavFile = path.join(tempDir, "output.wav");
    await execFileAsync("ffmpeg", [
      "-i",
      inputAudioPath,
      "-acodec",
      "pcm_s16le",
      "-ar",
      "22050",
      wavFile,
    ]);

    // Send response with both lip sync data and audio
    res.json(lipSyncData);

    // Clean up temporary files
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    // Clean up temporary files
    await fs.rm(tempDir, { recursive: true, force: true });

    console.error("Error in generate-from-webm endpoint:", error);
    res
      .status(500)
      .json({ error: "Failed to process audio file for lip sync" });
  }
});

export default lipsyncRouter;
