import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { SlashCommandArgument } from '../../../slash-commands/SlashCommandArgument.js';
import { SlashCommandEnumValue, enumTypes } from '../../../slash-commands/SlashCommandEnumValue.js';
import { enumIcons } from '../../../slash-commands/SlashCommandCommonEnumsProvider.js';

const DEBUG_PREFIX = '<PlaySound Extension>';
const SOUNDS_FOLDER = 'extensions/PlaySound/sounds';

// Initialize the sound folder and available sounds
let availableSounds = [];

async function loadAvailableSounds() {
    try {
        const response = await fetch(`${SOUNDS_FOLDER}/list.json`);
        availableSounds = response.ok ? await response.json() : [];
        console.debug(DEBUG_PREFIX, 'Loaded available sounds:', availableSounds);
    } catch (error) {
        console.error(DEBUG_PREFIX, 'Failed to load available sounds:', error);
    }
}

// Command to play a sound
async function playSoundSlashCommand(_, soundName) {
    if (!soundName) {
        console.log(DEBUG_PREFIX, 'No sound name provided');
        return '';
    }

    // Match sound name
    const soundPath = availableSounds.find(sound => sound.toLowerCase() === soundName.trim().toLowerCase());
    if (!soundPath) {
        console.log(DEBUG_PREFIX, 'Sound not found:', soundName);
        return '';
    }

    // Play the sound
    const audio = new Audio(`${SOUNDS_FOLDER}/${soundPath}`);
    audio.play().catch(error => console.error(DEBUG_PREFIX, 'Error playing sound:', error));

    return '';
}

// Register the slash command
jQuery(async () => {
    console.debug(DEBUG_PREFIX, 'Loading PlaySound Extension...');
    await loadAvailableSounds();

    SlashCommandParser.addCommandObject(SlashCommand.fromProps({
        name: 'playsound',
        helpString: 'Play a custom sound from the available sounds.',
        callback: playSoundSlashCommand,
        unnamedArgumentList: [
            SlashCommandArgument.fromProps({
                description: 'Sound name',
                isRequired: true,
                acceptsMultiple: false,
                enumProvider: () => availableSounds.map(
                    sound => new SlashCommandEnumValue(sound, null, enumTypes.string, enumIcons.file)
                ),
            }),
        ],
    }));
});
