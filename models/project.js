"use strict";
module.exports = (sequelize, DataTypes) => {
    const project = sequelize.define(
        "project",
        {
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            imagePath: DataTypes.STRING
        },
        {}
    );
    project.associate = function(models) {
        // associations can be defined here
        models.project.belongsToMany(models.software, {
            as: "stack",
            through: "projects_software"
        });

        models.project.hasMany(models.link);
    };
    return project;
};
