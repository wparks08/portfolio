"use strict";
module.exports = (sequelize, DataTypes) => {
    const link = sequelize.define(
        "link",
        {
            name: DataTypes.STRING,
            url: DataTypes.STRING
        },
        {}
    );
    link.associate = function(models) {
        // associations can be defined here
        models.link.belongsTo(models.project);
    };
    return link;
};
