const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("portals")
    .setDescription("Fetch current portal locations on Dakal 2"),
  async execute(interaction) {
    const content = await fetch(
      "https://api.dofus-portals.fr/internal/v1/servers/dakal_2/portals"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        return data.map((portal) => {
          const location = portal.position
            ? `[${portal.position.x}, ${portal.position.y}]`
            : "Location Unknown";

          const dimension = {
            ecaflipus: "Ecaflipus",
            enutrosor: "Enurado",
            srambad: "Srambad",
            xelorium: "Xelorium",
          }[portal.dimension];

          return { dimension, location };
        });
      })
      .then((portals) => {
        return portals
          .map(({ dimension, location }) => {
            return `${dimension}: **${location}**`;
          })
          .join("\n");
      });

    await interaction.reply({
      content,
      flags: 64,
    });
  },
};
