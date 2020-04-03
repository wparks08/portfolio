"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("projects", "order", Sequelize.INTEGER);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("projects", "order");
    }
};
