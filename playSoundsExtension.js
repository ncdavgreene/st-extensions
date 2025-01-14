(function () {
    // Register a custom slash command
    const playSoundCommand = {
        command: "/playsound",
        description: "Play a custom sound file.",
        action: (args) => {
            // Extract the sound name from the args
            const soundName = args.join(" ");
            if (!soundName) {
                alert("Please specify a sound name!");
                return;
            }

            // Path to the sound file
            const soundPath = `sounds/${soundName}.mp3`;

            // Create and play audio
            const audio = new Audio(soundPath);
            audio.play().catch((error) => {
                console.error("Error playing sound:", error);
                alert(`Sound "${soundName}" not found or cannot be played.`);
            });
        },
    };

    // Register the command with SillyTavern
    window.registerSlashCommand(playSoundCommand);
})();
