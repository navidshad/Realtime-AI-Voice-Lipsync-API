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
async function generateSpeech(text, outputDir) {
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

    // Convert WAV to OGG using FFmpeg
    await execFileAsync("ffmpeg", [
      "-i",
      wavFile,
      "-c:a",
      "libvorbis",
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
async function processWithRhubarb(audioFile, outputDir, options = {}) {
  const outputFile = path.join(outputDir, "output.json");

  try {
    // Process with Rhubarb
    const args = [audioFile, "-o", outputFile, "-f", "json"];

    // Add extended shapes if specified
    if (options.extendedShapes) {
      args.push("--extendedShapes", options.extendedShapes);
    }

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
    original: rhubarbData,
  };
}

lipsyncRouter.get("/generate", async (req, res) => {
  try {
    const { text, options } = req.query;

    if (!text) {
      return res.status(400).json({ error: "Text input is required" });
    }

    // Create temporary directory for this request
    const tempDir = await fs.mkdtemp(path.join("./", "tts-"));

    // Step 1: Generate speech and convert to OGG
    const audioFiles = await generateSpeech(text, tempDir);

    // Step 2: Process with Rhubarb
    const lipSyncData = await processWithRhubarb(
      audioFiles.oggFile,
      tempDir,
      options
    );

    // read wave file as raw data
    const waveData = await fs.readFile(audioFiles.wavFile);

    await fs.rm(tempDir, { recursive: true, force: true });

    // Send response with both lip sync data and audio URLs
    res.json({
      lipSync: lipSyncData,
      waveData,
    });
  } catch (error) {
    console.error("Error in generate endpoint:", error);
    res.status(500).json({ error: "Failed to process text to lip sync" });
  }
});

export default lipsyncRouter;
