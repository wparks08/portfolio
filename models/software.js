"use strict";
module.exports = (sequelize, DataTypes) => {
    const software = sequelize.define(
        "software",
        {
            name: DataTypes.STRING
        },
        {}
    );
    software.associate = function(models) {
        // associations can be defined here
        models.software.belongsToMany(models.project, {
          through: "projects_software"
        });
    };
    return software;
};
